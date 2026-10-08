import { afterAll, beforeAll, beforeEach, expect, test } from 'bun:test'
import { eq } from 'drizzle-orm'
import type { CertificationGuideResponse } from '../src/api/certification-contracts'
import { certificationCatalog } from '../server/catalog/certifications'
import { syncCertificationCatalog } from '../server/catalog/repository'
import type { DatabaseHandle } from '../server/db/client'
import { simulationResults, simulationSessions } from '../server/db/schema'
import { createApp } from '../server/app'
import { createSimulationService } from '../server/use-cases/simulation-service'
import type { QuestionGenerator } from '../server/simulations/question-generator'
import { StoredSimulationStateSchema } from '../server/simulations/state'
import { createTestDatabase } from './test-database'

const certification = certificationCatalog[0]!
const guide: CertificationGuideResponse = {
  certification,
  version: 1,
  domains: [{
    id: 'development',
    sourceSectionNumber: 1,
    name: { en: 'Development', es: 'Desarrollo' },
    description: { en: 'Development work', es: 'Trabajo de desarrollo' },
    weight: 100,
    topics: [
      { id: 'weak-topic', name: { en: 'Weak topic', es: 'Tema débil' }, description: { en: 'Weak area', es: 'Área débil' } },
      { id: 'passed-topic', name: { en: 'Passed topic', es: 'Tema superado' }, description: { en: 'Passed area', es: 'Área superada' } },
    ],
  }],
  studyPath: [{
    id: 'step-1',
    title: { en: 'Read guide', es: 'Leer guía' },
    description: { en: 'Learn', es: 'Aprender' },
    domainIds: ['development'],
    url: certification.sources.find(({ kind }) => kind === 'learning-path')!.url,
  }],
  sources: certification.sources,
  researchSources: [],
  freshness: { aiRefreshedAt: '2026-10-01T00:00:00.000Z', sourceCheckedAt: null },
}

function makeFocusedQuestionGenerator(onInput?: (input: Parameters<QuestionGenerator>[0]) => void): QuestionGenerator {
  return async (input) => {
    onInput?.(input)
    const questions = Object.entries(input.requiredQuestionsByTopic ?? {}).flatMap(([topicId, count]) => {
      const domain = input.guide.domains.find(({ topics }) => topics.some((topic) => topic.id === topicId))!
      return Array.from({ length: count }, (_, index) => ({
        domainId: domain.id,
        topicId,
        focus: `Focus ${topicId} ${index + 1}`,
        service: 'Cloud Run',
        question: `Which decision addresses focused practice scenario ${topicId} ${index + 1}?`,
        answers: [`Correct ${index + 1}`, `Wrong A ${index + 1}`, `Wrong B ${index + 1}`, `Wrong C ${index + 1}`],
        correctAnswerIndex: 0,
        explanation: `This explains the correct answer for ${topicId} ${index + 1}.`,
      }))
    })
    return { language: input.language, questions }
  }
}

let testDatabase: Awaited<ReturnType<typeof createTestDatabase>>
let db: DatabaseHandle

beforeAll(async () => {
  testDatabase = await createTestDatabase()
  db = testDatabase.db
})

beforeEach(async () => testDatabase.reset())
afterAll(async () => testDatabase?.close())

async function makeContext(questionGenerator: QuestionGenerator = makeFocusedQuestionGenerator()) {
  await syncCertificationCatalog(db, certificationCatalog, new Date('2026-10-01T00:00:00.000Z'))
  const service = createSimulationService(db, { guideService: { getGuide: async () => guide }, questionGenerator })
  const app = createApp({
    db,
    userProvider: async (request) => ({ id: request.headers.get('x-test-user') ?? 'learner-1', permissions: [] }),
    simulationService: service,
  })
  await app.request('/api/v1/me')
  return { app, db }
}

async function saveResult(
  db: Awaited<ReturnType<typeof makeContext>>['db'],
  userId: string,
  id: string,
  topicBreakdown: Record<string, { correct: number; total: number }>,
  completedAt = new Date('2026-10-01T00:00:00.000Z'),
  certificationId = certification.id,
) {
  await db.insert(simulationResults).values({
    id,
    gatewayUserId: userId,
    certificationId,
    mode: 'real',
    guideVersion: 1,
    language: 'en',
    score: 60,
    totalQuestions: 20,
    correctAnswers: 12,
    correctAfterRetry: 0,
    answersRevealed: 0,
    incorrectAnswers: 8,
    domainBreakdown: { development: { correct: 12, total: 20 } },
    topicBreakdown,
    focusBreakdown: {},
    completedAt,
  })
}

