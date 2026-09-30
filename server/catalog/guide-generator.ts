import { generateText, Output } from 'ai'
import { z } from 'zod'
import type { CertificationCatalogItem } from '../../src/api/certification-contracts'
import { ApiException } from '../errors'
import { createAiModel } from '../ai/model-provider'
import type { CachedOfficialSources } from './source-types'

const LocalizedText = z.object({ en: z.string().min(1), es: z.string().min(1) })

export const GuideDraftSchema = z.object({
  domains: z.array(z.object({
    sectionNumber: z.number().int().positive(),
    name: LocalizedText,
    description: LocalizedText,
    topics: z.array(z.object({
      sourceTopicId: z.string().min(1),
      name: LocalizedText,
      description: LocalizedText,
    })).max(40),
  })).min(1).max(12),
  studyPath: z.array(z.object({
    title: LocalizedText,
    description: LocalizedText,
    domainIds: z.array(z.string().min(1)).min(1),
    url: z.string().url(),
  })).min(3).max(6),
})

export type GuideDraft = z.infer<typeof GuideDraftSchema>
export type GuideGenerator = (input: {
  certification: CertificationCatalogItem
  sources: CachedOfficialSources
}) => Promise<GuideDraft>

function buildPrompt(certification: CertificationCatalogItem, sources: CachedOfficialSources) {
  const allowedUrls = certification.sources.map((source) => source.url)
  return [
    `Prepare the bilingual study guide for ${certification.name.en}.`,
    'Use only the official-source data below. Do not add exam domains or weights that are not present in the exam guide.',
    'Return every exam guide section exactly once, preserving its section number and all source topic IDs exactly once.',
    'Write names and descriptions in both English and Spanish. Keep stable IDs language-independent.',
    'Create a concise study path of 3 to 6 ordered steps. Every domain ID must be section-N for a source section.',
    `Every studyPath.url must be exactly one of these official URLs: ${JSON.stringify(allowedUrls)}`,
    `Official exam-guide sections: ${JSON.stringify(sources.examGuide.sections)}`,
    `Official learning-path activities: ${JSON.stringify(sources.learningPath.activities)}`,
  ].join('\n\n')
}

export function createAiGuideGenerator(modelName = process.env.AI_MODEL): GuideGenerator {
  return async ({ certification, sources }) => {
    try {
      const result = await generateText({
        model: createAiModel({ ...process.env, AI_MODEL: modelName }),
        output: Output.object({ schema: GuideDraftSchema }),
        prompt: buildPrompt(certification, sources),
        maxOutputTokens: 6_000,
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(60_000),
      })
      if (!result.output) throw new Error('The model returned no structured guide.')
      return result.output
    } catch (error) {
      if (error instanceof ApiException) throw error
      throw new ApiException(503, 'GUIDE_AI_UNAVAILABLE', 'No se pudo renovar la guía con IA. Intenta de nuevo.')
    }
  }
}
