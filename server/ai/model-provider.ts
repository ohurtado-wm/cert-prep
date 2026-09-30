import { createOpenAI } from '@ai-sdk/openai'
import { ApiException } from '../errors'

export const defaultAiModel = 'gpt-6-luna'

type AiEnvironment = Record<string, string | undefined>

export function createAiModel(environment: AiEnvironment = process.env) {
  const provider = environment.AI_PROVIDER?.trim() || 'openai'
  if (provider !== 'openai') {
    throw new ApiException(503, 'AI_PROVIDER_UNSUPPORTED', 'El proveedor de IA configurado no está disponible.')
  }

  const modelName = environment.AI_MODEL?.trim()
  const apiKey = environment.OPENAI_API_KEY?.trim()
  if (!modelName || !apiKey) {
    throw new ApiException(503, 'AI_NOT_CONFIGURED', 'Configura AI_MODEL y OPENAI_API_KEY para habilitar la generación con IA.')
  }

  return createOpenAI({ apiKey })(modelName)
}
