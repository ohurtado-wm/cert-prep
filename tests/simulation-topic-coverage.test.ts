import { afterAll, beforeAll, beforeEach, expect, test } from 'bun:test'
import { eq } from 'drizzle-orm'
import type { CertificationGuideResponse, Locale } from '@cert-prep/contracts/certification-contracts'
import { certificationCatalog } from '../apps/api/src/catalog/certifications'
import { syncCertificationCatalog } from '../apps/api/src/catalog/repository'
import type { DatabaseHandle } from '../apps/api/src/db/client'
import { simulationResults, simulationSessions } from '../apps/api/src/db/schema'
import { createApp } from '../apps/api/src/app'
import type { QuestionGenerator, QuestionGeneratorInput } from '../apps/api/src/simulations/question-generator'
import { allocateQuestionsByTopic, allocateQuestionsByWeight, InvalidQuestionSetError, validateGeneratedQuestions } from '../apps/api/src/simulations/question-validation'
import { StoredSimulationStateSchema } from '../apps/api/src/simulations/state'
import { createSimulationService } from '../apps/api/src/use-cases/simulation-service'
import { createTestDatabase } from './test-database'

const certification = certificationCatalog[0]!
const sixTopics = Array.from({ length: 6 }, (_, index) => ({
  id: `topic-${index + 1}`,
  name: { en: `Topic ${index + 1}`, es: `Tema ${index + 1}` },
  description: { en: 'Description', es: 'Descripción' },
}))
const guide: CertificationGuideResponse = {
  certification,
  version: 1,
  domains: [{
    id: 'section-1',
    sourceSectionNumber: 1,
    name: { en: 'Design', es: 'Diseño' },
    description: { en: 'Design applications', es: 'Diseñar aplicaciones' },
    weight: 100,
    topics: sixTopics,
  }],
  studyPath: [{
    id: 'step-1',
    title: { en: 'Review the guide', es: 'Revisar la guía' },
    description: { en: 'Read the exam guide.', es: 'Leer la guía del examen.' },
    domainIds: ['section-1'],
    url: certification.sources.find(({ kind }) => kind === 'learning-path')!.url,
  }],
  sources: certification.sources,
  researchSources: [],
  freshness: { aiRefreshedAt: '2026-10-06T00:00:00.000Z', sourceCheckedAt: null },
}

function makeQuestionSet(input: QuestionGeneratorInput, run: number) {
  const questions = Object.entries(input.requiredQuestionsByTopic).flatMap(([topicId, count]) => {
    const domain = input.guide.domains.find(({ topics }) => topics.some((topic) => topic.id === topicId))!
    return Array.from({ length: count }, (_, index) => ({
      domainId: domain.id,
      topicId,
      focus: `Focus ${topicId} ${index + 1}`,
      service: 'Cloud Run',
      question: `Which decision addresses objective ${topicId} simulation ${run} question ${index + 1}?`,
      answers: [`Correct ${run}-${topicId}-${index + 1}`, `Wrong A ${index + 1}`, `Wrong B ${index + 1}`, `Wrong C ${index + 1}`],
      correctAnswerIndex: 0,
      explanation: `This explains the decision for ${topicId} question ${index + 1}.`,
    }))
  })
  return { language: input.language, questions }
}

let testDatabase: Awaited<ReturnType<typeof createTestDatabase>>
let db: DatabaseHandle

beforeAll(async () => {
  testDatabase = await createTestDatabase()
  db = testDatabase.db
})

beforeEach(async () => {
  await testDatabase.reset()
  await syncCertificationCatalog(db, certificationCatalog, new Date('2026-10-06T00:00:00.000Z'))
})

afterAll(async () => testDatabase?.close())

function makeApp(generator: QuestionGenerator) {
  const service = createSimulationService(db, { guideService: { getGuide: async () => guide }, questionGenerator: generator })
  return createApp({
    db,
    userProvider: async (request) => ({
      id: request.headers.get('x-test-user') ?? 'learner-1',
      email: 'learner@example.com',
      permissions: [],
    }),
    simulationService: service,
  })
}

async function registerUser(app: ReturnType<typeof makeApp>, userId: string) {
  const response = await app.request('/api/v1/me', { headers: { 'x-test-user': userId } })
  expect(response.status).toBe(200)
}

