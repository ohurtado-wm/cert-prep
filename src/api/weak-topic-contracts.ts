import { z } from 'zod'

export const WeakTopicAnalysisQuerySchema = z.object({
  certificationId: z.string().regex(/^[a-z0-9-]+$/),
})

export const WeakTopicAnalysisStatusSchema = z.enum(['ready', 'history_empty', 'no_weak_topics'])

export const WeakTopicSchema = z.object({
  topicId: z.string().min(1),
  correct: z.number().int().nonnegative(),
  total: z.number().int().positive(),
  incorrect: z.number().int().nonnegative(),
  accuracyPercent: z.number().int().min(0).max(100),
  lastPracticedAt: z.string().datetime(),
})

export const WeakTopicAnalysisResponseSchema = z.object({
  certificationId: z.string().min(1),
  status: WeakTopicAnalysisStatusSchema,
  thresholdPercent: z.number().int().min(1).max(100),
  analyzedSessionCount: z.number().int().nonnegative(),
  excludedWeakTopicCount: z.number().int().nonnegative(),
  topics: z.array(WeakTopicSchema).max(20),
})

export type WeakTopicAnalysisResponse = z.infer<typeof WeakTopicAnalysisResponseSchema>
export type WeakTopic = z.infer<typeof WeakTopicSchema>
