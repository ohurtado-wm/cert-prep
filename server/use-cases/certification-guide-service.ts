import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { AiTokenUsageSchema, type AiTokenUsage } from '../../src/api/ai-usage-contracts'
import {
  CertificationGuideResponseSchema,
  GuideDomainSchema,
  GuideResearchSourceSchema,
  StudyPathStepSchema,
  type CertificationCatalogItem,
  type CertificationGuideResponse,
  type GuideDomain,
  type GuideResearchSource,
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
  syncCertificationCatalog,
} from '../catalog/repository'
import {
  createAiGuideGenerator,
  GuideDraftSchema,
  hashGuideResearchSources,
  isExpectedGuideResearch,
  type GuideGenerator,
} from '../catalog/guide-generator'
import type { CachedGuideSources } from '../catalog/source-types'
import { errorLogDetails, logServerEvent } from '../logger'
import { GUIDE_MAX_AGE_MS } from '../config/runtime-limits'

const LEASE_DURATION_MS = 90 * 1_000
const WEIGHT_SUM_TOLERANCE = 0.000001

type GuideServiceOptions = {
  guideGenerator?: GuideGenerator
  now?: () => Date
  peerWaitMs?: number
  peerPollMs?: number
}

function isFresh(guide: Awaited<ReturnType<typeof readCertificationGuide>>, now: Date) {
  return Boolean(guide?.lastAiRefreshedAt
    && now.getTime() - guide.lastAiRefreshedAt.getTime() < GUIDE_MAX_AGE_MS)
}

function normalizeDraft(
  certification: CertificationCatalogItem,
  rawDraft: unknown,
): { domains: GuideDomain[]; studyPath: StudyPathStep[] } {
  const draft = GuideDraftSchema.parse(rawDraft)
  const sectionNumbers = draft.domains.map((domain) => domain.sectionNumber)
  if (new Set(sectionNumbers).size !== sectionNumbers.length) {
    throw new Error('Generated guide contains duplicate section numbers.')
  }
  const allocatedWeights = draft.domains.map((domain) => {
    if (domain.weightRange.min > domain.weightRange.max) {
      throw new Error(`Generated guide section ${domain.sectionNumber} has an invalid official weight range.`)
    }
    const midpoint = (domain.weightRange.min + domain.weightRange.max) / 2
    if (Math.abs(domain.weight - midpoint) > WEIGHT_SUM_TOLERANCE) {
      throw new Error(`Generated guide section ${domain.sectionNumber} weight does not match its official value or range midpoint.`)
    }
    return midpoint
  })
  const totalWeight = allocatedWeights.reduce((sum, weight) => sum + weight, 0)
  if (Math.abs(totalWeight - 100) > WEIGHT_SUM_TOLERANCE) {
    throw new Error(`Generated guide domain weights total ${totalWeight}%, not 100%.`)
  }

  const domains = draft.domains.map((generated, index): GuideDomain => {
    const weight = allocatedWeights[index]
    if (weight === undefined) throw new Error(`Generated guide section ${generated.sectionNumber} has no allocation weight.`)
    return GuideDomainSchema.parse({
      id: `section-${generated.sectionNumber}`,
      sourceSectionNumber: generated.sectionNumber,
      name: generated.name,
      description: generated.description,
      weight,
      weightRange: generated.weightRange,
      topics: generated.topics.map((topic, index) => ({
        id: `topic-${generated.sectionNumber}-${index + 1}`,
        name: topic.name,
        description: topic.description,
      })),
    })
  })

  if (Math.abs(domains.reduce((sum, domain) => sum + domain.weight, 0) - 100) > WEIGHT_SUM_TOLERANCE) {
    throw new Error('Guide domain weights do not total 100%.')
  }
  const domainIds = new Set(domains.map((domain) => domain.id))
  const learningPathUrl = certification.sources.find((source) => source.kind === 'learning-path')?.url
  if (!learningPathUrl) throw new Error('The certification has no learning path.')
  const studyPath = draft.studyPath.map((step, index): StudyPathStep => {
    if (step.domainIds.some((id) => !domainIds.has(id))
      || new Set(step.domainIds).size !== step.domainIds.length) {
      throw new Error('Generated study path refers to an unknown or repeated domain.')
    }
    return StudyPathStepSchema.parse({ id: `step-${index + 1}`, ...step, url: learningPathUrl })
  })

  return { domains, studyPath }
}