async function seedResult(input: {
  userId: string
  id: string
  certificationId: string
  guideVersion: number
  topicId: string
  completedAt: Date
}) {
  await db.insert(simulationResults).values({
    id: input.id,
    gatewayUserId: input.userId,
    certificationId: input.certificationId,
    mode: 'real',
    guideVersion: input.guideVersion,
    language: 'en',
    score: 0,
    totalQuestions: 20,
    correctAnswers: 0,
    correctAfterRetry: 0,
    answersRevealed: 0,
    incorrectAnswers: 20,
    domainBreakdown: {},
    topicBreakdown: { [input.topicId]: { correct: 0, total: 20 } },
    focusBreakdown: {},
    completedAt: input.completedAt,
  })
}

async function start(app: ReturnType<typeof makeApp>) {
  const response = await app.request('/api/v1/simulations', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ certificationId: certification.id, mode: 'real', language: 'en' }),
  })
  expect(response.status).toBe(201)
  return await response.json() as {
    sessionId: string
    currentQuestion: { id: string }
  }
}

async function complete(app: ReturnType<typeof makeApp>, sessionId: string) {
  for (let index = 0; index < 20; index += 1) {
    const [row] = await db.select({ state: simulationSessions.state }).from(simulationSessions)
      .where(eq(simulationSessions.id, sessionId))
    const state = StoredSimulationStateSchema.parse(row?.state)
    if (state.status !== 'active') throw new Error('Expected an active simulation in test state.')
    const question = state.questions[state.currentIndex]!
    const response = await app.request(`/api/v1/simulations/${sessionId}/answers`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ questionId: question.id, answerId: question.correctAnswerId }),
    })
    expect(response.status).toBe(200)
  }
}

function allocationInput() {
  const requiredQuestionsByDomain = allocateQuestionsByWeight(guide.domains)
  const requiredQuestionsByTopic = allocateQuestionsByTopic(guide.domains, requiredQuestionsByDomain)
  return { requiredQuestionsByDomain, requiredQuestionsByTopic }
}

test('rejects generated assignments that break exact per-topic quotas', () => {
  const { requiredQuestionsByDomain, requiredQuestionsByTopic } = allocationInput()
  const generated = makeQuestionSet({
    guide,
    language: 'en' as Locale,
    requiredQuestionsByDomain,
    requiredQuestionsByTopic,
    topicScope: 'all-guide-topics',
  }, 1)
  generated.questions[0]!.topicId = 'topic-6'

  expect(() => validateGeneratedQuestions({
    value: generated,
    guide,
    language: 'en',
    requiredQuestionsByDomain,
    requiredQuestionsByTopic,
    idFactory: (() => { let id = 0; return () => `question-${++id}` })(),
  })).toThrow(InvalidQuestionSetError)
})

test('validator requires one quota for every guide topic and rejects unknown topic quotas', () => {
  const { requiredQuestionsByDomain, requiredQuestionsByTopic } = allocationInput()
  const value = makeQuestionSet({
    guide,
    language: 'en',
    requiredQuestionsByDomain,
    requiredQuestionsByTopic,
    topicScope: 'all-guide-topics',
  }, 1)
  const validate = (topicQuotas: Record<string, number>) => validateGeneratedQuestions({
    value,
    guide,
    language: 'en',
    requiredQuestionsByDomain,
    requiredQuestionsByTopic: topicQuotas,
    idFactory: (() => { let id = 0; return () => `question-${++id}` })(),
  })

  const missingTopic = Object.fromEntries(Object.entries(requiredQuestionsByTopic).filter(([id]) => id !== 'topic-6'))
  expect(() => validate(missingTopic)).toThrow(InvalidQuestionSetError)
  expect(() => validate({ ...requiredQuestionsByTopic, 'unofficial-topic': 0 })).toThrow(InvalidQuestionSetError)
})

