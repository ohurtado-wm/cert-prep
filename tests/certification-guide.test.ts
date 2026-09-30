import { beforeEach, describe, expect, test } from 'bun:test'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { certificationCatalog } from '../server/catalog/certifications'
import { createAiGuideGenerator, type GuideGenerator } from '../server/catalog/guide-generator'
import type { OfficialSourceReader } from '../server/catalog/source-reader'
import type { CachedOfficialSources } from '../server/catalog/source-types'
import { createDatabase } from '../server/db/client'
import { getCertificationGuide } from '../server/catalog/repository'
import { createCertificationGuideService } from '../server/use-cases/certification-guide-service'
import { createApp } from '../server/app'

const certification = certificationCatalog[0]
const sectionWeights = [33, 26, 19, 22]

function sourceSnapshot(variant = 'v1'): CachedOfficialSources {
  return {
    examGuide: {
      sections: sectionWeights.map((weight, index) => ({
        number: index + 1,
        title: `Domain ${index + 1} ${variant}`,
        weight,
        topics: [{
          id: `topic-${index + 1}-1-1`,
          title: `Topic ${index + 1}`,
          details: `Source notes ${variant}`,
        }],
      })),
      validators: { etag: `guide-${variant}`, lastModified: null },
    },
    learningPath: {
      activities: ['Foundations', 'Build', 'Deploy'],
      validators: { etag: `path-${variant}`, lastModified: null },
    },
  }
}

function draftFromSources(sources: CachedOfficialSources, titleSuffix = '') {
  return {
    domains: sources.examGuide.sections.map((section) => ({
      sectionNumber: section.number,
      name: { en: `${section.title}${titleSuffix}`, es: `Dominio ${section.number}${titleSuffix}` },
      description: { en: `Study ${section.title}.`, es: `Estudia el dominio ${section.number}.` },
      topics: section.topics.map((topic) => ({
        sourceTopicId: topic.id,
        name: { en: topic.title, es: `Tema ${section.number}` },
        description: { en: topic.details, es: `Contenido del tema ${section.number}.` },
      })),
    })),
    studyPath: ['Understand', 'Practice', 'Review'].map((verb, index) => ({
      title: { en: `${verb} the domains`, es: `Repasa los dominios ${index + 1}` },
      description: { en: `Step ${index + 1}.`, es: `Paso ${index + 1}.` },
      domainIds: [`section-${index + 1}`],
      url: certification.sources.find((source) => source.kind === 'exam-guide')!.url,
    })),
  }
}

