import { z } from 'zod'
import { LocaleSchema } from './certification-contracts'
import { AiTokenUsageSchema } from './ai-usage-contracts'

export const SimulationModeSchema = z.enum(['practice', 'real'])
export const MAX_SIMULATION_HISTORY_ITEMS = 20

export const StartSimulationRequestSchema = z.object({
  certificationId: z.string().regex(/^[a-z0-9-]+$/),
  mode: SimulationModeSchema,
  language: LocaleSchema,
})

export const SubmitAnswerRequestSchema = z.object({
  questionId: z.string().min(1),
  answerId: z.string().min(1),
})

export const SimulationAnswerOptionSchema = z.object({ id: z.string().min(1), text: z.string().min(1) })
export const SimulationQuestionSchema = z.object({
  id: z.string().min(1),
  domainId: z.string().min(1),
  topicId: z.string().min(1),
  focus: z.string().min(1),
  service: z.string().min(1),
  question: z.string().min(1),
  answers: z.array(SimulationAnswerOptionSchema).length(4),
})

export const SimulationBreakdownSchema = z.object({
  id: z.string().min(1),
  correct: z.number().int().min(0),
  total: z.number().int().positive(),
})

export const SimulationResultSchema = z.object({
  score: z.number().int().min(0).max(100),
  totalQuestions: z.literal(20),
  correctAnswers: z.number().int().min(0).max(20),
  correctAfterRetry: z.number().int().min(0).max(20),
  answersRevealed: z.number().int().min(0).max(20),
  incorrectAnswers: z.number().int().min(0).max(20),
  domainBreakdown: z.array(SimulationBreakdownSchema),
  topicBreakdown: z.array(SimulationBreakdownSchema),
  focusBreakdown: z.array(SimulationBreakdownSchema).default([]),
})

export const SimulationHistoryItemSchema = z.object({
  id: z.string().min(1),
  certificationId: z.string().min(1),
  guideVersion: z.number().int().positive(),
  mode: SimulationModeSchema,
  language: LocaleSchema,
  completedAt: z.string().datetime(),
  ...SimulationResultSchema.shape,
})

export const SimulationHistoryResponseSchema = z.object({
  sessions: z.array(SimulationHistoryItemSchema).max(MAX_SIMULATION_HISTORY_ITEMS),
})
export const ClearSimulationHistoryResponseSchema = z.object({
  deletedSessions: z.number().int().min(0),
  deletedPlans: z.number().int().min(0),
})

export const SimulationSnapshotSchema = z.object({
  sessionId: z.string().min(1),
  certificationId: z.string().min(1),
  mode: SimulationModeSchema,
  language: LocaleSchema,
  status: z.enum(['active', 'completed']),
  questionCount: z.literal(20),
  currentIndex: z.number().int().min(0).max(20),
  expiresAt: z.string().datetime(),
  currentQuestion: SimulationQuestionSchema.nullable(),
  result: SimulationResultSchema.nullable(),
  aiUsage: AiTokenUsageSchema.nullable().optional(),
})

const PracticeAnswerResponseSchema = z.object({
  mode: z.literal('practice'),
  status: z.enum(['incorrect', 'correct']),
  attempts: z.number().int().positive().max(3),
  canRetry: z.boolean(),
  canReveal: z.boolean(),
  canContinue: z.boolean(),
  correctAnswerId: z.string().min(1).optional(),
  explanation: z.string().min(1).optional(),
})

const RealAnswerResponseSchema = z.discriminatedUnion('status', [
  z.object({ mode: z.literal('real'), status: z.literal('advanced'), nextQuestion: SimulationQuestionSchema }),
  z.object({ mode: z.literal('real'), status: z.literal('completed'), result: SimulationResultSchema }),
])

export const SimulationAnswerResponseSchema = z.union([PracticeAnswerResponseSchema, RealAnswerResponseSchema])

export const SimulationRevealResponseSchema = z.object({
  mode: z.literal('practice'),
  status: z.literal('revealed'),
  correctAnswerId: z.string().min(1),
  explanation: z.string().min(1),
  canContinue: z.literal(true),
})

export type SimulationMode = z.infer<typeof SimulationModeSchema>
export type StartSimulationRequest = z.infer<typeof StartSimulationRequestSchema>
export type SubmitAnswerRequest = z.infer<typeof SubmitAnswerRequestSchema>
export type SimulationAnswerOption = z.infer<typeof SimulationAnswerOptionSchema>
export type SimulationQuestion = z.infer<typeof SimulationQuestionSchema>
export type SimulationResult = z.infer<typeof SimulationResultSchema>
export type SimulationHistoryItem = z.infer<typeof SimulationHistoryItemSchema>
export type SimulationHistoryResponse = z.infer<typeof SimulationHistoryResponseSchema>
export type SimulationSnapshot = z.infer<typeof SimulationSnapshotSchema>
export type SimulationAnswerResponse = z.infer<typeof SimulationAnswerResponseSchema>
export type SimulationRevealResponse = z.infer<typeof SimulationRevealResponseSchema>
