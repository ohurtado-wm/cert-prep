import { createOpenAI } from '@ai-sdk/openai'
import { ApiException } from '../errors'

export const defaultAiModel = 'gpt-6-luna'

type AiEnvironment = Record<string, string | undefined>

export function createAiModel(environment: AiEnvironment = process.env) {
  const provider = environment.AI_PROVIDER?.trim() || 'openai'
  if (provider !== 'openai') {
    throw new ApiException(503, 'AI_PROVIDER_UNSUPPORTED', 'The configured AI provider is unavailable.')
  }

  const modelName = environment.AI_MODEL?.trim()
  const apiKey = environment.OPENAI_API_KEY?.trim()
  if (!modelName || !apiKey) {
    throw new ApiException(503, 'AI_NOT_CONFIGURED', 'Configure AI_MODEL and OPENAI_API_KEY to enable AI generation.')
  }

  return createOpenAI({ apiKey })(modelName)
}
