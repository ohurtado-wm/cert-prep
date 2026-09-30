import { randomUUID } from 'node:crypto'
import {
  CertificationGuideResponseSchema,
  GuideDomainSchema,
  StudyPathStepSchema,
  type CertificationCatalogItem,
  type CertificationGuideResponse,
  type GuideDomain,
  type StudyPathStep,
} from '../../src/api/certification-contracts'
import type { DatabaseHandle } from '../db/client'
import { ApiException } from '../errors'
import { certificationCatalog, getCertificationDefinition } from '../catalog/certifications'
import {
  acquireRefreshLease,
  getCertificationGuide as readCertificationGuide,
  publishGuide,
  releaseRefreshLease,
  refreshLeaseIsActive,
  saveSourceCheck,
  syncCertificationCatalog,
} from '../catalog/repository'
import { createAiGuideGenerator, GuideDraftSchema, type GuideGenerator } from '../catalog/guide-generator'
import { createOfficialSourceReader, type OfficialSourceReader } from '../catalog/source-reader'
import type { CachedOfficialSources } from '../catalog/source-types'
import { logServerEvent } from '../logger'

const GUIDE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1_000
const LEASE_DURATION_MS = 90 * 1_000

type GuideServiceOptions = {
  sourceReader?: OfficialSourceReader
  guideGenerator?: GuideGenerator
  now?: () => Date
  peerWaitMs?: number
  peerPollMs?: number
}

function isFresh(lastAiRefreshedAt: Date | null, now: Date) {
  return lastAiRefreshedAt !== null && now.getTime() - lastAiRefreshedAt.getTime() < GUIDE_MAX_AGE_MS
}

function normalizeDraft(
  certification: CertificationCatalogItem,
  sourceSnapshot: CachedOfficialSources,
  rawDraft: unknown,
): { domains: GuideDomain[]; studyPath: StudyPathStep[] } {
  const draft = GuideDraftSchema.parse(rawDraft)
  const sourceSections = sourceSnapshot.examGuide.sections
  const sectionNumbers = sourceSections.map((section) => section.number).sort((a, b) => a - b)
  const draftSectionNumbers = draft.domains.map((domain) => domain.sectionNumber).sort((a, b) => a - b)
  if (new Set(draftSectionNumbers).size !== draftSectionNumbers.length
    || JSON.stringify(sectionNumbers) !== JSON.stringify(draftSectionNumbers)) {
    throw new Error('Generated guide sections do not match the official guide.')
  }

  const domains = sourceSections.map((sourceSection): GuideDomain => {
    const generated = draft.domains.find((domain) => domain.sectionNumber === sourceSection.number)!
    const expectedTopicIds = sourceSection.topics.map((topic) => topic.id).sort()
    const generatedTopicIds = generated.topics.map((topic) => topic.sourceTopicId).sort()
    if (new Set(generatedTopicIds).size !== generatedTopicIds.length
      || JSON.stringify(expectedTopicIds) !== JSON.stringify(generatedTopicIds)) {
      throw new Error(`Generated guide topics do not match official section ${sourceSection.number}.`)
    }

    return GuideDomainSchema.parse({
      id: `section-${sourceSection.number}`,
      sourceSectionNumber: sourceSection.number,
      name: generated.name,
      description: generated.description,
      weight: sourceSection.weight,
      topics: generated.topics.map((topic) => ({
        id: topic.sourceTopicId,
        name: topic.name,
        description: topic.description,
      })),
    })
  })

  if (domains.reduce((sum, domain) => sum + domain.weight, 0) !== 100) {
    throw new Error('Official domain weights do not total 100%.')
  }
  const domainIds = new Set(domains.map((domain) => domain.id))
  const allowedUrls = new Set(certification.sources.map((source) => source.url))
  const studyPath = draft.studyPath.map((step, index): StudyPathStep => {
    if (!allowedUrls.has(step.url)) throw new Error('Generated study path uses a non-official URL.')
    if (step.domainIds.some((id) => !domainIds.has(id))
      || new Set(step.domainIds).size !== step.domainIds.length) {
      throw new Error('Generated study path refers to an unknown or repeated domain.')
    }
    return StudyPathStepSchema.parse({ id: `step-${index + 1}`, ...step })
  })

  return { domains, studyPath }
}

function toResponse(
  certification: CertificationCatalogItem,
  guide: NonNullable<Awaited<ReturnType<typeof readCertificationGuide>>>,
): CertificationGuideResponse {
  if (!guide.lastSourceCheckedAt || !guide.lastAiRefreshedAt) {
    throw new ApiException(503, 'GUIDE_STALE', 'La guía aún no se ha podido verificar y renovar.')
  }
  return CertificationGuideResponseSchema.parse({
    certification,
    version: guide.version,
    domains: guide.domains,
    studyPath: guide.studyPath,
    sources: certification.sources,
    freshness: {
      sourceCheckedAt: guide.lastSourceCheckedAt.toISOString(),
      aiRefreshedAt: guide.lastAiRefreshedAt.toISOString(),
    },
  })
}

function sleep(durationMs: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, durationMs))
}

