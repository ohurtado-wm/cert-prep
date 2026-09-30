import { generateText, Output } from 'ai'
import { z } from 'zod'
import type { CertificationCatalogItem } from '../../src/api/certification-contracts'
import { ApiException } from '../errors'
import { createAiModel } from '../ai/model-provider'

const LocalizedText = z.object({ en: z.string().min(1), es: z.string().min(1) })

export const GuideDraftSchema = z.object({
  domains: z.array(z.object({
    sectionNumber: z.number().int().positive(),
    weight: z.number().int().positive().max(100),
    name: LocalizedText,
    description: LocalizedText,
    topics: z.array(z.object({
      name: LocalizedText,
      description: LocalizedText,
    })).min(1).max(40),
  })).min(1).max(12),
  studyPath: z.array(z.object({
    title: LocalizedText,
    description: LocalizedText,
    domainIds: z.array(z.string().min(1)).min(1),
  })).min(3).max(6),
})

export type GuideDraft = z.infer<typeof GuideDraftSchema>
export type GuideGenerator = (input: { certification: CertificationCatalogItem }) => Promise<GuideDraft>

function buildPrompt(certification: CertificationCatalogItem) {
  return [
    `Prepare the bilingual study guide for ${certification.name.en}.`,
    'Use the current official Google Cloud certification exam guide for this certification as your primary reference.',
    'Use your available knowledge to identify the exam domains, their approximate weights, and practical topics. Do not claim to have accessed live sources.',
    'Return each domain once with a positive integer weight; all domain weights must total exactly 100.',
    'Write names and descriptions in both English and Spanish. Include 1 to 40 practical topics in each domain.',
    'Use the official exam section number for sectionNumber and stable section-N IDs for domain references.',
    'Create a concise study path of 3 to 6 ordered steps, using only domain IDs in the form section-N. Do not include URLs.',
  ].join('\n\n')
}

export function createAiGuideGenerator(modelName = process.env.AI_MODEL): GuideGenerator {
  return async ({ certification }) => {
    try {
      const result = await generateText({
        model: createAiModel({ ...process.env, AI_MODEL: modelName }),
        output: Output.object({ schema: GuideDraftSchema }),
        prompt: buildPrompt(certification),
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
