import type { CertificationGuideResponse, Locale } from '../../src/api/certification-contracts'
import { type SimulationAnswerOption } from '../../src/api/simulation-contracts'
import { GeneratedQuestionSetSchema, type GeneratedQuestion, type GeneratedQuestionSet } from './question-generator'
import type { StoredSimulationQuestion } from './state'

export class InvalidQuestionSetError extends Error {
  readonly code = 'INVALID_QUESTION_SET'
}

export function allocateQuestionsByWeight(domains: CertificationGuideResponse['domains'], total = 20) {
  if (domains.length === 0 || domains.length > total
    || new Set(domains.map((domain) => domain.id)).size !== domains.length
    || domains.some((domain) => !Number.isInteger(domain.weight) || domain.weight <= 0)
    || domains.reduce((sum, domain) => sum + domain.weight, 0) !== 100) {
    throw new InvalidQuestionSetError('The guide has invalid domain weights.')
  }

  const allocations = domains.map((domain, order) => {
    const exact = total * domain.weight / 100
    return { id: domain.id, count: Math.floor(exact), remainder: exact - Math.floor(exact), order }
  })
  let remaining = total - allocations.reduce((sum, item) => sum + item.count, 0)
  for (const item of [...allocations].sort((left, right) => right.remainder - left.remainder || left.order - right.order)) {
    if (remaining === 0) break
    item.count += 1
    remaining -= 1
  }
  return Object.fromEntries(allocations.map(({ id, count }) => [id, count]))
}

function normalizeText(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
}

function parseGeneratedSet(value: unknown): GeneratedQuestionSet {
  const parsed = GeneratedQuestionSetSchema.safeParse(value)
  if (!parsed.success) throw new InvalidQuestionSetError('The model output does not match the question schema.')
  return parsed.data
}

export function validateGeneratedQuestions(input: {
  value: unknown
  guide: CertificationGuideResponse
  language: Locale
  requiredQuestionsByDomain: Record<string, number>
  idFactory: () => string
}): StoredSimulationQuestion[] {
  const generated = parseGeneratedSet(input.value)
  if (generated.language !== input.language) {
    throw new InvalidQuestionSetError('The generated language does not match the requested language.')
  }
  if (generated.questions.length !== 20) {
    throw new InvalidQuestionSetError('The question set must contain exactly 20 questions.')
  }

  const domainsById = new Map(input.guide.domains.map((domain) => [domain.id, domain]))
  const allowedSourceUrls = new Set(input.guide.sources.map((source) => source.url))
  const questionStems = new Set<string>()
  const coverage = new Map<string, number>()
  const usedQuestionIds = new Set<string>()

  const questions = generated.questions.map((question: GeneratedQuestion): StoredSimulationQuestion => {
    const domain = domainsById.get(question.domainId)
    if (!domain || !domain.topics.some((topic) => topic.id === question.topicId)) {
      throw new InvalidQuestionSetError('A question uses a topic outside its official domain.')
    }
    if (!allowedSourceUrls.has(question.sourceUrl)) {
      throw new InvalidQuestionSetError('A question uses a source that is not in the official guide.')
    }
    if (question.answers.length !== 4 || !Number.isInteger(question.correctAnswerIndex)
      || question.correctAnswerIndex < 0 || question.correctAnswerIndex > 3) {
      throw new InvalidQuestionSetError('Every question must have four answers and one correct answer.')
    }

    const normalizedStem = normalizeText(question.question)
    if (normalizedStem.length < 20 || questionStems.has(normalizedStem)) {
      throw new InvalidQuestionSetError('Question text is too short or duplicated.')
    }
    questionStems.add(normalizedStem)
    const normalizedAnswers = question.answers.map(normalizeText)
    if (normalizedAnswers.some((answer) => answer.length === 0) || new Set(normalizedAnswers).size !== 4) {
      throw new InvalidQuestionSetError('Answer options must be non-empty and distinct.')
    }

    const id = input.idFactory()
    if (!id || usedQuestionIds.has(id)) throw new InvalidQuestionSetError('Generated question IDs must be unique.')
    usedQuestionIds.add(id)
    coverage.set(domain.id, (coverage.get(domain.id) ?? 0) + 1)
    const answers: SimulationAnswerOption[] = question.answers.map((text, index) => ({
      id: `${id}:option-${index + 1}`,
      text: text.trim(),
    }))

    return {
      id,
      domainId: domain.id,
      topicId: question.topicId,
      focus: question.focus.trim(),
      service: question.service.trim(),
      question: question.question.trim(),
      answers,
      correctAnswerId: answers[question.correctAnswerIndex]!.id,
      explanation: question.explanation.trim(),
      sourceUrl: question.sourceUrl,
      attempts: 0,
      outcome: 'pending',
    }
  })

  if (Object.entries(input.requiredQuestionsByDomain).some(([domainId, count]) => (coverage.get(domainId) ?? 0) !== count)) {
    throw new InvalidQuestionSetError('Question coverage does not match the certification domain weights.')
  }
  return questions
}
