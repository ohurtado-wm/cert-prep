import { z } from 'zod'
import { AiTokenUsageSchema } from './ai-usage-contracts'

export const LocaleSchema = z.enum(['en', 'es'])
export const LocalizedTextSchema = z.object({ en: z.string().min(1), es: z.string().min(1) })

export const CertificationSourceSchema = z.object({
  kind: z.enum(['exam-guide', 'certification', 'learning-path']),
  title: z.string().min(1),
  url: z.string().url(),
})

export const CertificationCatalogItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: LocalizedTextSchema,
  examCode: z.string().min(1).nullable(),
  sources: z.array(CertificationSourceSchema).min(1),
})

export const CertificationCatalogResponseSchema = z.object({
  certifications: z.array(CertificationCatalogItemSchema),
})

export const GuideResearchSourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
})

export const GuideTopicSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: LocalizedTextSchema,
  description: LocalizedTextSchema,
})

export const GuideDomainSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  sourceSectionNumber: z.number().int().positive(),
  name: LocalizedTextSchema,
  description: LocalizedTextSchema,
  weight: z.number().positive().max(100),
  topics: z.array(GuideTopicSchema).min(1),
})

export const StudyPathStepSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: LocalizedTextSchema,
  description: LocalizedTextSchema,
  domainIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
  url: z.string().url(),
})

export const CertificationGuideResponseSchema = z.object({
  certification: CertificationCatalogItemSchema,
  version: z.number().int().positive(),
  domains: z.array(GuideDomainSchema).min(1),
  studyPath: z.array(StudyPathStepSchema).min(1),
  sources: z.array(CertificationSourceSchema).min(1),
  researchSources: z.array(GuideResearchSourceSchema).max(20),
  aiUsage: AiTokenUsageSchema.nullable().optional(),
  freshness: z.object({
    aiRefreshedAt: z.string().datetime(),
    sourceCheckedAt: z.string().datetime().nullable(),
  }),
})

export type Locale = z.infer<typeof LocaleSchema>
export type LocalizedText = z.infer<typeof LocalizedTextSchema>
export type CertificationSource = z.infer<typeof CertificationSourceSchema>
export type GuideResearchSource = z.infer<typeof GuideResearchSourceSchema>
export type CertificationCatalogItem = z.infer<typeof CertificationCatalogItemSchema>
export type GuideTopic = z.infer<typeof GuideTopicSchema>
export type GuideDomain = z.infer<typeof GuideDomainSchema>
export type StudyPathStep = z.infer<typeof StudyPathStepSchema>
export type CertificationGuideResponse = z.infer<typeof CertificationGuideResponseSchema>
