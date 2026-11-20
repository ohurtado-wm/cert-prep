import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'bun:test'
import { certificationCatalog } from '../apps/api/src/catalog/certifications'
import { syncCertificationCatalog } from '../apps/api/src/catalog/repository'
import { createApp } from '../apps/api/src/app'
import { simulationSessions } from '../apps/api/src/db/schema'
import { createSimulationService } from '../apps/api/src/use-cases/simulation-service'
import { bankFingerprint, guideFingerprint } from '../apps/api/src/simulations/advanced-bank/bank'
import { StoredSimulationStateSchema } from '../apps/api/src/simulations/state'
import { createTestDatabase } from './test-database'
import type { CertificationGuideResponse } from '@cert-prep/contracts/certification-contracts'

const cert = certificationCatalog.find((item) => item.id === 'gcp-professional-cloud-developer')!
const label = 'Building and testing applications'
const guide: CertificationGuideResponse = { certification: cert, version: 1, domains: [{ id: 'section-2', sourceSectionNumber: 2, name: { en: label, es: label }, description: { en: label, es: label }, weight: 100, topics: [{ id: 'topic-2-1', name: { en: 'Testing', es: 'Pruebas' }, description: { en: 'Test', es: 'Prueba' } }] }], studyPath: [], sources: cert.sources, researchSources: [], freshness: { aiRefreshedAt: '2026-01-01T00:00:00.000Z', sourceCheckedAt: null } }
const bank = Array.from({ length: 1020 }, (_, index) => ({ id: `bank-${index}`, domain: label, question: `Which option solves fictional scenario ${index}?`, answers: ['Correct answer', 'Wrong A', 'Wrong B', 'Wrong C'], correctAnswerIndex: 0 }))
const mapping = { reviewed: true, guideFingerprint: guideFingerprint(guide), bankFingerprint: bankFingerprint(bank), questions: Object.fromEntries(bank.map(({ id }) => [id, { domainId: 'section-2', topicId: 'topic-2-1' }])) }

