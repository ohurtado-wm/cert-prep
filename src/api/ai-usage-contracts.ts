import { z } from 'zod'

export const AiTokenUsageSchema = z.object({
  inputTokens: z.number().int().min(0).nullable(),
  outputTokens: z.number().int().min(0).nullable(),
  totalTokens: z.number().int().min(0).nullable(),
})

export type AiTokenUsage = z.infer<typeof AiTokenUsageSchema>
