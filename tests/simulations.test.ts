import { beforeEach, describe, expect, test } from 'bun:test'
import { eq } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import type { CertificationGuideResponse, Locale } from '../src/api/certification-contracts'
import type { SimulationSnapshot } from '../src/api/simulation-contracts'
import { certificationCatalog } from '../server/catalog/certifications'
import { syncCertificationCatalog } from '../server/catalog/repository'
import { createDatabase } from '../server/db/client'
import { simulationSessions } from '../server/db/schema'
import { createSimulationService } from '../server/use-cases/simulation-service'
import { createApp } from '../server/app'
import type { QuestionGenerator } from '../server/simulations/question-generator'
import { StoredSimulationStateSchema } from '../server/simulations/state'

const certification = certificationCatalog[0]!
const learningPathUrl = certification.sources.find(({ kind }) => kind === 'learning-path')!.url

const guide: CertificationGuideResponse = {
  certification,
  version: 1,
  domains: [33, 26, 19, 22].map((weight, index) => ({
    id: `section-${index + 1}`,
    sourceSectionNumber: index + 1,
    name: { en: `Domain ${index + 1}`, es: `Dominio ${index + 1}` },
    description: { en: `Domain ${index + 1} description`, es: `Descripción del dominio ${index + 1}` },
    weight,
    topics: [{
      id: `topic-${index + 1}-1-1`,
      name: { en: `Topic ${index + 1}`, es: `Tema ${index + 1}` },
      description: { en: 'Topic description', es: 'Descripción del tema' },
    }],
  })),
  studyPath: [{
    id: 'step-1',
    title: { en: 'Review the guide', es: 'Revisa la guía' },
    description: { en: 'Read the official guide.', es: 'Lee la guía oficial.' },
    domainIds: ['section-1'],
    url: learningPathUrl,
  }],
  sources: certification.sources,
  freshness: { aiRefreshedAt: '2026-09-30T12:00:00.000Z' },
}

function generatedSet(language: Locale = 'en') {
  const domainOrder = [1, 2, 3, 4]
  const counts = [7, 5, 4, 4]
  const questions = domainOrder.flatMap((domain, domainIndex) => Array.from({ length: counts[domainIndex]! }, (_, index) => ({
    domainId: `section-${domain}`,
    topicId: `topic-${domain}-1-1`,
    focus: language === 'es' ? `Enfoque ${domain}-${index + 1}` : `Focus ${domain}-${index + 1}`,
    service: ['Cloud Run', 'IAM', 'Cloud Build', 'Pub/Sub'][domainIndex]!,
    question: language === 'es'
      ? `¿Qué decisión ayuda a resolver el escenario práctico ${domain}-${index + 1}?`
      : `Which decision helps solve practical scenario ${domain}-${index + 1}?`,
    answers: language === 'es'
      ? [`Opción correcta ${domain}-${index + 1}`, 'Alternativa incorrecta A', 'Alternativa incorrecta B', 'Alternativa incorrecta C']
      : [`Correct option ${domain}-${index + 1}`, 'Incorrect alternative A', 'Incorrect alternative B', 'Incorrect alternative C'],
    correctAnswerIndex: 0,
    explanation: language === 'es' ? 'Explicación confidencial de la respuesta.' : 'Private answer explanation.',
  })))
  return { language, questions }
}

