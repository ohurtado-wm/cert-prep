import { randomUUID } from 'node:crypto'
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
import type { DatabaseHandle } from '../db/client'
import { simulationResults, simulationSessions, simulationStartEvents } from '../db/schema'
import { ApiException } from '../errors'
import type { createCertificationGuideService } from './certification-guide-service'
import { createAiQuestionGenerator, type QuestionGenerator } from '../simulations/question-generator'
import { InvalidQuestionSetError, allocateQuestionsByWeight, validateGeneratedQuestions } from '../simulations/question-validation'
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
  })
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

function completeState(language: StoredSimulationState['language'], result: SimulationResult): StoredSimulationState {
  return StoredSimulationStateSchema.parse({
    version: 1,
    language,
    status: 'completed',
    currentIndex: 20,
    questions: [],
    result,
  })
}

function replaceQuestion(state: Extract<StoredSimulationState, { status: 'active' }>, index: number, question: StoredSimulationQuestion) {
  const questions = [...state.questions]
  questions[index] = question
  return { ...state, questions }
}

function weightedFeedback(error: unknown) {
  if (error instanceof InvalidQuestionSetError) return error.message
  return 'The generated content did not pass validation. Regenerate the full set and follow every required domain count.'
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

  async function start(userId: string, request: StartSimulationRequest): Promise<SimulationSnapshot> {
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
      const requiredQuestionsByDomain = allocateQuestionsByWeight(guide.domains)
      let questions: StoredSimulationQuestion[] | undefined
      let feedback: string | undefined
      let lastValidationError: unknown

      for (let attempt = 0; attempt < MAX_QUESTION_GENERATION_ATTEMPTS; attempt += 1) {
        const raw = await questionGenerator({
          guide,
          language: request.language,
          requiredQuestionsByDomain,
          ...(feedback ? { validationFeedback: feedback } : {}),
        })
        try {
          questions = validateGeneratedQuestions({
            value: raw,
            guide,
            language: request.language,
            requiredQuestionsByDomain,
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
        const completed = completeState(state.language, result)
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
      const completed = completeState(state.language, result)
      await saveCompletedState(row, userId, state, completed, result)
      return toSnapshot({ ...row, state: completed }, completed)
    }

    const updated = { ...state, currentIndex: state.currentIndex + 1 }
    await saveState(row, userId, state, updated)
    return toSnapshot({ ...row, state: updated }, updated)
  }

  return { start, get, cancel, answer, reveal, next }
}
