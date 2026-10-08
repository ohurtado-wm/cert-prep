import { generateText, Output } from 'ai'
import { z } from 'zod'
import type { AiTokenUsage } from '../../src/api/ai-usage-contracts'
import { LocaleSchema, type CertificationGuideResponse, type Locale } from '../../src/api/certification-contracts'
import { createAiModel } from '../ai/model-provider'
import { readAiMaxOutputTokens } from '../ai/output-token-limits'
import { ApiException } from '../errors'
import { AI_REQUEST_TIMEOUT_MS } from '../ai/request-timeout'

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
  requiredQuestionsByTopic: Record<string, number>
  topicScope: 'all-guide-topics' | 'selected-only'
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

export function buildQuestionGenerationPrompt(input: QuestionGeneratorInput) {
  const isSpanish = input.language === 'es'
  const provider = input.guide.certification.provider === 'google-cloud' ? 'Google Cloud' : 'Microsoft Azure'
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
      requiredQuestions: input.requiredQuestionsByTopic[topic.id] ?? 0,
    })),
  }))
  const topicScopeInstructions = input.topicScope === 'selected-only'
    ? isSpanish
      ? 'Esta es una simulación enfocada. Genera preguntas solo de los temas proporcionados y respeta exactamente la cantidad indicada para cada tema.'
      : 'This is a focused simulation. Generate questions only from the supplied topics and follow the exact requested count for each topic.'
    : isSpanish
      ? 'Esta es una simulación completa. Cubre los temas de la guía con cuota mayor que cero; respeta exactamente cada cuota indicada y no uses temas con cuota cero.'
      : 'This is a full-guide simulation. Cover guide topics with a quota above zero; follow each exact quota and do not use topics with a zero quota.'
  const instructions = isSpanish
    ? [
      `Actúa como diseñador experto de exámenes de certificación técnica de ${provider}. Genera 20 preguntas originales de práctica que reflejen fielmente el formato, la dificultad, el nivel de razonamiento y los tipos de escenarios del examen vigente para la certificación indicada, alineadas con los dominios y temas proporcionados. Usa situaciones realistas que requieran aplicar conocimientos y elegir la mejor opción entre alternativas plausibles.`,
      'Escribe todos los textos para el estudiante en español: enfoque, servicio, enunciado, opciones y explicación.',
      'Usa escenarios prácticos y realistas adecuados al nivel y los dominios de esta certificación; crea distractores plausibles y exactamente una opción correcta.',
      'Haz que las cuatro opciones tengan estructura gramatical, nivel de detalle y longitud comparables. Cada distractor debe ser técnicamente plausible y pertinente al escenario; evita respuestas obviamente absurdas o menos específicas que la correcta.',
      'Varía la posición de la opción correcta y no la pongas siempre primero. correctAnswerIndex debe señalar exactamente la opción correcta.',
      `Usa los dominios, temas y descripciones proporcionados como referencia de alcance; están basados en la guía oficial de examen de ${provider} para esta certificación.`,
      'Respeta exactamente la cantidad solicitada por dominio. Cada tema y dominio debe usar sus IDs estables proporcionados.',
      'Cada pregunta debe evaluar una decisión distinta, tener cuatro opciones distintas y una explicación breve de la opción correcta. Varía el contexto y el servicio cuando el tema lo permita; no repitas el mismo objetivo con otra redacción.',
      'No incluyas enlaces ni afirmes haber consultado fuentes en tiempo real.',
    ]
    : [
      `Act as an expert designer of ${provider} technical certification exams. Generate 20 original practice questions that closely reflect the format, difficulty, reasoning level, and scenario types of the current exam for the specified certification, aligned with the supplied domains and topics. Use realistic situations that require applying knowledge and choosing the best option among plausible alternatives.`,
      'Write all student-facing text in English: focus, service, question, options, and explanation.',
      'Use practical, realistic scenarios appropriate to this certification level and its domains; create plausible distractors and exactly one correct option.',
      'Keep all four options comparable in grammatical structure, level of detail, and length. Each distractor must be technically plausible and relevant to the scenario; avoid obviously absurd or less specific alternatives.',
      'Vary the correct option position instead of always placing it first. correctAnswerIndex must identify the exact correct option.',
      `Use the supplied domains, topics, and descriptions as the scope reference; they are based on the official ${provider} exam guide for this certification.`,
      'Follow the exact requested count per domain. Use the supplied stable domain and topic IDs.',
      'Each question should assess a distinct decision, contain four distinct options, and provide a short explanation for the correct option. Vary scenario context and service where the topic allows; do not repeat an objective with different wording.',
      'Do not include links or claim to have consulted live sources.',
    ]

  return [
    ...instructions,
    topicScopeInstructions,
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
  environment?: Record<string, string | undefined>
  generateText?: typeof generateText
} = {}): QuestionGenerator {
  const environment = options.environment ?? process.env
  const modelName = options.modelName ?? environment.AI_MODEL ?? ''
  const reporter = options.reporter ?? defaultReporter
  const runGenerateText = options.generateText ?? generateText

  return async (input) => {
    const startedAt = performance.now()
    try {
      const result = await runGenerateText({
        model: createAiModel({ ...environment, AI_MODEL: modelName }),
        output: Output.object({ schema: GeneratedQuestionSetSchema }),
        prompt: buildQuestionGenerationPrompt(input),
        maxOutputTokens: readAiMaxOutputTokens('questions', environment),
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS),
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
      const inputTokens = result.usage.inputTokens ?? null
      const outputTokens = result.usage.outputTokens ?? null
      return {
        output: result.output,
        usage: {
          inputTokens,
          outputTokens,
          totalTokens: result.usage.totalTokens ?? (inputTokens !== null && outputTokens !== null ? inputTokens + outputTokens : null),
        } satisfies AiTokenUsage,
      }
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
      throw new ApiException(503, 'QUESTION_GENERATION_UNAVAILABLE', 'Questions could not be generated. Try again.')
    }
  }
}
