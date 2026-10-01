import { generateText, Output } from 'ai'
import { z } from 'zod'
import type { AiTokenUsage } from '../../src/api/ai-usage-contracts'
import { LocaleSchema, type Locale } from '../../src/api/certification-contracts'
import { ApiException } from '../errors'
import { createAiModel } from '../ai/model-provider'
import type { StudyPlanFocus, StudyPlanTarget } from './analytics'

export const StudyPlanDraftSchema = z.object({
  language: LocaleSchema,
  summary: z.string().min(1).max(500),
  recommendations: z.array(z.object({
    targetId: z.string().min(1),
    title: z.string().min(1).max(120),
    rationale: z.string().min(1).max(400),
    actions: z.array(z.string().min(1).max(240)).min(1).max(5),
    resourceStepId: z.string().min(1),
  })).min(1).max(5),
})

export type StudyPlanPromptInput = {
  language: Locale
  certificationName: string
  sessionCount: number
  domains: Array<{ id: string; label: string; correct: number; total: number; incorrect: number; accuracy: number }>
  targets: StudyPlanTarget[]
  failedFocuses: StudyPlanFocus[]
  studyPath: Array<{ id: string; title: string }>
}

export type StudyPlanDraft = z.infer<typeof StudyPlanDraftSchema>
export type StudyPlanGenerator = (input: StudyPlanPromptInput) => Promise<StudyPlanDraft | {
  output: StudyPlanDraft
  usage: AiTokenUsage
}>

function buildPrompt(input: StudyPlanPromptInput) {
  return [
    'Create an actionable certification study plan from the supplied, already aggregated performance data.',
    'Use the requested language for every sentence. Return exactly one recommendation for every target, in the same order, and copy each targetId exactly.',
    'The application calculates priorities and displays the exact metrics. Do not include numbers, percentages, performance measurements, pass/fail labels, or claims about exam readiness in generated prose.',
    'Write concise, specific study actions. Each resourceStepId must be copied from the supplied official study-path steps. Never create a URL or name an outside resource.',
    'Failed focus labels are limited context for the recommendations. Do not reconstruct questions or infer personal information.',
    JSON.stringify(input),
  ].join('\n\n')
}

export function createAiStudyPlanGenerator(): StudyPlanGenerator {
  return async (input) => {
    try {
      const result = await generateText({
        model: createAiModel(),
        output: Output.object({ schema: StudyPlanDraftSchema }),
        prompt: buildPrompt(input),
        maxOutputTokens: 3_000,
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(60_000),
        providerOptions: { openai: { store: false } },
      })
      if (!result.output) throw new Error('The model returned no structured study plan.')
      const inputTokens = result.usage.inputTokens ?? null
      const outputTokens = result.usage.outputTokens ?? null
      return {
        output: result.output,
        usage: {
          inputTokens,
          outputTokens,
          totalTokens: result.usage.totalTokens ?? (inputTokens !== null && outputTokens !== null ? inputTokens + outputTokens : null),
        },
      }
    } catch (error) {
      if (error instanceof ApiException) throw error
      throw new ApiException(503, 'STUDY_PLAN_AI_UNAVAILABLE', 'No se pudo generar el plan con IA. Intenta de nuevo.')
    }
  }
}
