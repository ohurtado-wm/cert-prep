import { randomUUID } from 'node:crypto'
import { AiTokenUsageSchema, type AiTokenUsage } from '../../src/api/ai-usage-contracts'
import { and, count, desc, eq, gt, gte, inArray, lte } from 'drizzle-orm'
import {
  SimulationAnswerResponseSchema,
  MAX_SIMULATION_HISTORY_ITEMS,
  SimulationRevealResponseSchema,
  SimulationSnapshotSchema,
  type SimulationAnswerResponse,
  type SimulationRevealResponse,
  type SimulationSnapshot,
  type SimulationResult,
  type StartSimulationRequest,
  type SubmitAnswerRequest,
} from '../../src/api/simulation-contracts'
import { WeakTopicAnalysisResponseSchema, type WeakTopic } from '../../src/api/weak-topic-contracts'
import type { DatabaseHandle } from '../db/client'
import { certificationGuides, simulationResults, simulationSessions, simulationStartEvents } from '../db/schema'
import { ApiException } from '../errors'
import type { createCertificationGuideService } from './certification-guide-service'
import { createAiQuestionGenerator, type QuestionGenerator } from '../simulations/question-generator'
import { InvalidQuestionSetError, allocateQuestionsByWeight, validateGeneratedQuestions } from '../simulations/question-validation'
import { allocateFocusedQuestions, analyzeWeakTopics } from '../simulations/weak-topic-analysis'
import { StoredSimulationStateSchema, type StoredSimulationQuestion, type StoredSimulationState } from '../simulations/state'

const SESSION_LIFETIME_MS = 2 * 60 * 60 * 1_000
const RATE_WINDOW_MS = 60 * 60 * 1_000
const MAX_STARTS_PER_HOUR = 3
const MAX_ACTIVE_SESSIONS = 2
const MAX_ANSWER_ATTEMPTS = 3
const MAX_QUESTION_GENERATION_ATTEMPTS = 2

type GuideService = Pick<ReturnType<typeof createCertificationGuideService>, 'getGuide'>

type SimulationServiceOptions = {
  guideService: GuideService
  questionGenerator?: QuestionGenerator
  now?: () => Date
  sessionIdFactory?: () => string
  questionIdFactory?: () => string
}

type SessionRow = typeof simulationSessions.$inferSelect

function parseState(value: unknown): StoredSimulationState {
  const parsed = StoredSimulationStateSchema.safeParse(value)
  if (!parsed.success) throw new ApiException(500, 'SIMULATION_STATE_INVALID', 'No se pudo leer la sesión guardada.')
  return parsed.data
}

function publicQuestion(question: StoredSimulationQuestion) {
  return {
    id: question.id,
    domainId: question.domainId,
    topicId: question.topicId,
    focus: question.focus,
    service: question.service,
    question: question.question,
    answers: question.answers.map(({ id, text }) => ({ id, text })),
  }
}

function toSnapshot(row: SessionRow, state: StoredSimulationState): SimulationSnapshot {
  return SimulationSnapshotSchema.parse({
    sessionId: row.id,
    certificationId: row.certificationId,
    mode: row.mode,
    language: state.language,
    status: state.status,
    questionCount: 20,
    currentIndex: state.currentIndex,
    expiresAt: row.expiresAt.toISOString(),
    currentQuestion: state.status === 'active' ? publicQuestion(state.questions[state.currentIndex]!) : null,
    result: state.status === 'completed' ? state.result : null,
    aiUsage: state.aiUsage ?? null,
  })
}

function unwrapQuestionGeneration(value: unknown): { questions: unknown; aiUsage: AiTokenUsage | null } {
  if (typeof value !== 'object' || value === null || !('output' in value)) {
    return { questions: value, aiUsage: null }
  }
  const generated = value as { output: unknown; usage?: unknown }
  const usage = AiTokenUsageSchema.safeParse(generated.usage)
  return { questions: generated.output, aiUsage: usage.success ? usage.data : null }
}

function aggregateTokenUsage(usages: AiTokenUsage[]): AiTokenUsage | null {
  if (usages.length === 0) return null
  const sumKnown = (key: keyof AiTokenUsage) => {
    const values = usages.map((usage) => usage[key])
    return values.every((value): value is number => value !== null)
      ? values.reduce((total, value) => total + value, 0)
      : null
  }
  const inputTokens = sumKnown('inputTokens')
  const outputTokens = sumKnown('outputTokens')
  const reportedTotal = sumKnown('totalTokens')
  return {
    inputTokens,
    outputTokens,
    totalTokens: reportedTotal ?? (inputTokens !== null && outputTokens !== null ? inputTokens + outputTokens : null),
  }
}