test('standard API start filters history and rotates quotas after a completed run', async () => {
  const generationInputs: QuestionGeneratorInput[] = []
  let run = 0
  const generator: QuestionGenerator = async (input) => {
    generationInputs.push({ ...input, requiredQuestionsByTopic: { ...input.requiredQuestionsByTopic } })
    run += 1
    return makeQuestionSet(input, run)
  }
  const app = makeApp(generator)
  await registerUser(app, 'learner-1')
  await registerUser(app, 'learner-2')

  await seedResult({
    userId: 'learner-1', id: 'older-compatible-result', certificationId: certification.id,
    guideVersion: 1, topicId: 'topic-3', completedAt: new Date('2026-10-06T00:00:00.000Z'),
  })
  await seedResult({
    userId: 'learner-1', id: 'recent-compatible-result-1', certificationId: certification.id,
    guideVersion: 1, topicId: 'topic-1', completedAt: new Date('2026-10-06T00:01:00.000Z'),
  })
  await seedResult({
    userId: 'learner-1', id: 'recent-compatible-result-2', certificationId: certification.id,
    guideVersion: 1, topicId: 'topic-2', completedAt: new Date('2026-10-06T00:02:00.000Z'),
  })
  await seedResult({
    userId: 'learner-1', id: 'wrong-guide-version', certificationId: certification.id,
    guideVersion: 2, topicId: 'topic-1', completedAt: new Date('2026-10-06T00:06:00.000Z'),
  })
  await seedResult({
    userId: 'learner-1', id: 'wrong-certification', certificationId: certificationCatalog[1]!.id,
    guideVersion: 1, topicId: 'topic-2', completedAt: new Date('2026-10-06T00:05:00.000Z'),
  })
  await seedResult({
    userId: 'learner-2', id: 'wrong-owner', certificationId: certification.id,
    guideVersion: 1, topicId: 'topic-3', completedAt: new Date('2026-10-06T00:04:00.000Z'),
  })

  const first = await start(app)
  expect(generationInputs[0]).toMatchObject({ topicScope: 'all-guide-topics' })
  expect(generationInputs[0]!.requiredQuestionsByTopic).toEqual({
    'topic-1': 3, 'topic-2': 3, 'topic-3': 4, 'topic-4': 4, 'topic-5': 3, 'topic-6': 3,
  })
  await complete(app, first.sessionId)

  const savedResult = (await db.select().from(simulationResults)).find(({ id }) => id === first.sessionId)
  expect(savedResult?.topicBreakdown).toEqual({
    'topic-1': { correct: 3, total: 3 },
    'topic-2': { correct: 3, total: 3 },
    'topic-3': { correct: 4, total: 4 },
    'topic-4': { correct: 4, total: 4 },
    'topic-5': { correct: 3, total: 3 },
    'topic-6': { correct: 3, total: 3 },
  })

  await start(app)
  expect(generationInputs[1]!.requiredQuestionsByTopic).toEqual({
    'topic-1': 4, 'topic-2': 3, 'topic-3': 3, 'topic-4': 3, 'topic-5': 4, 'topic-6': 3,
  })
  expect(generationInputs[1]!.requiredQuestionsByDomain).toEqual({ 'section-1': 20 })
})

test('replacing an incomplete simulation rotates from only the topics already shown', async () => {
  const generationInputs: QuestionGeneratorInput[] = []
  let run = 0
  const generator: QuestionGenerator = async (input) => {
    generationInputs.push({ ...input, requiredQuestionsByTopic: { ...input.requiredQuestionsByTopic } })
    run += 1
    return makeQuestionSet(input, run)
  }
  const app = makeApp(generator)
  await registerUser(app, 'learner-1')

  const first = await start(app)
  const [activeSession] = await db.select({ state: simulationSessions.state }).from(simulationSessions)
    .where(eq(simulationSessions.id, first.sessionId))
  const activeState = StoredSimulationStateSchema.parse(activeSession?.state)
  expect(activeState.status).toBe('active')
  if (activeState.status !== 'active') throw new Error('Expected an active simulation in test state.')
  expect(activeState.currentIndex).toBe(0)
  expect(activeState.questions[activeState.currentIndex]!.topicId).toBe('topic-1')

  await seedResult({
    userId: 'learner-1', id: 'older-completed-result', certificationId: certification.id,
    guideVersion: 1, topicId: 'topic-4', completedAt: new Date('2026-10-06T00:00:00.000Z'),
  })
  await seedResult({
    userId: 'learner-1', id: 'second-latest-completed-result', certificationId: certification.id,
    guideVersion: 1, topicId: 'topic-2', completedAt: new Date('2026-10-06T00:01:00.000Z'),
  })
  await seedResult({
    userId: 'learner-1', id: 'latest-completed-result', certificationId: certification.id,
    guideVersion: 1, topicId: 'topic-6', completedAt: new Date('2026-10-06T00:02:00.000Z'),
  })

  const second = await start(app)
  expect(generationInputs[1]!.requiredQuestionsByTopic).toEqual({
    'topic-1': 3, 'topic-2': 4, 'topic-3': 4, 'topic-4': 3, 'topic-5': 3, 'topic-6': 3,
  })

  const replacedSession = await app.request(`/api/v1/simulations/${first.sessionId}`)
  expect(replacedSession.status).toBe(404)
  const activeResponse = await app.request('/api/v1/simulations/active')
  expect(activeResponse.status).toBe(200)
  expect((await activeResponse.json() as { sessionId: string }).sessionId).toBe(second.sessionId)
})