describe('certification guide refresh', () => {
  let client: ReturnType<typeof createDatabase>['client']
  let db: ReturnType<typeof createDatabase>['db']

  beforeEach(() => {
    const database = createDatabase(':memory:')
    client = database.client
    db = database.db
    migrate(db, { migrationsFolder: './drizzle' })
  })

  test('catalog endpoint returns the supported certification without fetching upstream', async () => {
    const app = createApp({
      db,
      sourceReader: async () => { throw new Error('catalog listing must not fetch sources') },
      guideGenerator: async () => { throw new Error('catalog listing must not call AI') },
    })
    const response = await app.request('/api/v1/certifications')
    const body = await response.json() as { certifications: Array<{ id: string; sources: unknown[] }> }
    expect(response.status).toBe(200)
    expect(body.certifications).toHaveLength(1)
    expect(body.certifications[0]?.id).toBe('gcp-professional-cloud-developer')
    expect(body.certifications[0]?.sources).toHaveLength(3)
    client.close()
  })

  test('first selection refreshes from sources and subsequent fresh reads avoid AI', async () => {
    let sourceCalls = 0
    let aiCalls = 0
    const sourceReader: OfficialSourceReader = async () => {
      sourceCalls += 1
      return { snapshot: sourceSnapshot(), hash: 'guide-hash-v1' }
    }
    const guideGenerator: GuideGenerator = async ({ sources }) => {
      aiCalls += 1
      return draftFromSources(sources)
    }
    const app = createApp({ db, sourceReader, guideGenerator })

    const first = await app.request(`/api/v1/certifications/${certification.id}/guide`)
    const firstBody = await first.json() as { guide: { version: number; domains: unknown[]; studyPath: unknown[]; sources: unknown[] } }
    const second = await app.request(`/api/v1/certifications/${certification.id}/guide`)
    expect(first.status).toBe(200)
    expect(firstBody.guide.version).toBe(1)
    expect(firstBody.guide.domains).toHaveLength(4)
    expect(firstBody.guide.studyPath).toHaveLength(3)
    expect(firstBody.guide.sources).toHaveLength(3)
    expect(second.status).toBe(200)
    expect(sourceCalls).toBe(1)
    expect(aiCalls).toBe(1)
    client.close()
  })

  test('weekly refresh calls AI for unchanged sources without incrementing the content version', async () => {
    let currentTime = new Date('2026-09-30T12:00:00.000Z')
    let aiCalls = 0
    const service = createCertificationGuideService(db, {
      now: () => new Date(currentTime),
      sourceReader: async () => ({ snapshot: sourceSnapshot(), hash: 'same-source-hash' }),
      guideGenerator: async ({ sources }) => { aiCalls += 1; return draftFromSources(sources) },
    })

    const first = await service.getGuide(certification.id)
    currentTime = new Date(currentTime.getTime() + 7 * 24 * 60 * 60 * 1_000)
    const refreshed = await service.getGuide(certification.id)
    expect(aiCalls).toBe(2)
    expect(first.version).toBe(1)
    expect(refreshed.version).toBe(1)
    expect(refreshed.freshness.aiRefreshedAt).toBe(currentTime.toISOString())
    client.close()
  })

  test('changed generated guide publishes a new version atomically', async () => {
    let currentTime = new Date('2026-09-30T12:00:00.000Z')
    let contentSuffix = ''
    let sourceVersion = 'v1'
    const service = createCertificationGuideService(db, {
      now: () => new Date(currentTime),
      sourceReader: async () => ({ snapshot: sourceSnapshot(sourceVersion), hash: `hash-${sourceVersion}` }),
      guideGenerator: async ({ sources }) => draftFromSources(sources, contentSuffix),
    })

    const first = await service.getGuide(certification.id)
    currentTime = new Date(currentTime.getTime() + 7 * 24 * 60 * 60 * 1_000)
    sourceVersion = 'v2'
    contentSuffix = ' refreshed'
    const refreshed = await service.getGuide(certification.id)
    expect(first.version).toBe(1)
    expect(refreshed.version).toBe(2)
    expect(refreshed.domains[0]?.name.en).toContain('refreshed')
    client.close()
  })

  test('concurrent stale-guide requests share one refresh lease', async () => {
    let sourceCalls = 0
    let aiCalls = 0
    const service = createCertificationGuideService(db, {
      peerWaitMs: 500,
      peerPollMs: 5,
      sourceReader: async () => { sourceCalls += 1; return { snapshot: sourceSnapshot(), hash: 'parallel-hash' } },
      guideGenerator: async ({ sources }) => {
        aiCalls += 1
        await new Promise((resolve) => setTimeout(resolve, 30))
        return draftFromSources(sources)
      },
    })

    const results = await Promise.all([
      service.getGuide(certification.id),
      service.getGuide(certification.id),
    ])
    expect(results.map((result) => result.version)).toEqual([1, 1])
    expect(sourceCalls).toBe(1)
    expect(aiCalls).toBe(1)
    client.close()
  })

  test('AI failure leaves the last good guide intact and returns a recoverable error', async () => {
    let currentTime = new Date('2026-09-30T12:00:00.000Z')
    let fail = false
    const service = createCertificationGuideService(db, {
      now: () => new Date(currentTime),
      sourceReader: async () => ({ snapshot: sourceSnapshot(), hash: 'failure-hash' }),
      guideGenerator: async ({ sources }) => {
        if (fail) throw new Error('private provider details')
        return draftFromSources(sources)
      },
    })

    const original = await service.getGuide(certification.id)
    currentTime = new Date(currentTime.getTime() + 7 * 24 * 60 * 60 * 1_000)
    fail = true
    await expect(service.getGuide(certification.id)).rejects.toMatchObject({
      code: 'GUIDE_AI_UNAVAILABLE',
      status: 503,
      message: 'No se pudo renovar la guía con IA. Intenta de nuevo.',
    })
    const stored = await getCertificationGuide(db, certification.id)
    expect(stored?.version).toBe(1)
    expect(stored?.lastAiRefreshedAt?.toISOString()).toBe(original.freshness.aiRefreshedAt)
    expect(stored?.domains[0]?.name.en).toBe(original.domains[0]?.name.en)
    client.close()
  })

  test('invalid AI output cannot replace a valid published guide', async () => {
    let currentTime = new Date('2026-09-30T12:00:00.000Z')
    let invalid = false
    const service = createCertificationGuideService(db, {
      now: () => new Date(currentTime),
      sourceReader: async () => ({ snapshot: sourceSnapshot(), hash: 'invalid-output-hash' }),
      guideGenerator: async ({ sources }) => {
        const draft = draftFromSources(sources)
        if (!invalid) return draft
        return {
          ...draft,
          studyPath: draft.studyPath.map((step, index) => index === 0 ? { ...step, url: 'https://attacker.example/' } : step),
        }
      },
    })

    await service.getGuide(certification.id)
    currentTime = new Date(currentTime.getTime() + 7 * 24 * 60 * 60 * 1_000)
    invalid = true
    await expect(service.getGuide(certification.id)).rejects.toMatchObject({ code: 'GUIDE_AI_INVALID', status: 502 })
    const stored = await getCertificationGuide(db, certification.id)
    expect(stored?.version).toBe(1)
    expect(stored?.studyPath[0]?.url).toBe(certification.sources.find((source) => source.kind === 'exam-guide')?.url)
    client.close()
  })

  test('AI generation stays disabled until a model is configured', async () => {
    const generate = createAiGuideGenerator('')
    await expect(generate({ certification, sources: sourceSnapshot() })).rejects.toMatchObject({
      code: 'AI_NOT_CONFIGURED',
      status: 503,
    })
    client.close()
  })
})
