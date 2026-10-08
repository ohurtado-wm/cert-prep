import { ApiException } from '../errors'

export type AiGenerationFlow = 'guide' | 'questions' | 'studyPlan'

const outputTokenEnvironmentKeys: Record<AiGenerationFlow, string> = {
  guide: 'AI_GUIDE_MAX_OUTPUT_TOKENS',
  questions: 'AI_QUESTION_MAX_OUTPUT_TOKENS',
  studyPlan: 'AI_STUDY_PLAN_MAX_OUTPUT_TOKENS',
}

export function readAiMaxOutputTokens(
  flow: AiGenerationFlow,
  environment: Record<string, string | undefined> = process.env,
) {
  const key = outputTokenEnvironmentKeys[flow]
  const value = environment[key]?.trim()
  const tokenLimit = Number(value)

  if (!value || !/^\d+$/.test(value) || !Number.isSafeInteger(tokenLimit) || tokenLimit < 1) {
    throw new ApiException(503, 'AI_OUTPUT_TOKENS_INVALID', `${key} must be configured as a positive integer.`)
  }

  return tokenLimit
}