export function createCertificationGuideService(db: DatabaseHandle, options: GuideServiceOptions = {}) {
  const sourceReader = options.sourceReader ?? createOfficialSourceReader()
  const guideGenerator = options.guideGenerator ?? createAiGuideGenerator()
  const now = options.now ?? (() => new Date())
  const peerWaitMs = options.peerWaitMs ?? 80_000
  const peerPollMs = options.peerPollMs ?? 150

  async function syncCatalog() {
    await syncCertificationCatalog(db, certificationCatalog, now())
  }

  async function waitForPeerRefresh(certificationId: string) {
    const deadline = Date.now() + peerWaitMs
    while (Date.now() < deadline) {
      const current = await readCertificationGuide(db, certificationId)
      if (isFresh(current?.lastAiRefreshedAt ?? null, now())) return current
      if (!await refreshLeaseIsActive(db, certificationId, now())) return null
      await sleep(Math.min(peerPollMs, Math.max(1, deadline - Date.now())))
    }
    return null
  }

  async function getGuide(certificationId: string): Promise<CertificationGuideResponse> {
    const certification = getCertificationDefinition(certificationId)
    if (!certification) throw new ApiException(404, 'CERTIFICATION_NOT_FOUND', 'No se encontró esa certificación.')
    await syncCatalog()

    const current = await readCertificationGuide(db, certificationId)
    const requestTime = now()
    if (isFresh(current?.lastAiRefreshedAt ?? null, requestTime) && current) {
      logServerEvent('info', 'guide_cache_hit', { certificationId, version: current.version })
      return toResponse(certification, current)
    }

    logServerEvent('info', 'guide_refresh_started', {
      certificationId,
      reason: current ? 'stale' : 'missing',
    })
    const leaseToken = randomUUID()
    const leaseAcquired = await acquireRefreshLease(
      db,
      certificationId,
      requestTime,
      new Date(requestTime.getTime() + LEASE_DURATION_MS),
      leaseToken,
    )
    if (!leaseAcquired) {
      logServerEvent('info', 'guide_refresh_waiting', { certificationId, waitLimitMs: peerWaitMs })
      const shared = await waitForPeerRefresh(certificationId)
      if (shared && isFresh(shared.lastAiRefreshedAt, now())) return toResponse(certification, shared)
      throw new ApiException(503, 'GUIDE_REFRESH_IN_PROGRESS', 'La guía se está actualizando. Intenta de nuevo en unos segundos.')
    }

    const refreshStartedAt = Date.now()
    let stage = 'official_sources'
    try {
      const previous = await readCertificationGuide(db, certificationId)
      const sourceStartedAt = Date.now()
      const sourceResult = await sourceReader(certification, previous?.sourceSnapshot)
      logServerEvent('info', 'guide_sources_ready', {
        certificationId,
        durationMs: Date.now() - sourceStartedAt,
      })
      const checkedAt = now()
      if (previous) {
        await saveSourceCheck(db, certificationId, sourceResult.hash, sourceResult.snapshot, checkedAt)
      }

      let generated: unknown
      stage = 'ai_generation'
      const generationStartedAt = Date.now()
      try {
        generated = await guideGenerator({ certification, sources: sourceResult.snapshot })
        logServerEvent('info', 'guide_ai_generation_completed', {
          certificationId,
          durationMs: Date.now() - generationStartedAt,
        })
      } catch (error) {
        if (error instanceof ApiException) throw error
        throw new ApiException(503, 'GUIDE_AI_UNAVAILABLE', 'No se pudo renovar la guía con IA. Intenta de nuevo.')
      }

      let normalized: { domains: GuideDomain[]; studyPath: StudyPathStep[] }
      stage = 'guide_validation'
      try {
        normalized = normalizeDraft(certification, sourceResult.snapshot, generated)
      } catch {
        throw new ApiException(502, 'GUIDE_AI_INVALID', 'La guía generada no coincide con las fuentes oficiales. Intenta de nuevo.')
      }

      stage = 'guide_publish'
      const publishedAt = now()
      await publishGuide(db, {
        certificationId,
        ...normalized,
        sourceHash: sourceResult.hash,
        sourceSnapshot: sourceResult.snapshot,
        now: publishedAt,
        leaseToken,
      })
      const updated = await readCertificationGuide(db, certificationId)
      if (!updated) throw new ApiException(503, 'GUIDE_STALE', 'No se pudo publicar la guía renovada.')
      logServerEvent('info', 'guide_refresh_completed', {
        certificationId,
        version: updated.version,
        durationMs: Date.now() - refreshStartedAt,
      })
      return toResponse(certification, updated)
    } catch (error) {
      logServerEvent('error', 'guide_refresh_failed', {
        certificationId,
        stage,
        durationMs: Date.now() - refreshStartedAt,
        code: error instanceof ApiException ? error.code : 'UNEXPECTED_ERROR',
      })
      if (error instanceof ApiException) throw error
      throw new ApiException(503, 'GUIDE_REFRESH_FAILED', 'No se pudo renovar la guía oficial. Intenta de nuevo.')
    } finally {
      try {
        await releaseRefreshLease(db, certificationId, leaseToken)
      } catch {
        logServerEvent('warn', 'guide_refresh_lease_release_failed', { certificationId })
      }
    }
  }

  return {
    async listCatalog() {
      await syncCatalog()
      return { certifications: certificationCatalog }
    },
    getGuide,
  }
}
