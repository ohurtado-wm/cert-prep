import { z } from 'zod'
import { AiTokenUsageSchema } from '../../src/api/ai-usage-contracts'
import { LocaleSchema } from '../../src/api/certification-contracts'
import {
  SimulationQuestionSchema,
  SimulationResultSchema,
} from '../../src/api/simulation-contracts'

const StoredQuestionSchema = SimulationQuestionSchema.extend({
  correctAnswerId: z.string().min(1),
  explanation: z.string().min(1),
  attempts: z.number().int().min(0).max(3),
  outcome: z.enum(['pending', 'first_try', 'retry', 'revealed', 'incorrect']),
})

const SharedStateFields = {
  version: z.literal(1),
  language: LocaleSchema,
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
