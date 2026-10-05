import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'bun:test'
import { certificationCatalog } from '../server/catalog/certifications'
import {
  type GuideGenerator,
} from '../server/catalog/guide-generator'
import type { DatabaseHandle } from '../server/db/client'
import { getCertificationGuide } from '../server/catalog/repository'
import { createCertificationGuideService } from '../server/use-cases/certification-guide-service'
import { createApp } from '../server/app'
import { createTestDatabase } from './test-database'

const certification = certificationCatalog[0]
const sectionWeights = [17.5, 22.5, 30, 30]

function draftFromGuide(titleSuffix = '') {
  return {
    domains: sectionWeights.map((weight, index) => ({
      sectionNumber: index + 1,
      weight,
      name: { en: `Domain ${index + 1}${titleSuffix}`, es: `Dominio ${index + 1}${titleSuffix}` },
      description: { en: `Study domain ${index + 1}.`, es: `Estudia el dominio ${index + 1}.` },
      topics: [{
        name: { en: `Topic ${index + 1}`, es: `Tema ${index + 1}` },
        description: { en: `Topic details ${index + 1}.`, es: `Contenido del tema ${index + 1}.` },
      }],
    })),
    studyPath: ['Understand', 'Practice', 'Review'].map((verb, index) => ({
      title: { en: `${verb} the domains`, es: `Repasa los dominios ${index + 1}` },
      description: { en: `Step ${index + 1}.`, es: `Paso ${index + 1}.` },
      domainIds: [`section-${index + 1}`],
    })),
  }
}

function generatedGuide(output: ReturnType<typeof draftFromGuide>) {
  const examGuide = certification.sources.find((source) => source.kind === 'exam-guide')!
  return { output, researchSources: [{ title: examGuide.title, url: examGuide.url }] }
}

