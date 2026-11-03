import {
  CertificationCollectionSchema,
  type CertificationQuestion,
  type Certification,
  type CertificationTopic,
} from './certification-schema'
import type { Locale } from '@cert-prep/contracts/certification-contracts'
import { z } from 'zod'

const LocalizedAnswerSchema = z.object({ id: z.string().min(1), text: z.string().min(1) })
const LocalizedQuestionSchema = z.object({
  id: z.string().min(1),
  focus: z.string().min(1),
  service: z.string().min(1),
  question: z.string().min(1),
  answers: z.array(LocalizedAnswerSchema).length(4),
  explanation: z.string().min(1),
})
const LocalizedCertificationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  topics: z.array(z.object({ id: z.string().min(1), name: z.string().min(1) })).length(4),
  questions: z.array(LocalizedQuestionSchema).length(20),
})
const LocalizedCollectionSchema = z.object({ certifications: z.array(LocalizedCertificationSchema).min(1) })

export class QuestionBankLoadError extends Error {
  constructor(readonly code: 'QUESTION_BANK_UNAVAILABLE' | 'QUESTION_BANK_INVALID' | 'QUESTION_TRANSLATION_MISSING') {
    super(code)
  }
}

function parseCollection(value: unknown) {
  const result = CertificationCollectionSchema.safeParse(value)
  if (!result.success) throw new QuestionBankLoadError('QUESTION_BANK_INVALID')
  if (!result.data.certifications.some((item) => item.id === 'gcp-professional-cloud-developer')) {
    throw new QuestionBankLoadError('QUESTION_BANK_INVALID')
  }
  return result.data.certifications
}

function sameIds(actual: string[], expected: string[]) {
  return actual.length === expected.length
    && new Set(actual).size === actual.length
    && expected.every((id) => actual.includes(id))
}

function localizeCertification(certification: Certification, localized: z.infer<typeof LocalizedCertificationSchema>): Certification {
  if (certification.id !== localized.id || !sameIds(localized.topics.map(({ id }) => id), certification.topics.map(({ id }) => id))) {
    throw new QuestionBankLoadError('QUESTION_TRANSLATION_MISSING')
  }

  const topicsById = new Map(localized.topics.map((topic) => [topic.id, topic]))
  const questionsById = new Map(localized.questions.map((question) => [question.id, question]))
  if (!sameIds([...questionsById.keys()], certification.questions.map(({ id }) => id))) {
    throw new QuestionBankLoadError('QUESTION_TRANSLATION_MISSING')
  }

  const topics: CertificationTopic[] = certification.topics.map((topic) => ({
    ...topic,
    name: topicsById.get(topic.id)!.name,
  }))
  const questions: CertificationQuestion[] = certification.questions.map((question) => {
    const copy = questionsById.get(question.id)!
    const answersById = new Map(copy.answers.map((answer) => [answer.id, answer.text]))
    if (!sameIds([...answersById.keys()], question.answers.map(({ id }) => id))) {
      throw new QuestionBankLoadError('QUESTION_TRANSLATION_MISSING')
    }

    return {
      ...question,
      focus: copy.focus,
      service: copy.service,
      question: copy.question,
      explanation: copy.explanation,
      answers: question.answers.map((answer) => ({ ...answer, text: answersById.get(answer.id)! })),
    }
  })

  return { ...certification, name: localized.name, language: 'en', topics, questions }
}

export async function loadCertifications(
  locale: Locale = 'es',
  fetcher: (input: RequestInfo | URL) => Promise<Response> = fetch,
): Promise<Certification[]> {
  let response: Response
  try {
    response = await fetcher('/data/certifications.json')
  } catch {
    throw new QuestionBankLoadError('QUESTION_BANK_UNAVAILABLE')
  }

  if (!response.ok) {
    throw new QuestionBankLoadError('QUESTION_BANK_UNAVAILABLE')
  }

  let source: unknown
  try {
    source = await response.json()
  } catch {
    throw new QuestionBankLoadError('QUESTION_BANK_INVALID')
  }
  const certifications = parseCollection(source)
  if (locale === 'es') return certifications

  let localizedResponse: Response
  try {
    localizedResponse = await fetcher('/data/certifications.en.json')
  } catch {
    throw new QuestionBankLoadError('QUESTION_TRANSLATION_MISSING')
  }
  if (!localizedResponse.ok) throw new QuestionBankLoadError('QUESTION_TRANSLATION_MISSING')

  let localizedValue: unknown
  try {
    localizedValue = await localizedResponse.json()
  } catch {
    throw new QuestionBankLoadError('QUESTION_TRANSLATION_MISSING')
  }
  const localizedResult = LocalizedCollectionSchema.safeParse(localizedValue)
  if (!localizedResult.success
    || !sameIds(localizedResult.data.certifications.map(({ id }) => id), certifications.map(({ id }) => id))) {
    throw new QuestionBankLoadError('QUESTION_TRANSLATION_MISSING')
  }

  const localizedById = new Map(localizedResult.data.certifications.map((item) => [item.id, item]))
  const result = certifications.map((certification) => localizeCertification(certification, localizedById.get(certification.id)!))
  return parseCollection({ certifications: result })
}