function isActiveState(value: unknown) {
  const parsed = StoredSimulationStateSchema.safeParse(value)
  return !parsed.success || parsed.data.status === 'active'
}

function calculateResult(questions: StoredSimulationQuestion[]): SimulationResult {
  if (questions.length !== 20 || questions.some(({ outcome }) => outcome === 'pending')) {
    throw new ApiException(409, 'SIMULATION_INCOMPLETE', 'Debes responder las 20 preguntas antes de ver el resultado.')
  }

  const tally = (key: 'domainId' | 'topicId' | 'focus') => {
    const groups = new Map<string, { correct: number; total: number }>()
    for (const question of questions) {
      const group = groups.get(question[key]) ?? { correct: 0, total: 0 }
      group.total += 1
      if (question.outcome === 'first_try') group.correct += 1
      groups.set(question[key], group)
    }
    return [...groups.entries()].map(([id, value]) => ({ id, ...value }))
  }

  const correctAnswers = questions.filter(({ outcome }) => outcome === 'first_try').length
  return SimulationSnapshotSchema.shape.result.unwrap().parse({
    score: Math.round(correctAnswers / questions.length * 100),
    totalQuestions: 20,
    correctAnswers,
    correctAfterRetry: questions.filter(({ outcome }) => outcome === 'retry').length,
    answersRevealed: questions.filter(({ outcome }) => outcome === 'revealed').length,
    incorrectAnswers: questions.filter(({ outcome }) => outcome === 'incorrect').length,
    domainBreakdown: tally('domainId'),
    topicBreakdown: tally('topicId'),
    focusBreakdown: tally('focus'),
  })
}

function completeState(
  language: StoredSimulationState['language'],
  result: SimulationResult,
  aiUsage: AiTokenUsage | null | undefined,
): StoredSimulationState {
  return StoredSimulationStateSchema.parse({
    version: 1,
    language,
    status: 'completed',
    currentIndex: 20,
    questions: [],
    result,
    aiUsage: aiUsage ?? null,
  })
}

function replaceQuestion(state: Extract<StoredSimulationState, { status: 'active' }>, index: number, question: StoredSimulationQuestion) {
  const questions = [...state.questions]
  questions[index] = question
  return { ...state, questions }
}

function weightedFeedback(error: unknown) {
  if (error instanceof InvalidQuestionSetError) return error.message
  return 'The generated content did not pass validation. Regenerate the full set and follow every required domain and topic count.'
}