test('weak topic preview is per user and distinguishes empty and fully passed history', async () => {
  const { app, db } = await makeContext()
  const path = `/api/v1/simulations/weak-topics?certificationId=${certification.id}`

  expect(await (await app.request(path)).json()).toMatchObject({ status: 'history_empty', topics: [] })
  const emptyStart = await app.request('/api/v1/simulations/weak-topics', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ certificationId: certification.id, mode: 'real', language: 'en' }),
  })
  expect(emptyStart.status).toBe(409)
  expect(await emptyStart.json()).toMatchObject({ error: { code: 'SIMULATION_HISTORY_EMPTY' } })
  await saveResult(db, 'learner-1', 'weak-result', {
    'weak-topic': { correct: 6, total: 10 },
    'passed-topic': { correct: 8, total: 10 },
  })
  await app.request('/api/v1/me', { headers: { 'x-test-user': 'learner-2' } })
  expect(await (await app.request(path)).json()).toMatchObject({
    status: 'ready', analyzedSessionCount: 1, thresholdPercent: 80,
    topics: [{ topicId: 'weak-topic', correct: 6, total: 10, incorrect: 4, accuracyPercent: 60 }],
  })
  expect(await (await app.request(path, { headers: { 'x-test-user': 'learner-2' } })).json()).toMatchObject({
    status: 'history_empty', analyzedSessionCount: 0, topics: [],
  })

  await saveResult(db, 'learner-1', 'passed-result', {
    'weak-topic': { correct: 10, total: 10 },
    'passed-topic': { correct: 10, total: 10 },
  })
  expect(await (await app.request(path)).json()).toMatchObject({ status: 'no_weak_topics', topics: [] })
  const masteredStart = await app.request('/api/v1/simulations/weak-topics', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ certificationId: certification.id, mode: 'real', language: 'en' }),
  })
  expect(masteredStart.status).toBe(409)
  expect(await masteredStart.json()).toMatchObject({ error: { code: 'NO_WEAK_TOPICS' } })
})

test('weak topic preview excludes results from another certification with matching topic IDs', async () => {
  const { app, db } = await makeContext()
  const otherCertification = certificationCatalog[1]!
  const path = `/api/v1/simulations/weak-topics?certificationId=${certification.id}`
  await saveResult(db, 'learner-1', 'cert-a-weak-result', {
    'weak-topic': { correct: 6, total: 10 },
  })
  await saveResult(db, 'learner-1', 'cert-b-passed-result', {
    'weak-topic': { correct: 10, total: 10 },
  }, new Date('2026-10-02T00:00:00.000Z'), otherCertification.id)

  expect(await (await app.request(path)).json()).toMatchObject({
    certificationId: certification.id,
    status: 'ready',
    analyzedSessionCount: 1,
    topics: [{ topicId: 'weak-topic', correct: 6, total: 10, accuracyPercent: 60 }],
  })
})

test('focused start sends only weak topics and exact topic quotas to the question generator', async () => {
  let observed: Parameters<QuestionGenerator>[0] | undefined
  const { app, db } = await makeContext(makeFocusedQuestionGenerator((input) => { observed = input }))
  await saveResult(db, 'learner-1', 'weak-result', {
    'weak-topic': { correct: 6, total: 10 },
    'passed-topic': { correct: 8, total: 10 },
  })

  const response = await app.request('/api/v1/simulations/weak-topics', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ certificationId: certification.id, mode: 'real', language: 'en' }),
  })
  expect(response.status).toBe(201)
  expect(observed?.guide.domains.flatMap(({ topics }) => topics.map(({ id }) => id))).toEqual(['weak-topic'])
  expect(observed?.requiredQuestionsByTopic).toEqual({ 'weak-topic': 20 })
  expect(observed?.requiredQuestionsByDomain).toEqual({ development: 20 })
  expect(observed?.topicScope).toBe('selected-only')
  const session = await response.json() as {
    sessionId: string
    currentQuestion: { id: string; topicId: string; answers: Array<{ id: string }> }
  }
  expect(session.currentQuestion.topicId).toBe('weak-topic')
  let question = session.currentQuestion
  let completed: Record<string, unknown> | undefined
  for (let index = 0; index < 20; index += 1) {
    const [row] = await db.select({ state: simulationSessions.state }).from(simulationSessions)
      .where(eq(simulationSessions.id, session.sessionId))
    const state = StoredSimulationStateSchema.parse(row?.state)
    if (state.status !== 'active') throw new Error('Expected an active simulation in test state.')
    const correctAnswerId = state.questions.find(({ id }) => id === question.id)?.correctAnswerId
    const correctOption = question.answers.find(({ id }) => id === correctAnswerId)
    if (!correctOption) throw new Error('Expected the correct option in test state.')
    const answer = await app.request(`/api/v1/simulations/${session.sessionId}/answers`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ questionId: question.id, answerId: correctOption.id }),
    })
    expect(answer.status).toBe(200)
    const body = await answer.json() as Record<string, unknown>
    if (index === 19) completed = body
    else question = (body.nextQuestion as typeof question)
  }
  expect(completed).toMatchObject({ status: 'completed', result: { totalQuestions: 20, correctAnswers: 20 } })
  const saved = (await db.select().from(simulationResults)).find(({ id }) => id === session.sessionId)
  expect(saved?.topicBreakdown).toEqual({ 'weak-topic': { correct: 20, total: 20 } })
})