describe('simulation sessions', () => {
  let client: ReturnType<typeof createDatabase>['client']
  let db: ReturnType<typeof createDatabase>['db']

  beforeEach(async () => {
    const database = createDatabase(':memory:')
    client = database.client
    db = database.db
    migrate(db, { migrationsFolder: './drizzle' })
    await syncCertificationCatalog(db, certificationCatalog, new Date('2026-09-30T12:00:00.000Z'))
  })

  function makeApp(
    generator: QuestionGenerator = async ({ language }) => generatedSet(language),
    now?: () => Date,
  ) {
    const service = createSimulationService(db, {
      guideService: { getGuide: async () => guide },
      questionGenerator: generator,
      ...(now ? { now } : {}),
    })
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

  async function start(app: ReturnType<typeof makeApp>, mode: 'practice' | 'real' = 'real', language: Locale = 'en') {
    const response = await app.request('/api/v1/simulations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ certificationId: certification.id, mode, language }),
    })
    expect(response.status).toBe(201)
    return await response.json() as {
      sessionId: string
      currentIndex: number
      currentQuestion: { id: string; answers: Array<{ id: string }> }
    }
  }

  async function answerChoice(
    sessionId: string,
    question: { id: string; answers: Array<{ id: string }> },
    correct = true,
  ) {
    const [row] = await db.select({ state: simulationSessions.state }).from(simulationSessions)
      .where(eq(simulationSessions.id, sessionId))
    const state = StoredSimulationStateSchema.parse(row?.state)
    if (state.status !== 'active') throw new Error('Expected an active simulation in test state.')
    const storedQuestion = state.questions.find(({ id }) => id === question.id)
    if (!storedQuestion) throw new Error('Expected the question in stored test state.')
    const answer = question.answers.find(({ id }) => correct
      ? id === storedQuestion.correctAnswerId
      : id !== storedQuestion.correctAnswerId)
    if (!answer) throw new Error('Expected a matching answer option in test state.')
    return answer.id
  }

  test('correct answer positions are evenly balanced across each generated set', async () => {
    const app = makeApp()
    const session = await start(app)
    const [row] = await db.select({ state: simulationSessions.state }).from(simulationSessions)
      .where(eq(simulationSessions.id, session.sessionId))
    const state = StoredSimulationStateSchema.parse(row?.state)
    if (state.status !== 'active') throw new Error('Expected an active simulation in test state.')
    const positionCounts = [0, 0, 0, 0]
    for (const question of state.questions) {
      const correctPosition = question.answers.findIndex(({ id }) => id === question.correctAnswerId)
      positionCounts[correctPosition] = positionCounts[correctPosition]! + 1
      expect(question.answers[correctPosition]!.text).toStartWith('Correct option ')
    }
    expect(positionCounts).toEqual([5, 5, 5, 5])
    client.close()
  })

  test('real sessions keep answers and explanations server-side until completion', async () => {
    const app = makeApp()
    const session = await start(app)
    expect(JSON.stringify(session)).not.toMatch(/correctAnswerId|correctAnswerIndex|explanation|sourceUrl/)

    const answerResponse = await app.request(`/api/v1/simulations/${session.sessionId}/answers`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ questionId: session.currentQuestion.id, answerId: session.currentQuestion.answers[1]!.id }),
    })
    expect(answerResponse.status).toBe(200)
    const answer = await answerResponse.json() as Record<string, unknown>
    expect(answer).toHaveProperty('status', 'advanced')
    expect(JSON.stringify(answer)).not.toMatch(/correctAnswerId|correctAnswerIndex|explanation|sourceUrl|first_try|incorrect/)

    const repeatedAnswer = await app.request(`/api/v1/simulations/${session.sessionId}/answers`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ questionId: session.currentQuestion.id, answerId: session.currentQuestion.answers[1]!.id }),
    })
    expect(repeatedAnswer.status).toBe(409)

    const reveal = await app.request(`/api/v1/simulations/${session.sessionId}/reveal`, { method: 'POST' })
    expect(reveal.status).toBe(409)

    const foreign = await app.request(`/api/v1/simulations/${session.sessionId}`, {
      headers: { 'x-test-user': 'learner-2' },
    })
    expect(foreign.status).toBe(404)
    for (const path of ['answers', 'reveal', 'next']) {
      const mutation = await app.request(`/api/v1/simulations/${session.sessionId}/${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-test-user': 'learner-2' },
        body: JSON.stringify({ questionId: session.currentQuestion.id, answerId: session.currentQuestion.answers[0]!.id }),
      })
      expect(mutation.status).toBe(404)
    }

    const [stored] = await db.select().from(simulationSessions)
    expect(JSON.stringify(stored?.state)).toMatch(/correctAnswerId/)
    client.close()
  })

  test('real mode accepts each answer once, advances automatically, and purges keys at completion', async () => {
    const app = makeApp()
    const session = await start(app)
    let question = session.currentQuestion
    let result: Record<string, unknown> | null = null

    for (let index = 0; index < 20; index += 1) {
      const response = await app.request(`/api/v1/simulations/${session.sessionId}/answers`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ questionId: question.id, answerId: await answerChoice(session.sessionId, question, index % 2 === 0) }),
      })
      expect(response.status).toBe(200)
      const body = await response.json() as Record<string, unknown>
      if (index === 19) result = body
      else {
        expect(body).not.toHaveProperty('printableQuestions')
        question = body.nextQuestion as typeof question
      }
    }

    expect(result).toMatchObject({ mode: 'real', status: 'completed', result: { totalQuestions: 20, correctAnswers: 10, score: 50 } })
    const printableQuestions = result!.printableQuestions as Array<{ question: string; answer: string }>
    expect(printableQuestions).toHaveLength(20)
    expect(printableQuestions[0]).toEqual({
      question: 'Which decision helps solve practical scenario 1-1?',
      answer: 'Correct option 1-1',
    })
    expect(JSON.stringify(printableQuestions)).not.toMatch(/Incorrect alternative|explanation/)
    const [stored] = await db.select().from(simulationSessions)
    expect(stored?.state).toMatchObject({ status: 'completed', questions: [] })
    expect(JSON.stringify(stored?.state)).not.toMatch(/correctAnswerId|explanation|sourceUrl/)
    const completed = await app.request(`/api/v1/simulations/${session.sessionId}`)
    expect(completed.status).toBe(200)
    const completedSnapshot = await completed.json() as Record<string, unknown>
    expect(completedSnapshot).not.toHaveProperty('printableQuestions')
    expect(JSON.stringify(completedSnapshot)).not.toMatch(/correctAnswerId|explanation|sourceUrl/)
    client.close()
  })

  test('practice mode supports retries, feedback, reveal, and continue', async () => {
    const app = makeApp()
    const session = await start(app, 'practice', 'es')
    expect((await app.request(`/api/v1/simulations/${session.sessionId}`)).status).toBe(200)

    const postAnswer = (questionId: string, answerId: string) => app.request(`/api/v1/simulations/${session.sessionId}/answers`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ questionId, answerId }),
    })
    const wrong = await postAnswer(session.currentQuestion.id, await answerChoice(session.sessionId, session.currentQuestion, false))
    expect(await wrong.json()).toMatchObject({ mode: 'practice', status: 'incorrect', canRetry: true, canReveal: true, canContinue: false })
    const correct = await postAnswer(session.currentQuestion.id, await answerChoice(session.sessionId, session.currentQuestion))
    expect(await correct.json()).toMatchObject({ mode: 'practice', status: 'correct', attempts: 2, canContinue: true, explanation: 'Explicación confidencial de la respuesta.' })

    const nextResponse = await app.request(`/api/v1/simulations/${session.sessionId}/next`, { method: 'POST' })
    expect(nextResponse.status).toBe(200)
    const nextQuestion = (await nextResponse.json() as { currentQuestion: { id: string; answers: Array<{ id: string }> } }).currentQuestion
    const reveal = await app.request(`/api/v1/simulations/${session.sessionId}/reveal`, { method: 'POST' })
    expect(await reveal.json()).toMatchObject({
      mode: 'practice',
      status: 'revealed',
      correctAnswerId: await answerChoice(session.sessionId, nextQuestion),
      canContinue: true,
    })
    const afterReveal = await app.request(`/api/v1/simulations/${session.sessionId}/next`, { method: 'POST' })
    expect(afterReveal.status).toBe(200)
    let current = await afterReveal.json() as SimulationSnapshot
    for (let index = 2; index < 20; index += 1) {
      const question = current.currentQuestion!
      expect((await postAnswer(question.id, await answerChoice(session.sessionId, question))).status).toBe(200)
      const next = await app.request(`/api/v1/simulations/${session.sessionId}/next`, { method: 'POST' })
      expect(next.status).toBe(200)
      current = await next.json() as SimulationSnapshot
    }
    expect(current.status).toBe('completed')
    expect(current.printableQuestions).toHaveLength(20)
    expect(current.printableQuestions?.[0]).toEqual({
      question: '¿Qué decisión ayuda a resolver el escenario práctico 1-1?',
      answer: 'Opción correcta 1-1',
    })
    client.close()
  })

  test('invalid generated questions get one bounded repair and otherwise do not create a session', async () => {
    let calls = 0
    const repaired = makeApp(async ({ language }) => {
      calls += 1
      const output = generatedSet(language)
      if (calls === 1) output.questions[0]!.domainId = 'unknown-domain'
      return output
    })
    expect((await start(repaired)).sessionId).toBeTruthy()
    expect(calls).toBe(2)
    client.close()

    const secondDatabase = createDatabase(':memory:')
    const secondClient = secondDatabase.client
    const secondDb = secondDatabase.db
    migrate(secondDb, { migrationsFolder: './drizzle' })
    await syncCertificationCatalog(secondDb, certificationCatalog, new Date())
    const invalidService = createSimulationService(secondDb, {
      guideService: { getGuide: async () => guide },
      questionGenerator: async ({ language }) => ({ ...generatedSet(language), questions: [] }),
    })
    const invalidApp = createApp({ db: secondDb, userProvider: async () => ({
      id: 'learner-1', permissions: [],
    }), simulationService: invalidService })
    const invalid = await invalidApp.request('/api/v1/simulations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ certificationId: certification.id, mode: 'real', language: 'en' }),
    })
    expect(invalid.status).toBe(503)
    expect(await secondDb.select().from(simulationSessions)).toHaveLength(0)
    secondClient.close()
  })

  test('concurrent answer submissions cannot overwrite the same question', async () => {
    const app = makeApp()
    const session = await start(app)
    const submit = () => app.request(`/api/v1/simulations/${session.sessionId}/answers`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ questionId: session.currentQuestion.id, answerId: session.currentQuestion.answers[0]!.id }),
    })
    const responses = await Promise.all([submit(), submit()])
    expect(responses.map(({ status }) => status).sort()).toEqual([200, 409])
    client.close()
  })

  test('the owner can resume pending practice state without generating questions or leaking unanswered keys', async () => {
    let time = new Date('2026-10-01T00:00:00.000Z')
    let generationCalls = 0
    const app = makeApp(async ({ language }) => {
      generationCalls += 1
      return generatedSet(language)
    }, () => time)
    const session = await start(app, 'practice')

    const activePath = '/api/v1/simulations/active'
    const initial = await app.request(activePath)
    expect(initial.status).toBe(200)
    const initialSnapshot = await initial.json() as SimulationSnapshot
    expect(initialSnapshot).toMatchObject({
      sessionId: session.sessionId,
      certificationId: certification.id,
      mode: 'practice',
      currentIndex: 0,
      expiresAt: null,
      practiceProgress: { attempts: 0, status: 'answering' },
    })
    expect(JSON.stringify(initialSnapshot)).not.toMatch(/correctAnswerId|explanation/)
    expect(await (await app.request(activePath, { headers: { 'x-test-user': 'learner-2' } })).json()).toBeNull()
    expect((await app.request(`/api/v1/simulations/${session.sessionId}`, { headers: { 'x-test-user': 'learner-2' } })).status).toBe(404)

    const submit = (answerId: string) => app.request(`/api/v1/simulations/${session.sessionId}/answers`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ questionId: session.currentQuestion.id, answerId }),
    })
    expect((await submit(await answerChoice(session.sessionId, session.currentQuestion, false))).status).toBe(200)
    const afterWrong = await (await app.request(activePath)).json() as SimulationSnapshot
    expect(afterWrong.practiceProgress).toMatchObject({ attempts: 1, status: 'incorrect', canRetry: true })
    expect(JSON.stringify(afterWrong)).not.toMatch(/correctAnswerId|explanation/)

    expect((await submit(await answerChoice(session.sessionId, session.currentQuestion))).status).toBe(200)
    const resolved = await (await app.request(activePath)).json() as SimulationSnapshot
    expect(resolved.practiceProgress).toMatchObject({
      attempts: 2,
      status: 'correct',
      correctAnswerId: await answerChoice(session.sessionId, session.currentQuestion),
      explanation: 'Private answer explanation.',
      canContinue: true,
    })
    const advanced = await app.request(`/api/v1/simulations/${session.sessionId}/next`, { method: 'POST' })
    expect(advanced.status).toBe(200)
    const current = await (await app.request(activePath)).json() as SimulationSnapshot
    expect(current.currentIndex).toBe(1)
    expect((await app.request(`/api/v1/simulations/${session.sessionId}/reveal`, { method: 'POST' })).status).toBe(200)
    expect((await (await app.request(activePath)).json() as SimulationSnapshot).practiceProgress).toMatchObject({
      status: 'revealed',
      correctAnswerId: await answerChoice(session.sessionId, current.currentQuestion!),
      canContinue: true,
    })
    time = new Date('2026-12-15T00:00:00.000Z')
    expect((await (await app.request(activePath)).json() as SimulationSnapshot).sessionId).toBe(session.sessionId)
    expect(generationCalls).toBe(1)

    expect((await app.request(`/api/v1/simulations/${session.sessionId}`, {
      method: 'DELETE',
      headers: { 'x-test-user': 'learner-2' },
    })).status).toBe(404)
    expect((await app.request(`/api/v1/simulations/${session.sessionId}`, { method: 'DELETE' })).status).toBe(204)
    expect(await (await app.request(activePath)).json()).toBeNull()
    client.close()
  })

  test('successful starts replace pending progress, failed generation preserves it, and retries keep the hourly limit', async () => {
    let generationCalls = 0
    const app = makeApp(async ({ language }) => {
      generationCalls += 1
      const generated = generatedSet(language)
      if (generationCalls === 2 || generationCalls === 3) generated.questions = []
      return generated
    })
    const first = await start(app)
    for (let index = 0; index < 4; index += 1) {
      expect((await app.request('/api/v1/simulations/active')).status).toBe(200)
    }
    const failedReplacement = await app.request('/api/v1/simulations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ certificationId: certification.id, mode: 'real', language: 'en' }),
    })
    expect(failedReplacement.status).toBe(503)
    expect((await (await app.request('/api/v1/simulations/active')).json() as SimulationSnapshot).sessionId).toBe(first.sessionId)

    const replacement = await start(app)
    expect(replacement.sessionId).not.toBe(first.sessionId)
    expect((await app.request(`/api/v1/simulations/${first.sessionId}`)).status).toBe(404)
    const rateLimited = await app.request('/api/v1/simulations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ certificationId: certification.id, mode: 'real', language: 'en' }),
    })
    expect(rateLimited.status).toBe(429)
    expect((await (await app.request('/api/v1/simulations/active')).json() as SimulationSnapshot).sessionId).toBe(replacement.sessionId)
    client.close()
  })

  test('completed session rows keep short retention while their result remains in history', async () => {
    let time = new Date('2026-10-01T00:00:00.000Z')
    const app = makeApp(undefined, () => time)
    const session = await start(app)
    let question = session.currentQuestion

    for (let index = 0; index < 20; index += 1) {
      const response = await app.request(`/api/v1/simulations/${session.sessionId}/answers`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ questionId: question.id, answerId: question.answers[0]!.id }),
      })
      expect(response.status).toBe(200)
      const body = await response.json() as Record<string, unknown>
      if (index < 19) question = body.nextQuestion as typeof question
    }

    const completed = await (await app.request(`/api/v1/simulations/${session.sessionId}`)).json() as SimulationSnapshot
    expect(completed.status).toBe('completed')
    expect(completed.expiresAt).toBe('2026-10-01T02:00:00.000Z')
    time = new Date('2026-10-01T02:00:01.000Z')
    expect((await app.request(`/api/v1/simulations/${session.sessionId}`)).status).toBe(404)
    const history = await (await app.request('/api/v1/simulation-history')).json() as { sessions: unknown[] }
    expect(history.sessions).toHaveLength(1)
    client.close()
  })

  test('concurrent service instances leave at most one pending session for the user', async () => {
    let entered = 0
    let release!: () => void
    const generationBarrier = new Promise<void>((resolve) => { release = resolve })
    const generator: QuestionGenerator = async ({ language }) => {
      entered += 1
      if (entered === 2) release()
      await generationBarrier
      return generatedSet(language)
    }
    const firstApp = makeApp(generator)
    const secondApp = makeApp(generator)
    const startRequest = () => ({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ certificationId: certification.id, mode: 'real', language: 'en' }),
    })
    const responses = await Promise.all([
      firstApp.request('/api/v1/simulations', startRequest()),
      secondApp.request('/api/v1/simulations', startRequest()),
    ])

    expect(responses.filter(({ status }) => status === 201)).toHaveLength(1)
    expect(await db.select().from(simulationSessions).where(eq(simulationSessions.status, 'active'))).toHaveLength(1)
    expect(await (await firstApp.request('/api/v1/simulations/active')).json()).toMatchObject({ status: 'active', expiresAt: null })
    client.close()
  })
})