describe('advanced simulations', () => {
  let database: Awaited<ReturnType<typeof createTestDatabase>>
  beforeAll(async () => { database = await createTestDatabase() })
  beforeEach(async () => { await database.reset(); await syncCertificationCatalog(database.db, certificationCatalog, new Date()) })
  afterAll(async () => database?.close())

  test('keeps answers private until completion and limits explanation access to the owner and selected questions', async () => {
    let aiQuestionCalls = 0
    let explanationCalls = 0
    const service = createSimulationService(database.db, {
      guideService: { getGuide: async () => guide },
      advancedBank: async () => ({ bank, mapping }),
      questionGenerator: async () => { aiQuestionCalls++; throw new Error('must not generate questions') },
      explanationGenerator: async () => { explanationCalls++; if (explanationCalls === 1) throw new Error('Unavailable'); return 'Fictional explanation.' },
    })
    const app = createApp({ db: database.db, userProvider: async (request) => ({ id: request.headers.get('x-test-user') ?? 'owner', permissions: [] }), simulationService: service })
    const start = await app.request('/api/v1/simulations', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ certificationId: cert.id, mode: 'real', language: 'es', questionSource: 'advanced' }) })
    expect(start.status).toBe(201)
    const session = await start.json() as { sessionId: string; language: string; questionSource: string; currentQuestion: { id: string } }
    expect(session.language).toBe('en')
    expect(session.questionSource).toBe('advanced')
    expect(JSON.stringify(session)).not.toContain('correctAnswerId')
    expect(JSON.stringify(session)).not.toContain('Fictional explanation')
    expect(aiQuestionCalls).toBe(0)

    let result: { printableQuestions: Array<{ id: string; answer: string; explanation?: string; review: { attempts: Array<{ answer: string; correct: boolean }> } }> } | undefined
    for (let index = 0; index < 20; index++) {
      const [row] = await database.db.select().from(simulationSessions)
      const state = StoredSimulationStateSchema.parse(row!.state)
      if (state.status !== 'active') throw new Error('Expected an active session')
      const question = state.questions[state.currentIndex]!
      const answerId = index % 2 === 0 ? question.correctAnswerId : question.answers.find((answer) => answer.id !== question.correctAnswerId)!.id
      const response = await app.request(`/api/v1/simulations/${session.sessionId}/answers`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ questionId: question.id, answerId }) })
      expect(response.status).toBe(200)
      const payload = await response.json() as { printableQuestions?: NonNullable<typeof result>['printableQuestions'] }
      if (index === 19) result = payload as typeof result
      else {
        expect(JSON.stringify(payload)).not.toContain('correctAnswerId')
        expect(payload.printableQuestions).toBeUndefined()
        expect(JSON.stringify(payload)).not.toContain('review')
      }
    }
    expect(result?.printableQuestions).toHaveLength(20)
    const id = result!.printableQuestions[0]!.id
    expect(result!.printableQuestions[0]!.answer).toBe('Correct answer')
    expect(result!.printableQuestions[0]!.review.attempts[0]).toMatchObject({ answer: 'Correct answer', correct: true })
    expect(result!.printableQuestions[1]!.review.attempts[0]!.correct).toBe(false)
    expect(result!.printableQuestions[0]!.explanation).toBeUndefined()
    const path = `/api/v1/simulations/${session.sessionId}/review/${id}/explanation`
    expect((await app.request(path, { method: 'POST', headers: { 'x-test-user': 'other' } })).status).toBe(404)
    expect((await app.request(`/api/v1/simulations/${session.sessionId}/review/not-selected/explanation`, { method: 'POST' })).status).toBe(404)
    const failed = await app.request(path, { method: 'POST' })
    expect(failed.status).toBe(503)
    expect(result!.printableQuestions[0]!.answer).toBe('Correct answer')
    const explained = await app.request(path, { method: 'POST' })
    expect(await explained.json()).toEqual({ explanation: 'Fictional explanation.' })
    expect(explanationCalls).toBe(2)
    const history = await app.request(`/api/v1/simulation-history?certificationId=${cert.id}`)
    expect(await history.json()).toMatchObject({ sessions: [{ questionSource: 'advanced', language: 'en' }] })
    const [finished] = await database.db.select().from(simulationSessions)
    expect(finished?.state).toMatchObject({ status: 'completed', questions: [] })
    expect(JSON.stringify(finished?.state)).not.toContain('Correct answer')
    expect((await app.request(`/api/v1/simulations/${session.sessionId}/review`, { method: 'DELETE' })).status).toBe(204)
    expect((await app.request(path, { method: 'POST' })).status).toBe(404)
  })

  test('rejects advanced practice in guided mode or for another certification', async () => {
    const service = createSimulationService(database.db, { guideService: { getGuide: async () => guide } })
    await expect(service.start('owner', { certificationId: cert.id, mode: 'practice', language: 'en', questionSource: 'advanced' })).rejects.toMatchObject({ code: 'ADVANCED_MODE_INVALID' })
    await expect(service.start('owner', { certificationId: 'other', mode: 'real', language: 'en', questionSource: 'advanced' })).rejects.toMatchObject({ code: 'ADVANCED_MODE_INVALID' })
  })

  test('supports an equivalent renewed guide and reuses its validated topic mapping', async () => {
    let checks = 0
    const renewed = { ...guide, domains: guide.domains.map((domain) => ({ ...domain, description: { ...domain.description, en: 'Reworded description' }, topics: domain.topics.map((topic) => ({ ...topic, id: 'topic-renewed' })) })) }
    const service = createSimulationService(database.db, {
      guideService: { getGuide: async () => renewed },
      advancedBank: async () => ({ bank, mapping: { ...mapping, referenceDomains: guide.domains } }),
      guideCompatibilityChecker: async (reference, current) => {
        checks++
        expect(JSON.stringify({ reference, current })).not.toContain('fictional scenario')
        return { domains: [{ id: 'section-2', compatible: true }], topics: [{ sourceTopicId: 'topic-2-1', targetTopicId: 'topic-renewed' }] }
      },
    })
    const request = { certificationId: cert.id, mode: 'real' as const, language: 'en' as const, questionSource: 'advanced' as const }
    const app = createApp({ db: database.db, userProvider: async () => ({ id: 'owner', permissions: [] }), simulationService: service })
    const start = async () => {
      const response = await app.request('/api/v1/simulations', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(request) })
      expect(response.status).toBe(201)
      return await response.json() as { currentQuestion: { topicId: string } }
    }
    const first = await start()
    const second = await start()
    expect(first.currentQuestion?.topicId).toBe('topic-renewed')
    expect(second.currentQuestion?.topicId).toBe('topic-renewed')
    expect(checks).toBe(1)
  })

  test('an incompatible renewed guide preserves the pending session', async () => {
    const renewed = { ...guide, domains: guide.domains.map((domain) => ({ ...domain, description: { ...domain.description, en: 'Changed scope' } })) }
    const service = createSimulationService(database.db, {
      guideService: { getGuide: async () => renewed },
      advancedBank: async () => ({ bank, mapping: { ...mapping, referenceDomains: guide.domains } }),
      guideCompatibilityChecker: async () => ({ domains: [{ id: 'section-2', compatible: false }], topics: [{ sourceTopicId: 'topic-2-1', targetTopicId: null }] }),
      questionGenerator: async () => ({ language: 'en', questions: Array.from({ length: 20 }, (_, index) => ({ domainId: 'section-2', topicId: 'topic-2-1', focus: 'Testing', service: 'Fictional service', question: `Which decision solves fictional scenario ${index}?`, answers: ['Correct', 'Wrong A', 'Wrong B', 'Wrong C'], correctAnswerIndex: 0, explanation: 'Fictional explanation.' })) }),
    })
    const app = createApp({ db: database.db, userProvider: async () => ({ id: 'owner', permissions: [] }), simulationService: service })
    const start = (questionSource: 'ai' | 'advanced') => app.request('/api/v1/simulations', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ certificationId: cert.id, mode: 'real', language: 'en', questionSource }) })
    const existing = await (await start('ai')).json() as { sessionId: string }
    const rejected = await start('advanced')
    expect(rejected.status).toBe(503)
    expect(await rejected.json()).toMatchObject({ error: { code: 'ADVANCED_BANK_UNAVAILABLE' } })
    expect(await (await app.request('/api/v1/simulations/active')).json()).toMatchObject({ sessionId: existing.sessionId })
  })

  test('an unreviewed mapping cannot replace a saved simulation', async () => {
    const service = createSimulationService(database.db, {
      guideService: { getGuide: async () => guide },
      advancedBank: async () => ({ bank, mapping: { ...mapping, reviewed: false } }),
      questionGenerator: async () => ({ language: 'en', questions: Array.from({ length: 20 }, (_, index) => ({ domainId: 'section-2', topicId: 'topic-2-1', focus: 'Testing', service: 'Fictional service', question: `Which decision solves fictional scenario ${index}?`, answers: ['Correct', 'Wrong A', 'Wrong B', 'Wrong C'], correctAnswerIndex: 0, explanation: 'Fictional explanation.' })) }),
    })
    const app = createApp({ db: database.db, userProvider: async () => ({ id: 'owner', permissions: [] }), simulationService: service })
    const request = (questionSource: 'ai' | 'advanced') => app.request('/api/v1/simulations', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ certificationId: cert.id, mode: 'real', language: 'en', questionSource }) })
    const original = await request('ai')
    expect(original.status).toBe(201)
    const previous = await original.json() as { sessionId: string }
    const rejected = await request('advanced')
    expect(rejected.status).toBe(503)
    expect(await rejected.json()).toMatchObject({ error: { code: 'ADVANCED_BANK_UNAVAILABLE' } })
    const active = await app.request('/api/v1/simulations/active')
    expect(await active.json()).toMatchObject({ sessionId: previous.sessionId })
  })
})