export function createSimulationService(db: DatabaseHandle, options: SimulationServiceOptions) {
  const questionGenerator = options.questionGenerator ?? createAiQuestionGenerator()
  const now = options.now ?? (() => new Date())
  const sessionIdFactory = options.sessionIdFactory ?? randomUUID
  const questionIdFactory = options.questionIdFactory ?? randomUUID
  const generationInProgress = new Set<string>()
  const failedStartAttempts = new Map<string, number[]>()

  async function ownedSession(userId: string, sessionId: string) {
    const row = await db.query.simulationSessions.findFirst({
      where: and(eq(simulationSessions.id, sessionId), eq(simulationSessions.gatewayUserId, userId)),
    })
    if (!row) throw new ApiException(404, 'SIMULATION_NOT_FOUND', 'No se encontró esa sesión.')
    if (row.expiresAt.getTime() <= now().getTime()) {
      await db.delete(simulationSessions).where(and(
        eq(simulationSessions.id, sessionId),
        eq(simulationSessions.gatewayUserId, userId),
      ))
      throw new ApiException(404, 'SIMULATION_EXPIRED', 'La sesión venció. Inicia una nueva simulación.')
    }
    return row
  }

  async function saveState(row: SessionRow, userId: string, oldState: StoredSimulationState, nextState: StoredSimulationState) {
    const updated = await db.update(simulationSessions).set({ state: nextState }).where(and(
      eq(simulationSessions.id, row.id),
      eq(simulationSessions.gatewayUserId, userId),
      eq(simulationSessions.state, oldState),
      gt(simulationSessions.expiresAt, now()),
    )).returning({ id: simulationSessions.id })
    if (updated.length === 0) throw new ApiException(409, 'SIMULATION_CONFLICT', 'La sesión cambió. Recarga la pregunta actual.')
  }

  async function saveCompletedState(
    row: SessionRow,
    userId: string,
    oldState: StoredSimulationState,
    nextState: StoredSimulationState,
    result: SimulationResult,
  ) {
    await db.transaction(async (tx) => {
      const completedAt = now()
      const updated = await tx.update(simulationSessions).set({ state: nextState }).where(and(
        eq(simulationSessions.id, row.id),
        eq(simulationSessions.gatewayUserId, userId),
        eq(simulationSessions.state, oldState),
        gt(simulationSessions.expiresAt, completedAt),
      )).returning({ id: simulationSessions.id })
      if (updated.length === 0) {
        throw new ApiException(409, 'SIMULATION_CONFLICT', 'La sesión cambió. Recarga la pregunta actual.')
      }

      await tx.insert(simulationResults).values({
        id: row.id,
        gatewayUserId: userId,
        certificationId: row.certificationId,
        guideVersion: row.guideVersion,
        mode: row.mode,
        language: oldState.language,
        score: result.score,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        correctAfterRetry: result.correctAfterRetry,
        answersRevealed: result.answersRevealed,
        incorrectAnswers: result.incorrectAnswers,
        domainBreakdown: Object.fromEntries(result.domainBreakdown.map(({ id, ...value }) => [id, value])),
        topicBreakdown: Object.fromEntries(result.topicBreakdown.map(({ id, ...value }) => [id, value])),
        focusBreakdown: Object.fromEntries(result.focusBreakdown.map(({ id, ...value }) => [id, value])),
        completedAt,
      })

      const expiredHistory = await tx.select({ id: simulationResults.id }).from(simulationResults)
        .where(eq(simulationResults.gatewayUserId, userId))
        .orderBy(desc(simulationResults.completedAt), desc(simulationResults.id))
        .limit(MAX_SIMULATION_HISTORY_ITEMS)
        .offset(MAX_SIMULATION_HISTORY_ITEMS)
      if (expiredHistory.length > 0) {
        const expiredIds = expiredHistory.map(({ id }) => id)
        await tx.delete(simulationResults).where(inArray(simulationResults.id, expiredIds))
        await tx.delete(simulationSessions).where(and(
          eq(simulationSessions.gatewayUserId, userId),
          inArray(simulationSessions.id, expiredIds),
        ))
      }
    })
  }

  async function loadWeakTopicAnalysis(userId: string, certificationId: string, knownTopicIds?: ReadonlySet<string>) {
    const sessions = await db.select({
      topicBreakdown: simulationResults.topicBreakdown,
      completedAt: simulationResults.completedAt,
    }).from(simulationResults).where(and(
      eq(simulationResults.gatewayUserId, userId),
      eq(simulationResults.certificationId, certificationId),
    )).orderBy(desc(simulationResults.completedAt)).limit(10)

    return WeakTopicAnalysisResponseSchema.parse(analyzeWeakTopics({ certificationId, sessions, knownTopicIds }))
  }

  async function getWeakTopicAnalysis(userId: string, certificationId: string) {
    const [guide] = await db.select({ domains: certificationGuides.domains })
      .from(certificationGuides).where(eq(certificationGuides.certificationId, certificationId)).limit(1)
    const knownTopicIds = guide ? new Set(guide.domains.flatMap((domain) => domain.topics.map((topic) => topic.id))) : undefined
    return loadWeakTopicAnalysis(userId, certificationId, knownTopicIds)
  }

  async function start(userId: string, request: StartSimulationRequest): Promise<SimulationSnapshot> {
    return startInternal(userId, request, false)
  }

  async function startWeakTopics(userId: string, request: StartSimulationRequest): Promise<SimulationSnapshot> {
    return startInternal(userId, request, true)
  }

  async function startInternal(userId: string, request: StartSimulationRequest, focusWeakTopics: boolean): Promise<SimulationSnapshot> {
    const requestTime = now()
    const cutoff = requestTime.getTime() - RATE_WINDOW_MS
    const failures = (failedStartAttempts.get(userId) ?? []).filter((timestamp) => timestamp > cutoff)
    if (failures.length === 0) failedStartAttempts.delete(userId)
    else failedStartAttempts.set(userId, failures)
    if (generationInProgress.has(userId)) {
      throw new ApiException(429, 'SIMULATION_GENERATION_IN_PROGRESS', 'Ya se están preparando preguntas para ti.')
    }

    generationInProgress.add(userId)
    let saved = false
    let generationAttempted = false
    try {
      await db.delete(simulationSessions).where(and(
        eq(simulationSessions.gatewayUserId, userId),
        lte(simulationSessions.expiresAt, requestTime),
      ))

      await db.delete(simulationStartEvents).where(and(
        eq(simulationStartEvents.gatewayUserId, userId),
        lte(simulationStartEvents.startedAt, new Date(cutoff)),
      ))
      const [recentStartCount] = await db.select({ value: count() }).from(simulationStartEvents).where(and(
        eq(simulationStartEvents.gatewayUserId, userId),
        gte(simulationStartEvents.startedAt, new Date(cutoff)),
      ))
      if ((recentStartCount?.value ?? 0) + failures.length >= MAX_STARTS_PER_HOUR) {
        throw new ApiException(429, 'SIMULATION_RATE_LIMITED', 'Alcanzaste el límite de simulaciones por hora. Intenta más tarde.')
      }

      const activeRows = await db.select({ state: simulationSessions.state }).from(simulationSessions).where(and(
        eq(simulationSessions.gatewayUserId, userId),
        gt(simulationSessions.expiresAt, requestTime),
      ))
      if (activeRows.filter(({ state }) => isActiveState(state)).length >= MAX_ACTIVE_SESSIONS) {
        throw new ApiException(429, 'ACTIVE_SIMULATION_LIMIT', 'Completa o espera a que venza una simulación activa antes de iniciar otra.')
      }

      generationAttempted = true
      const guide = await options.guideService.getGuide(request.certificationId)
      const guideTopicIds = new Set(guide.domains.flatMap((domain) => domain.topics.map((topic) => topic.id)))
      const weakAnalysis = focusWeakTopics
        ? await loadWeakTopicAnalysis(userId, request.certificationId, guideTopicIds)
        : undefined
      if (weakAnalysis?.status === 'history_empty') {
        throw new ApiException(409, 'SIMULATION_HISTORY_EMPTY', 'Completa una simulación antes de practicar temas débiles.')
      }
      if (weakAnalysis?.status === 'no_weak_topics') {
        throw new ApiException(409, 'NO_WEAK_TOPICS', 'No hay temas por debajo del umbral para practicar. Puedes iniciar una simulación normal.')
      }

      const focusedTopics: WeakTopic[] | undefined = weakAnalysis?.topics.filter(({ topicId }) => guideTopicIds.has(topicId))
      if (focusWeakTopics && focusedTopics?.length === 0) {
        throw new ApiException(409, 'WEAK_TOPICS_UNAVAILABLE', 'Los temas débiles ya no están en la guía actual. Actualiza el análisis antes de iniciar.')
      }
      const focusedTopicCounts = focusedTopics ? allocateFocusedQuestions(focusedTopics) : undefined
      const questionGuide = focusedTopics
        ? {
          ...guide,
          domains: guide.domains.map((domain) => ({
            ...domain,
            topics: domain.topics.filter((topic) => focusedTopicCounts && Object.hasOwn(focusedTopicCounts, topic.id)),
          })).filter((domain) => domain.topics.length > 0),
        }
        : guide
      const requiredQuestionsByDomain = focusedTopicCounts
        ? Object.fromEntries(questionGuide.domains.map((domain) => [
          domain.id,
          domain.topics.reduce((sum, topic) => sum + (focusedTopicCounts[topic.id] ?? 0), 0),
        ]))
        : allocateQuestionsByWeight(guide.domains)
      let questions: StoredSimulationQuestion[] | undefined
      let feedback: string | undefined
      let lastValidationError: unknown
      const generationUsages: AiTokenUsage[] = []

      for (let attempt = 0; attempt < MAX_QUESTION_GENERATION_ATTEMPTS; attempt += 1) {
        const generated = await questionGenerator({
          guide: questionGuide,
          language: request.language,
          requiredQuestionsByDomain,
          ...(focusedTopicCounts ? { requiredQuestionsByTopic: focusedTopicCounts } : {}),
          ...(feedback ? { validationFeedback: feedback } : {}),
        })
        const generation = unwrapQuestionGeneration(generated)
        if (generation.aiUsage) generationUsages.push(generation.aiUsage)
        try {
          questions = validateGeneratedQuestions({
            value: generation.questions,
            guide: questionGuide,
            language: request.language,
            requiredQuestionsByDomain,
            ...(focusedTopicCounts ? { requiredQuestionsByTopic: focusedTopicCounts } : {}),
            idFactory: questionIdFactory,
          })
          break
        } catch (error) {
          lastValidationError = error
          if (!(error instanceof InvalidQuestionSetError) || attempt + 1 === MAX_QUESTION_GENERATION_ATTEMPTS) break
          feedback = weightedFeedback(error)
        }
      }

      if (!questions) {
        if (lastValidationError instanceof InvalidQuestionSetError) {
          throw new ApiException(503, 'QUESTION_SET_INVALID', 'Las preguntas generadas no pasaron la validación. Puedes volver a intentarlo.')
        }
        throw new ApiException(503, 'QUESTION_GENERATION_UNAVAILABLE', 'No se pudieron generar las preguntas. Intenta de nuevo.')
      }

      const sessionId = sessionIdFactory()
      const expiry = new Date(requestTime.getTime() + SESSION_LIFETIME_MS)
      const state = StoredSimulationStateSchema.parse({
        version: 1,
        language: request.language,
        status: 'active',
        currentIndex: 0,
        questions,
        aiUsage: aggregateTokenUsage(generationUsages),
      })
      const rowValues = {
        id: sessionId,
        gatewayUserId: userId,
        certificationId: guide.certification.id,
        mode: request.mode,
        guideVersion: guide.version,
        state,
        createdAt: requestTime,
        expiresAt: expiry,
      }
      await db.transaction(async (tx) => {
        await tx.insert(simulationSessions).values(rowValues)
        await tx.insert(simulationStartEvents).values({ id: sessionId, gatewayUserId: userId, startedAt: requestTime })
      })
      saved = true
      return toSnapshot(rowValues, state)
    } catch (error) {
      if (generationAttempted && !saved) {
        const nextFailures = [...(failedStartAttempts.get(userId) ?? []), requestTime.getTime()]
        failedStartAttempts.set(userId, nextFailures)
      }
      if (error instanceof ApiException) throw error
      if (error instanceof InvalidQuestionSetError) {
        throw new ApiException(503, 'GUIDE_INVALID', 'La guía de certificación no se pudo usar para crear la simulación.')
      }
      throw new ApiException(503, 'QUESTION_GENERATION_UNAVAILABLE', 'No se pudieron generar las preguntas. Intenta de nuevo.')
    } finally {
      generationInProgress.delete(userId)
    }
  }

  async function get(userId: string, sessionId: string): Promise<SimulationSnapshot> {
    const row = await ownedSession(userId, sessionId)
    return toSnapshot(row, parseState(row.state))
  }

  async function cancel(userId: string, sessionId: string) {
    const row = await db.delete(simulationSessions).where(and(
      eq(simulationSessions.id, sessionId),
      eq(simulationSessions.gatewayUserId, userId),
    )).returning({ id: simulationSessions.id })
    if (row.length === 0) throw new ApiException(404, 'SIMULATION_NOT_FOUND', 'No se encontró esa sesión.')
  }

  async function answer(userId: string, sessionId: string, input: SubmitAnswerRequest): Promise<SimulationAnswerResponse> {
    const row = await ownedSession(userId, sessionId)
    const state = parseState(row.state)
    if (state.status !== 'active') throw new ApiException(409, 'SIMULATION_COMPLETED', 'La simulación ya terminó.')

    const index = state.currentIndex
    const question = state.questions[index]!
    if (input.questionId !== question.id) throw new ApiException(409, 'QUESTION_OUT_OF_ORDER', 'Responde la pregunta actual antes de avanzar.')
    if (!question.answers.some(({ id }) => id === input.answerId)) {
      throw new ApiException(422, 'ANSWER_NOT_IN_QUESTION', 'La opción seleccionada no pertenece a esta pregunta.')
    }

    if (row.mode === 'real') {
      if (question.attempts !== 0 || question.outcome !== 'pending') {
        throw new ApiException(409, 'QUESTION_ALREADY_ANSWERED', 'Esta pregunta ya tiene una respuesta registrada.')
      }
      const updatedQuestion = {
        ...question,
        attempts: 1,
        outcome: input.answerId === question.correctAnswerId ? 'first_try' as const : 'incorrect' as const,
      }
      const updatedQuestions = [...state.questions]
      updatedQuestions[index] = updatedQuestion

      if (index === 19) {
        const result = calculateResult(updatedQuestions)
        const completed = completeState(state.language, result, state.aiUsage)
        await saveCompletedState(row, userId, state, completed, result)
        return SimulationAnswerResponseSchema.parse({ mode: 'real', status: 'completed', result })
      }

      const nextState = { ...state, currentIndex: index + 1, questions: updatedQuestions }
      await saveState(row, userId, state, nextState)
      return SimulationAnswerResponseSchema.parse({
        mode: 'real',
        status: 'advanced',
        nextQuestion: publicQuestion(nextState.questions[index + 1]!),
      })
    }

    if (question.outcome !== 'pending' || question.attempts >= MAX_ANSWER_ATTEMPTS) {
      throw new ApiException(409, 'QUESTION_ALREADY_ANSWERED', 'Continúa a la siguiente pregunta o revela la respuesta correcta.')
    }

    const attempts = question.attempts + 1
    const isCorrect = input.answerId === question.correctAnswerId
    const outcome = isCorrect
      ? attempts === 1 ? 'first_try' as const : 'retry' as const
      : attempts === MAX_ANSWER_ATTEMPTS ? 'incorrect' as const : 'pending' as const
    const nextState = replaceQuestion(state, index, { ...question, attempts, outcome })
    await saveState(row, userId, state, nextState)
    return SimulationAnswerResponseSchema.parse({
      mode: 'practice',
      status: isCorrect ? 'correct' : 'incorrect',
      attempts,
      canRetry: !isCorrect && outcome === 'pending',
      canReveal: !isCorrect,
      canContinue: isCorrect || outcome === 'incorrect',
      ...(isCorrect ? { correctAnswerId: question.correctAnswerId, explanation: question.explanation } : {}),
    })
  }

  async function reveal(userId: string, sessionId: string): Promise<SimulationRevealResponse> {
    const row = await ownedSession(userId, sessionId)
    if (row.mode !== 'practice') throw new ApiException(409, 'REVEAL_NOT_ALLOWED', 'La Simulación Real no revela respuestas durante la sesión.')
    const state = parseState(row.state)
    if (state.status !== 'active') throw new ApiException(409, 'SIMULATION_COMPLETED', 'La simulación ya terminó.')
    const index = state.currentIndex
    const question = state.questions[index]!
    if (question.outcome !== 'pending' && question.outcome !== 'incorrect') {
      throw new ApiException(409, 'QUESTION_ALREADY_ANSWERED', 'Esta pregunta ya está resuelta.')
    }

    const nextState = replaceQuestion(state, index, { ...question, outcome: 'revealed' })
    await saveState(row, userId, state, nextState)
    return SimulationRevealResponseSchema.parse({
      mode: 'practice',
      status: 'revealed',
      correctAnswerId: question.correctAnswerId,
      explanation: question.explanation,
      canContinue: true,
    })
  }

  async function next(userId: string, sessionId: string): Promise<SimulationSnapshot> {
    const row = await ownedSession(userId, sessionId)
    if (row.mode !== 'practice') throw new ApiException(409, 'NEXT_NOT_ALLOWED', 'En Simulación Real la respuesta mueve a la siguiente pregunta automáticamente.')
    const state = parseState(row.state)
    if (state.status !== 'active') throw new ApiException(409, 'SIMULATION_COMPLETED', 'La simulación ya terminó.')
    const current = state.questions[state.currentIndex]!
    if (!['first_try', 'retry', 'revealed', 'incorrect'].includes(current.outcome)) {
      throw new ApiException(409, 'QUESTION_NOT_RESOLVED', 'Resuelve o revela la pregunta actual antes de continuar.')
    }

    if (state.currentIndex === 19) {
      const result = calculateResult(state.questions)
      const completed = completeState(state.language, result, state.aiUsage)
      await saveCompletedState(row, userId, state, completed, result)
      return toSnapshot({ ...row, state: completed }, completed)
    }

    const updated = { ...state, currentIndex: state.currentIndex + 1 }
    await saveState(row, userId, state, updated)
    return toSnapshot({ ...row, state: updated }, updated)
  }

  return { start, startWeakTopics, getWeakTopicAnalysis, get, cancel, answer, reveal, next }
}
