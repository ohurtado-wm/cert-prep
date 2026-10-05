import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'bun:test'
import type { CertificationGuideResponse } from '../src/api/certification-contracts'
import { certificationCatalog } from '../server/catalog/certifications'
import { syncCertificationCatalog } from '../server/catalog/repository'
import type { DatabaseHandle } from '../server/db/client'
import { simulationResults, studyPlans, users } from '../server/db/schema'
import { createApp } from '../server/app'
import { createStudyPlanService } from '../server/use-cases/study-plan-service'
import type { StudyPlanPromptInput, StudyPlanGenerator } from '../server/study-plans/plan-generator'
import { aggregateStudyResults } from '../server/study-plans/analytics'
import { createTestDatabase } from './test-database'

const certification = certificationCatalog[0]!
const now = new Date('2026-10-01T12:00:00.000Z')
const guide: CertificationGuideResponse = {
  certification,
  version: 1,
  domains: [60, 40].map((weight, index) => ({
    id: 'section-' + (index + 1),
    sourceSectionNumber: index + 1,
    name: { en: 'Domain ' + (index + 1), es: 'Dominio ' + (index + 1) },
    description: { en: 'Description', es: 'Descripción' },
    weight,
    topics: [{
      id: 'topic-' + (index + 1),
      name: { en: 'Topic ' + (index + 1), es: 'Tema ' + (index + 1) },
      description: { en: 'Description', es: 'Descripción' },
    }],
  })),
  studyPath: [{
    id: 'step-1',
    title: { en: 'Google Cloud learning path', es: 'Ruta de aprendizaje de Google Cloud' },
    description: { en: 'Official learning resource', es: 'Recurso oficial de aprendizaje' },
    domainIds: ['section-1', 'section-2'],
    url: certification.sources.find(({ kind }) => kind === 'learning-path')!.url,
  }],
  sources: certification.sources,
  researchSources: [],
  freshness: { aiRefreshedAt: now.toISOString(), sourceCheckedAt: null },
}

function resultBreakdowns(
  first: { correct: number; total: number },
  second: { correct: number; total: number },
  focus = { correct: 0, total: 1 },
) {
  return {
    domainBreakdown: { 'section-1': first, 'section-2': second },
    topicBreakdown: { 'topic-1': first, 'topic-2': second },
    focusBreakdown: { 'Cloud Run IAM permissions': focus },
  }
}

function planGenerator(onInput?: (input: StudyPlanPromptInput) => void): StudyPlanGenerator {
  return async (input) => {
    onInput?.(input)
    return {
      output: {
        language: input.language,
        summary: input.language === 'es' ? 'Repasa las áreas prioritarias.' : 'Review the highest-priority areas.',
        recommendations: input.targets.map((target) => ({
          targetId: target.id,
          title: input.language === 'es' ? 'Repasa ' + target.label : 'Review ' + target.label,
          rationale: input.language === 'es' ? 'Refuerza este tema.' : 'Strengthen this topic.',
          actions: [input.language === 'es' ? 'Completa el módulo oficial.' : 'Complete the official module.'],
          resourceStepId: 'step-1',
        })),
      },
      usage: { inputTokens: 80, outputTokens: 40, totalTokens: 120 },
    }
  }
}

