import { z } from 'zod'
import { AiTokenUsageSchema } from './ai-usage-contracts'
import { LocaleSchema } from './certification-contracts'

export const StudyPlanRequestSchema = z.object({
  certificationId: z.string().regex(/^[a-z0-9-]+$/),
  language: LocaleSchema,
})

export const StudyPlanEvidenceSchema = z.object({
  correct: z.number().int().min(0),
  total: z.number().int().positive(),
  incorrect: z.number().int().min(0),
  accuracy: z.number().min(0).max(100),
})

export const StudyPlanRecommendationSchema = z.object({
  targetKind: z.enum(['domain', 'topic']),
  targetId: z.string().min(1),
  domainId: z.string().min(1),
  label: z.string().min(1),
  priority: z.number().int().positive(),
  evidence: StudyPlanEvidenceSchema,
  title: z.string().min(1),
  rationale: z.string().min(1),
  actions: z.array(z.string().min(1)).min(1).max(5),
  resource: z.object({
    title: z.string().min(1),
    url: z.string().url(),
  }),
})

export const StudyPlanContentSchema = z.object({
  language: LocaleSchema,
  basedOnSessions: z.number().int().min(1).max(10),
  summary: z.string().min(1),
  recommendations: z.array(StudyPlanRecommendationSchema).min(1).max(5),
  aiUsage: AiTokenUsageSchema.nullable(),
})

export const StudyPlanSchema = StudyPlanContentSchema.extend({
  id: z.string().min(1),
  certificationId: z.string().min(1),
  createdAt: z.string().datetime(),
})

export const LatestStudyPlanResponseSchema = z.object({
  plan: StudyPlanSchema.nullable(),
})

export type StudyPlanRequest = z.infer<typeof StudyPlanRequestSchema>
export type StudyPlanRecommendation = z.infer<typeof StudyPlanRecommendationSchema>
export type StudyPlanContent = z.infer<typeof StudyPlanContentSchema>
export type StudyPlan = z.infer<typeof StudyPlanSchema>
