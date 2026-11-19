import { z } from 'zod'
import { AiTokenUsageSchema } from '@cert-prep/contracts/ai-usage-contracts'
import { LocaleSchema } from '@cert-prep/contracts/certification-contracts'
import {
  SimulationQuestionSchema,
  SimulationResultSchema,
} from '@cert-prep/contracts/simulation-contracts'

const StoredQuestionSchema = SimulationQuestionSchema.extend({
  correctAnswerId: z.string().min(1),
  explanation: z.string().min(1).optional(),
  bankQuestionId: z.string().min(1).optional(),
  attempts: z.number().int().min(0).max(3),
  outcome: z.enum(['pending', 'first_try', 'retry', 'revealed', 'incorrect']),
  answerAttempts: z.array(z.object({ number: z.number().int().min(1).max(3), answerId: z.string().min(1) })).max(3).optional(),
}).superRefine((question, ctx) => {
  for (const [index, attempt] of (question.answerAttempts ?? []).entries()) {
    if (!question.answers.some((answer) => answer.id === attempt.answerId)
      || attempt.number > question.attempts
      || (index > 0 && attempt.number <= question.answerAttempts![index - 1]!.number)) {
      ctx.addIssue({ code: 'custom', message: 'Invalid recorded answer attempt.', path: ['answerAttempts', index] })
    }
  }
})

const SharedStateFields = {
  version: z.literal(1),
  language: LocaleSchema,
  questionSource: z.enum(['ai', 'advanced']).optional(),
  aiUsage: AiTokenUsageSchema.nullable().optional(),
}

export const StoredSimulationStateSchema = z.discriminatedUnion('status', [
  z.object({
    ...SharedStateFields,
    status: z.literal('active'),
    currentIndex: z.number().int().min(0).max(19),
    questions: z.array(StoredQuestionSchema).length(20),
  }),
  z.object({
    ...SharedStateFields,
    status: z.literal('completed'),
    currentIndex: z.literal(20),
    questions: z.array(StoredQuestionSchema).length(0),
    result: SimulationResultSchema,
  }),
])

export type StoredSimulationState = z.infer<typeof StoredSimulationStateSchema>
export type StoredSimulationQuestion = z.infer<typeof StoredQuestionSchema>