describe('study plans', () => {
  let testDatabase: Awaited<ReturnType<typeof createTestDatabase>>
  let db: DatabaseHandle

  beforeAll(async () => {
    testDatabase = await createTestDatabase()
    db = testDatabase.db
  })

  beforeEach(async () => {
    await testDatabase.reset()
    await syncCertificationCatalog(db, certificationCatalog, now)
    await db.insert(users).values({
      gatewayUserId: 'learner-1',
      createdAt: now,
      updatedAt: now,
    })
  })

  afterAll(async () => testDatabase?.close())

  function appWith(generator: StudyPlanGenerator = planGenerator()) {
    let nextPlanId = 0
    const service = createStudyPlanService(db, {
      guideService: { getGuide: async () => guide },
      planGenerator: generator,
      now: () => now,
      idFactory: () => 'saved-plan-' + (++nextPlanId),
    })
    return createApp({
      db,
      userProvider: async (request) => ({
        id: request.headers.get('x-test-user') ?? 'learner-1',
        email: 'private@example.com',
        avatar: 'https://private.example/avatar',
        permissions: [],
      }),
      studyPlanService: service,
    })
  }

  async function seedResult(
    id: string,
    completedAt: Date,
    first = { correct: 2, total: 4 },
    second = { correct: 0, total: 2 },
    focus = { correct: 0, total: 1 },
  ) {
    await db.insert(simulationResults).values({
      id,
      gatewayUserId: 'learner-1',
      certificationId: certification.id,
      mode: 'real',
      guideVersion: 1,
      language: 'en',
      score: 25,
      totalQuestions: 6,
      correctAnswers: 2,
      correctAfterRetry: 0,
      answersRevealed: 0,
      incorrectAnswers: 4,
      ...resultBreakdowns(first, second, focus),
      completedAt,
    })
  }

  test('aggregates topic priorities deterministically from fixed history', () => {
    const stats = aggregateStudyResults([
      resultBreakdowns({ correct: 2, total: 4 }, { correct: 0, total: 2 }),
      resultBreakdowns({ correct: 3, total: 6 }, { correct: 1, total: 2 }, { correct: 1, total: 2 }),
    ], guide, 'es')

    expect(stats.sessionCount).toBe(2)
    expect(stats.targets.map(({ id, priority, correct, total, accuracy }) => ({ id, priority, correct, total, accuracy }))).toEqual([
      { id: 'topic-2', priority: 1, correct: 1, total: 4, accuracy: 25 },
      { id: 'topic-1', priority: 2, correct: 5, total: 10, accuracy: 50 },
    ])
    expect(stats.domains.map(({ id, correct, total }) => ({ id, correct, total }))).toEqual([
      { id: 'section-1', correct: 5, total: 10 },
      { id: 'section-2', correct: 1, total: 4 },
    ])
    expect(stats.failedFocuses).toEqual([{
      label: 'Cloud Run IAM permissions',
      correct: 1,
      total: 3,
      incorrect: 2,
      accuracy: 33,
    }])
  })

  test('uses only the latest ten owner results, stores a localized plan, and isolates reads', async () => {
    for (let index = 0; index < 11; index += 1) {
      await seedResult('result-' + index, new Date(now.getTime() - index * 1_000), index === 10
        ? { correct: 4, total: 4 }
        : { correct: 2, total: 4 }, index === 10 ? { correct: 2, total: 2 } : { correct: 0, total: 2 })
    }

    let received: StudyPlanPromptInput | undefined
    const app = appWith(planGenerator((input) => { received = input }))
    const response = await app.request('/api/v1/study-plans', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ certificationId: certification.id, language: 'es' }),
    })

    expect(response.status).toBe(201)
    const plan = await response.json() as {
      id: string
      basedOnSessions: number
      language: string
      recommendations: Array<{ targetId: string; priority: number; evidence: { correct: number; total: number }; resource: { url: string } }>
      aiUsage: { totalTokens: number }
    }
    expect(plan).toMatchObject({
      id: 'saved-plan-1',
      basedOnSessions: 10,
      language: 'es',
      recommendations: [
        { targetId: 'topic-2', priority: 1, evidence: { correct: 0, total: 20 } },
        { targetId: 'topic-1', priority: 2, evidence: { correct: 20, total: 40 } },
      ],
      aiUsage: { totalTokens: 120 },
    })
    expect(plan.recommendations[0]!.resource.url).toBe(guide.studyPath[0]!.url)
    expect(received?.sessionCount).toBe(10)
    expect(received?.failedFocuses[0]?.label).toBe('Cloud Run IAM permissions')
    const serializedPromptInput = JSON.stringify(received)
    expect(serializedPromptInput).not.toContain('private@example.com')
    expect(serializedPromptInput).not.toContain('private.example/avatar')
    expect(serializedPromptInput).not.toContain('learner-1')
    expect(serializedPromptInput).not.toContain('result-')
    expect(serializedPromptInput).not.toContain('question')
    expect(await db.select().from(studyPlans)).toHaveLength(1)

    const ownPlan = await app.request('/api/v1/study-plans/latest?certificationId=' + certification.id)
    expect(ownPlan.status).toBe(200)
    expect((await ownPlan.json() as { plan: { id: string } }).plan.id).toBe('saved-plan-1')
    const otherUserPlan = await app.request('/api/v1/study-plans/latest?certificationId=' + certification.id, {
      headers: { 'x-test-user': 'learner-2' },
    })
    expect(await otherUserPlan.json()).toEqual({ plan: null })
  })

  test('generates plans in the selected language and saves each regeneration', async () => {
    await seedResult('localized-result', now)
    const app = appWith()
    for (const language of ['en', 'es'] as const) {
      const response = await app.request('/api/v1/study-plans', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ certificationId: certification.id, language }),
      })
    expect(response.status).toBe(201)
      const plan = await response.json() as { language: string; recommendations: Array<{ resource: { title: string } }> }
      expect(plan.language).toBe(language)
      expect(plan.recommendations[0]?.resource.title).toBe(language === 'es' ? 'Ruta de aprendizaje de Google Cloud' : 'Google Cloud learning path')
    }
    expect(await db.select().from(studyPlans)).toHaveLength(2)
  })

  test('returns clear states for missing history and no failed areas without calling the generator', async () => {
    let calls = 0
    const app = appWith(async (input) => {
      calls += 1
      return await planGenerator()(input)
    })
    const empty = await app.request('/api/v1/study-plans', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-test-user': 'learner-2' },
      body: JSON.stringify({ certificationId: certification.id, language: 'en' }),
    })
    expect(empty.status).toBe(409)
    expect(await empty.json()).toMatchObject({ error: { code: 'STUDY_PLAN_HISTORY_EMPTY' } })

    await seedResult('all-correct', now, { correct: 4, total: 4 }, { correct: 2, total: 2 }, { correct: 1, total: 1 })
    const complete = await app.request('/api/v1/study-plans', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ certificationId: certification.id, language: 'en' }),
    })
    expect(complete.status).toBe(409)
    expect(await complete.json()).toMatchObject({ error: { code: 'STUDY_PLAN_NO_REVIEW_AREAS' } })
    expect(calls).toBe(0)
  })

  test('rejects model-generated performance numbers rather than presenting them as evidence', async () => {
    await seedResult('numbered-result', now)
    const app = appWith(async (input) => ({
      language: input.language,
      summary: 'You missed 3 questions in these areas.',
      recommendations: input.targets.map((target) => ({
        targetId: target.id,
        title: 'Review this topic',
        rationale: 'Strengthen this topic.',
        actions: ['Complete the official module.'],
        resourceStepId: 'step-1',
      })),
    }))
    const response = await app.request('/api/v1/study-plans', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ certificationId: certification.id, language: 'en' }),
    })
    expect(response.status).toBe(503)
    expect(await response.json()).toMatchObject({ error: { code: 'STUDY_PLAN_INVALID_OUTPUT' } })
    const passClaimApp = appWith(async (input) => ({
      language: input.language,
      summary: 'Review this topic.',
      recommendations: input.targets.map((target) => ({
        targetId: target.id,
        title: 'You passed this domain.',
        rationale: 'Strengthen this topic.',
        actions: ['Complete the official module.'],
        resourceStepId: 'step-1',
      })),
    }))
    const passClaim = await passClaimApp.request('/api/v1/study-plans', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ certificationId: certification.id, language: 'en' }),
    })
    expect(passClaim.status).toBe(503)
    expect(await passClaim.json()).toMatchObject({ error: { code: 'STUDY_PLAN_INVALID_OUTPUT' } })
    expect(await db.select().from(studyPlans)).toHaveLength(0)
  })

  test('rejects model output that invents an official resource and does not persist it', async () => {
    await seedResult('one-result', now)
    const app = appWith(async (input) => ({
      language: input.language,
      summary: 'A recommendation.',
      recommendations: input.targets.map((target) => ({
        targetId: target.id,
        title: 'Review',
        rationale: 'Practice this.',
        actions: ['Read the documentation.'],
        resourceStepId: 'invented-step',
      })),
    }))
    const response = await app.request('/api/v1/study-plans', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ certificationId: certification.id, language: 'en' }),
    })
    expect(response.status).toBe(503)
    expect(await response.json()).toMatchObject({ error: { code: 'STUDY_PLAN_INVALID_OUTPUT' } })
    expect(await db.select().from(studyPlans)).toHaveLength(0)
  })
})