test('focused start rejects generated questions from a passed topic', async () => {
  const invalidGenerator: QuestionGenerator = async ({ language }) => ({
    language,
    questions: Array.from({ length: 20 }, (_, index) => ({
      domainId: 'development',
      topicId: 'passed-topic',
      focus: `Focus ${index + 1}`,
      service: 'Cloud Run',
      question: `Which decision addresses out-of-scope scenario ${index + 1}?`,
      answers: [`Correct ${index + 1}`, `Wrong A ${index + 1}`, `Wrong B ${index + 1}`, `Wrong C ${index + 1}`],
      correctAnswerIndex: 0,
      explanation: `Explanation ${index + 1}.`,
    })),
  })
  const { app, db } = await makeContext(invalidGenerator)
  await saveResult(db, 'learner-1', 'weak-result', {
    'weak-topic': { correct: 6, total: 10 },
    'passed-topic': { correct: 8, total: 10 },
  })

  const response = await app.request('/api/v1/simulations/weak-topics', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ certificationId: certification.id, mode: 'real', language: 'en' }),
  })
  expect(response.status).toBe(503)
  expect(await response.json()).toMatchObject({ error: { code: 'QUESTION_SET_INVALID' } })
  expect(await db.select().from(simulationSessions)).toHaveLength(0)
})

test('weak topic analysis is limited to the ten most recent completed results', async () => {
  const { app, db } = await makeContext()
  for (let index = 0; index < 10; index += 1) {
    await saveResult(db, 'learner-1', `recent-${index}`, {
      'weak-topic': { correct: 8, total: 10 },
      'passed-topic': { correct: 10, total: 10 },
    }, new Date(`2026-09-${String(30 - index).padStart(2, '0')}T00:00:00.000Z`))
  }
  await saveResult(db, 'learner-1', 'old-bad-result', {
    'weak-topic': { correct: 0, total: 10 },
    'passed-topic': { correct: 0, total: 10 },
  }, new Date('2020-01-01T00:00:00.000Z'))

  const response = await app.request(`/api/v1/simulations/weak-topics?certificationId=${certification.id}`)
  expect(await response.json()).toMatchObject({ status: 'no_weak_topics', analyzedSessionCount: 10, topics: [] })
})

test('a successful weak-topic start replaces the pending session and failed eligibility preserves it', async () => {
  const { app, db } = await makeContext()
  await saveResult(db, 'learner-1', 'weak-result', {
    'weak-topic': { correct: 6, total: 10 },
    'passed-topic': { correct: 8, total: 10 },
  })
  const startWeakTopics = () => app.request('/api/v1/simulations/weak-topics', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ certificationId: certification.id, mode: 'practice', language: 'en' }),
  })

  const first = await startWeakTopics()
  expect(first.status).toBe(201)
  const firstSession = await first.json() as { sessionId: string }
  const second = await startWeakTopics()
  expect(second.status).toBe(201)
  const secondSession = await second.json() as { sessionId: string }
  expect(secondSession.sessionId).not.toBe(firstSession.sessionId)
  expect((await (await app.request('/api/v1/simulations/active')).json() as { sessionId: string }).sessionId).toBe(secondSession.sessionId)
  expect((await app.request(`/api/v1/simulations/${firstSession.sessionId}`)).status).toBe(404)

  await app.request('/api/v1/simulation-history', { method: 'DELETE' })
  const noLongerEligible = await startWeakTopics()
  expect(noLongerEligible.status).toBe(409)
  expect(await noLongerEligible.json()).toMatchObject({ error: { code: 'SIMULATION_HISTORY_EMPTY' } })
  expect((await (await app.request('/api/v1/simulations/active')).json() as { sessionId: string }).sessionId).toBe(secondSession.sessionId)
})
