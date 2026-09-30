import { generateText, Output } from 'ai'
import { z } from 'zod'
import { LocaleSchema, type CertificationGuideResponse, type Locale } from '../../src/api/certification-contracts'
import { createAiModel } from '../ai/model-provider'
import { ApiException } from '../errors'

const GeneratedQuestionSchema = z.object({
  domainId: z.string().min(1),
  topicId: z.string().min(1),
  focus: z.string().min(1),
  service: z.string().min(1),
  question: z.string().min(1),
  answers: z.array(z.string().min(1)),
  correctAnswerIndex: z.number().int(),
  explanation: z.string().min(1),
})

export const GeneratedQuestionSetSchema = z.object({
  language: LocaleSchema,
  questions: z.array(GeneratedQuestionSchema),
})

export type GeneratedQuestion = z.infer<typeof GeneratedQuestionSchema>
export type GeneratedQuestionSet = z.infer<typeof GeneratedQuestionSetSchema>

export type QuestionGeneratorInput = {
  guide: CertificationGuideResponse
  language: Locale
  requiredQuestionsByDomain: Record<string, number>
  validationFeedback?: string
}

export type QuestionGenerator = (input: QuestionGeneratorInput) => Promise<unknown>

export type GenerationMetric = {
  operation: 'simulation_questions'
  provider: 'openai'
  model: string
  certificationId: string
  attempt: number
  durationMs: number
  inputTokens: number | null
  outputTokens: number | null
  outcome: 'success' | 'failure'
}

export type GenerationMetricsReporter = (metric: GenerationMetric) => void

function buildPrompt(input: QuestionGeneratorInput) {
  const isSpanish = input.language === 'es'
  const domainRequirements = input.guide.domains.map((domain) => ({
    id: domain.id,
    name: domain.name[input.language],
    description: domain.description[input.language],
    weight: domain.weight,
    requiredQuestions: input.requiredQuestionsByDomain[domain.id] ?? 0,
    topics: domain.topics.map((topic) => ({
      id: topic.id,
      name: topic.name[input.language],
      description: topic.description[input.language],
    })),
  }))
  const instructions = isSpanish
    ? [
      'Genera 20 preguntas originales de práctica para la certificación cloud indicada. No reproduzcas preguntas oficiales ni las presentes como preguntas reales del examen.',
      'Escribe todos los textos para el estudiante en español: enfoque, servicio, enunciado, opciones y explicación.',
      'Usa escenarios prácticos de desarrollo, operación y arquitectura de aplicaciones cloud; crea distractores plausibles y exactamente una opción correcta.',
      'Toma como referencia principal la guía oficial vigente de Google Cloud para esta certificación y respeta los dominios y temas proporcionados.',
      'Respeta exactamente la cantidad solicitada por dominio. Cada tema y dominio debe usar sus IDs estables proporcionados.',
      'Cada pregunta debe evaluar un solo objetivo, tener cuatro opciones distintas y una explicación breve de la opción correcta.',
      'No incluyas enlaces ni afirmes haber consultado fuentes en tiempo real.',
    ]
    : [
      'Generate 20 original practice questions for the specified cloud certification. Do not reproduce official questions or present these as real exam questions.',
      'Write all student-facing text in English: focus, service, question, options, and explanation.',
      'Use practical cloud application development, operations, and architecture scenarios; create plausible distractors and exactly one correct option.',
      'Use the current official Google Cloud exam guide for this certification as the primary reference and follow the supplied domains and topics.',
      'Follow the exact requested count per domain. Use the supplied stable domain and topic IDs.',
      'Each question should assess one objective, contain four distinct options, and provide a short explanation for the correct option.',
      'Do not include links or claim to have consulted live sources.',
    ]

  return [
    ...instructions,
    `Language code: ${input.language}`,
    `Certification: ${input.guide.certification.name[input.language]} (${input.guide.certification.id})`,
    `Domains and required coverage: ${JSON.stringify(domainRequirements)}`,
    input.validationFeedback
      ? `${isSpanish ? 'Corrige los problemas detectados' : 'Correct the detected issues'}: ${input.validationFeedback}`
      : '',
  ].filter(Boolean).join('\n\n')
}

const defaultReporter: GenerationMetricsReporter = (metric) => {
  console.info(JSON.stringify({ event: 'ai_generation_metric', ...metric }))
}

function reportSafely(reporter: GenerationMetricsReporter, metric: GenerationMetric) {
  try {
    reporter(metric)
  } catch {
    // Observability must not change whether a generated session is usable.
  }
}

export function createAiQuestionGenerator(options: {
  modelName?: string
  reporter?: GenerationMetricsReporter
} = {}): QuestionGenerator {
  const modelName = options.modelName ?? process.env.AI_MODEL ?? ''
  const reporter = options.reporter ?? defaultReporter

  return async (input) => {
    const startedAt = performance.now()
    try {
      const result = await generateText({
        model: createAiModel({ ...process.env, AI_MODEL: modelName }),
        output: Output.object({ schema: GeneratedQuestionSetSchema }),
        prompt: buildPrompt(input),
        maxOutputTokens: 10_000,
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(45_000),
        providerOptions: { openai: { store: false } },
      })
      reportSafely(reporter, {
        operation: 'simulation_questions',
        provider: 'openai',
        model: modelName,
        certificationId: input.guide.certification.id,
        attempt: input.validationFeedback ? 2 : 1,
        durationMs: Math.round(performance.now() - startedAt),
        inputTokens: result.usage.inputTokens ?? null,
        outputTokens: result.usage.outputTokens ?? null,
        outcome: 'success',
      })
      if (!result.output) throw new Error('Structured question output is missing.')
      return result.output
    } catch (error) {
      reportSafely(reporter, {
        operation: 'simulation_questions',
        provider: 'openai',
        model: modelName,
        certificationId: input.guide.certification.id,
        attempt: input.validationFeedback ? 2 : 1,
        durationMs: Math.round(performance.now() - startedAt),
        inputTokens: null,
        outputTokens: null,
        outcome: 'failure',
      })
      if (error instanceof ApiException) throw error
      throw new ApiException(503, 'QUESTION_GENERATION_UNAVAILABLE', 'No se pudieron generar las preguntas. Intenta de nuevo.')
    }
  }
}