function toResponse(
  certification: CertificationCatalogItem,
  guide: NonNullable<Awaited<ReturnType<typeof readCertificationGuide>>>,
): CertificationGuideResponse {
  if (!guide.lastAiRefreshedAt) throw new ApiException(503, 'GUIDE_STALE', 'La guía aún no se ha podido preparar.')
  return CertificationGuideResponseSchema.parse({
    certification,
    version: guide.version,
    domains: guide.domains,
    studyPath: guide.studyPath,
    sources: certification.sources,
    researchSources: (guide.sourceSnapshot as CachedGuideSources | null)?.sources ?? [],
    aiUsage: guide.aiUsage ?? null,
    freshness: {
      aiRefreshedAt: guide.lastAiRefreshedAt.toISOString(),
      sourceCheckedAt: guide.lastSourceCheckedAt?.toISOString() ?? null,
    },
  })
}

function unwrapGuideGeneration(value: unknown): {
  draft: unknown
  aiUsage: AiTokenUsage | null
  researchSources: GuideResearchSource[]
} {
  if (typeof value !== 'object' || value === null || !('output' in value)) {
    return { draft: value, aiUsage: null, researchSources: [] }
  }
  const generated = value as { output: unknown; usage?: unknown; researchSources?: unknown }
  const usage = AiTokenUsageSchema.safeParse(generated.usage)
  const sources = z.array(GuideResearchSourceSchema).max(20).safeParse(generated.researchSources)
  return {
    draft: generated.output,
    aiUsage: usage.success ? usage.data : null,
    researchSources: sources.success ? sources.data : [],
  }
}

function sleep(durationMs: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, durationMs))
}

export function createCertificationGuideService(db: DatabaseHandle, options: GuideServiceOptions = {}) {
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
      if (isFresh(current, now())) return current
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
    if (isFresh(current, requestTime) && current) {
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
      if (shared && isFresh(shared, now())) return toResponse(certification, shared)
      throw new ApiException(503, 'GUIDE_REFRESH_IN_PROGRESS', 'La guía se está actualizando. Intenta de nuevo en unos segundos.')
    }

    const refreshStartedAt = Date.now()
    let stage = 'ai_generation'
    let aiUsage: AiTokenUsage | null = null
    let researchSources: GuideResearchSource[] = []
    try {
      let generated: unknown
      const generationStartedAt = Date.now()
      try {
        generated = await guideGenerator({ certification })
        const generation = unwrapGuideGeneration(generated)
        generated = generation.draft
        aiUsage = generation.aiUsage
        researchSources = generation.researchSources
        logServerEvent('info', 'guide_ai_generation_completed', {
          certificationId,
          durationMs: Date.now() - generationStartedAt,
          inputTokens: aiUsage?.inputTokens ?? null,
          outputTokens: aiUsage?.outputTokens ?? null,
          totalTokens: aiUsage?.totalTokens ?? null,
        })
      } catch (error) {
        if (error instanceof ApiException) throw error
        throw new ApiException(503, 'GUIDE_AI_UNAVAILABLE', 'No se pudo renovar la guía con IA. Intenta de nuevo.')
      }

      let normalized: { domains: GuideDomain[]; studyPath: StudyPathStep[] }
      stage = 'guide_validation'
      try {
        if (!isExpectedGuideResearch(certification, researchSources)) {
          throw new Error('Generated guide is missing a citation to its official exam guide.')
        }
        normalized = normalizeDraft(certification, generated)
      } catch (error) {
        const rawDraft = typeof generated === 'object' && generated !== null
          ? generated as Record<string, unknown>
          : {}
        const draftDomains = Array.isArray(rawDraft.domains) ? rawDraft.domains : []
        const draftStudyPath = Array.isArray(rawDraft.studyPath) ? rawDraft.studyPath : []
        const totalWeight = draftDomains.reduce((sum: number, domain: unknown) => {
          if (typeof domain !== 'object' || domain === null) return sum
          const record = domain as Record<string, unknown>
          const range = record.weightRange
          if (typeof range === 'object' && range !== null) {
            const { min, max } = range as Record<string, unknown>
            if (typeof min === 'number' && typeof max === 'number') return sum + (min + max) / 2
          }
          const weight = record.weight
          return typeof weight === 'number' && Number.isFinite(weight) ? sum + weight : sum
        }, 0)
        logServerEvent('error', 'guide_ai_validation_failed', {
          certificationId,
          domainCount: draftDomains.length,
          totalDomainWeight: Number(totalWeight.toFixed(6)),
          studyPathStepCount: draftStudyPath.length,
          researchSourceCount: researchSources.length,
          ...errorLogDetails(error),
        })
        throw new ApiException(502, 'GUIDE_AI_INVALID', 'La guía generada no cumple el formato esperado. Intenta de nuevo.')
      }

      stage = 'guide_publish'
      const publishedAt = now()
      await publishGuide(db, {
        certificationId,
        ...normalized,
        aiUsage,
        sourceHash: hashGuideResearchSources(researchSources),
        sourceSnapshot: { sources: researchSources },
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
      throw new ApiException(503, 'GUIDE_REFRESH_FAILED', 'No se pudo renovar la guía de estudio. Intenta de nuevo.')
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