describe('certification guide refresh', () => {
  let db: DatabaseHandle
  let testDatabase: Awaited<ReturnType<typeof createTestDatabase>>

  beforeAll(async () => {
    testDatabase = await createTestDatabase()
    db = testDatabase.db
  })

  beforeEach(async () => testDatabase.reset())
  afterAll(async () => testDatabase?.close())

  test('catalog endpoint returns all supported certifications without fetching upstream', async () => {
    const app = createApp({
      db,
      guideGenerator: async () => { throw new Error('catalog listing must not call AI') },
    })
    const response = await app.request('/api/v1/certifications')
    const body = await response.json() as { certifications: Array<{ id: string; sources: unknown[] }> }
    expect(response.status).toBe(200)
    expect(body.certifications).toHaveLength(5)
    expect(body.certifications.map(({ id }) => id)).toEqual([
      'gcp-professional-cloud-developer',
      'gcp-professional-cloud-architect',
      'gcp-professional-cloud-database-engineer',
      'gcp-professional-data-engineer',
      'gcp-professional-cloud-devops-engineer',
    ])
    expect(body.certifications[0]?.sources).toHaveLength(3)
  })

  test('first selection generates a guide and subsequent fresh reads avoid AI', async () => {
    let aiCalls = 0
    const guideGenerator: GuideGenerator = async () => {
      aiCalls += 1
      return generatedGuide(draftFromGuide())
    }
    const app = createApp({ db, guideGenerator })

    const first = await app.request(`/api/v1/certifications/${certification.id}/guide`)
    const firstBody = await first.json() as { guide: {
      version: number
      domains: Array<{ weight: number }>
      studyPath: unknown[]
      sources: unknown[]
      researchSources: unknown[]
      freshness: { sourceCheckedAt: string | null }
    } }
    const second = await app.request(`/api/v1/certifications/${certification.id}/guide`)
    expect(first.status).toBe(200)
    expect(firstBody.guide.version).toBe(1)
    expect(firstBody.guide.domains).toHaveLength(4)
    expect(firstBody.guide.studyPath).toHaveLength(3)
    expect(firstBody.guide.sources).toHaveLength(3)
    expect(firstBody.guide.researchSources).toHaveLength(1)
    expect(firstBody.guide.domains[0]?.weight).toBe(17.5)
    expect(firstBody.guide.freshness.sourceCheckedAt).toBeTruthy()
    expect(second.status).toBe(200)
    expect(aiCalls).toBe(1)
  })

  test('monthly refresh calls AI and keeps the version when generated content is unchanged', async () => {
    let currentTime = new Date('2026-09-30T12:00:00.000Z')
    let aiCalls = 0
    const service = createCertificationGuideService(db, {
      now: () => new Date(currentTime),
      guideGenerator: async () => { aiCalls += 1; return generatedGuide(draftFromGuide()) },
    })

    const first = await service.getGuide(certification.id)
    currentTime = new Date(currentTime.getTime() + 30 * 24 * 60 * 60 * 1_000)
    const refreshed = await service.getGuide(certification.id)
    expect(aiCalls).toBe(2)
    expect(first.version).toBe(1)
    expect(refreshed.version).toBe(1)
    expect(refreshed.freshness.aiRefreshedAt).toBe(currentTime.toISOString())
  })

  test('changed generated guide publishes a new version atomically', async () => {
    let currentTime = new Date('2026-09-30T12:00:00.000Z')
    let contentSuffix = ''
    const service = createCertificationGuideService(db, {
      now: () => new Date(currentTime),
      guideGenerator: async () => generatedGuide(draftFromGuide(contentSuffix)),
    })

    const first = await service.getGuide(certification.id)
    currentTime = new Date(currentTime.getTime() + 30 * 24 * 60 * 60 * 1_000)
    contentSuffix = ' refreshed'
    const refreshed = await service.getGuide(certification.id)
    expect(first.version).toBe(1)
    expect(refreshed.version).toBe(2)
    expect(refreshed.domains[0]?.name.en).toContain('refreshed')
  })

  test('concurrent stale-guide requests share one refresh lease', async () => {
    let aiCalls = 0
    const service = createCertificationGuideService(db, {
      peerWaitMs: 500,
      peerPollMs: 5,
      guideGenerator: async () => {
        aiCalls += 1
        await new Promise((resolve) => setTimeout(resolve, 30))
        return generatedGuide(draftFromGuide())
      },
    })

    const results = await Promise.all([
      service.getGuide(certification.id),
      service.getGuide(certification.id),
    ])
    expect(results.map((result) => result.version)).toEqual([1, 1])
    expect(aiCalls).toBe(1)
  })

  test('AI failure leaves the last good guide intact and returns a recoverable error', async () => {
    let currentTime = new Date('2026-09-30T12:00:00.000Z')
    let fail = false
    const service = createCertificationGuideService(db, {
      now: () => new Date(currentTime),
      guideGenerator: async () => {
        if (fail) throw new Error('private provider details')
        return generatedGuide(draftFromGuide())
      },
    })

    const original = await service.getGuide(certification.id)
    currentTime = new Date(currentTime.getTime() + 30 * 24 * 60 * 60 * 1_000)
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
  })

  test('invalid AI output cannot replace a valid published guide', async () => {
    let currentTime = new Date('2026-09-30T12:00:00.000Z')
    let invalid = false
    const service = createCertificationGuideService(db, {
      now: () => new Date(currentTime),
      guideGenerator: async () => {
        const draft = draftFromGuide()
        if (!invalid) return generatedGuide(draft)
        return generatedGuide({
          ...draft,
          domains: draft.domains.map((domain, index) => index === 0 ? { ...domain, weight: domain.weight + 1 } : domain),
        })
      },
    })

    await service.getGuide(certification.id)
    currentTime = new Date(currentTime.getTime() + 30 * 24 * 60 * 60 * 1_000)
    invalid = true
    await expect(service.getGuide(certification.id)).rejects.toMatchObject({ code: 'GUIDE_AI_INVALID', status: 502 })
    const stored = await getCertificationGuide(db, certification.id)
    expect(stored?.version).toBe(1)
    expect(stored?.studyPath[0]?.url).toBe(certification.sources.find((source) => source.kind === 'learning-path')?.url)
  })

  test('guide refresh rejects missing and non-Google citations', async () => {
    const examGuide = certification.sources.find((source) => source.kind === 'exam-guide')!
    const service = createCertificationGuideService(db, {
      guideGenerator: async () => ({
        output: draftFromGuide(),
        researchSources: [
          { title: 'Untrusted source', url: 'https://example.com/guide' },
          { title: examGuide.title, url: examGuide.url },
        ],
      }),
    })

    await expect(service.getGuide(certification.id)).rejects.toMatchObject({ code: 'GUIDE_AI_INVALID', status: 502 })
    expect(await getCertificationGuide(db, certification.id)).toBeUndefined()
  })
})
