import { randomInt } from 'node:crypto'
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
    || domains.some((domain) => !Number.isFinite(domain.weight) || domain.weight <= 0)
    || Math.abs(domains.reduce((sum, domain) => sum + domain.weight, 0) - 100) > 0.000001) {
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

export function allocateQuestionsByTopic(
  domains: CertificationGuideResponse['domains'],
  requiredQuestionsByDomain: Record<string, number>,
  recentTopicBreakdowns: Array<Record<string, { correct: number; total: number }>> = [],
) {
  const domainIds = new Set<string>()
  const topicIds = new Set<string>()
  const topicExposure = new Map<string, number>()
  let questionCount = 0

  if (domains.length === 0) throw new InvalidQuestionSetError('Question allocation requires at least one domain.')

  for (const domain of domains) {
    if (domainIds.has(domain.id)) throw new InvalidQuestionSetError('Question allocation contains a repeated domain.')
    domainIds.add(domain.id)
    const requiredCount = requiredQuestionsByDomain[domain.id]
    if (!Number.isInteger(requiredCount) || requiredCount < 0) {
      throw new InvalidQuestionSetError('Question allocation has an invalid domain count.')
    }
    questionCount += requiredCount
    if (requiredCount > 0 && domain.topics.length === 0) {
      throw new InvalidQuestionSetError('A question-bearing domain has no topics.')
    }
    for (const topic of domain.topics) {
      if (topicIds.has(topic.id)) throw new InvalidQuestionSetError('Question allocation contains a repeated topic.')
      topicIds.add(topic.id)
      topicExposure.set(topic.id, 0)
    }
  }

  if (Object.keys(requiredQuestionsByDomain).length !== domainIds.size
    || questionCount !== 20
    || [...domainIds].some((domainId) => !Object.hasOwn(requiredQuestionsByDomain, domainId))) {
    throw new InvalidQuestionSetError('Question allocation does not cover the expected domains and total.')
  }

  for (const topicBreakdown of recentTopicBreakdowns) {
    for (const [topicId, counts] of Object.entries(topicBreakdown)) {
      if (!topicExposure.has(topicId)) continue
      if (!Number.isInteger(counts.total) || counts.total < 0) {
        throw new InvalidQuestionSetError('Recent topic history contains an invalid count.')
      }
      topicExposure.set(topicId, topicExposure.get(topicId)! + counts.total)
    }
  }

  const allocation: Record<string, number> = Object.fromEntries([...topicIds].map((topicId) => [topicId, 0]))
  for (const domain of domains) {
    const topics = domain.topics
    const requiredCount = requiredQuestionsByDomain[domain.id]!
    if (topics.length === 0) continue
    const questionsPerTopic = Math.floor(requiredCount / topics.length)
    const remainder = requiredCount % topics.length
    for (const topic of topics) allocation[topic.id] = questionsPerTopic

    const leastCoveredTopics = [...topics].sort((left, right) => {
      const exposureDifference = topicExposure.get(left.id)! - topicExposure.get(right.id)!
      if (exposureDifference !== 0) return exposureDifference
      return left.id < right.id ? -1 : left.id > right.id ? 1 : 0
    })
    for (const topic of leastCoveredTopics.slice(0, remainder)) allocation[topic.id]! += 1
  }

  return allocation
}

function normalizeText(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
}

function parseGeneratedSet(value: unknown): GeneratedQuestionSet {
  const parsed = GeneratedQuestionSetSchema.safeParse(value)
  if (!parsed.success) throw new InvalidQuestionSetError('The model output does not match the question schema.')
  return parsed.data
}

function shuffle<T>(items: T[]) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1)
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex]!, shuffled[index]!]
  }
  return shuffled
}

function balancedCorrectAnswerPositions() {
  return shuffle(Array.from({ length: 20 }, (_, index) => index % 4))
}

export function validateGeneratedQuestions(input: {
  value: unknown
  guide: CertificationGuideResponse
  language: Locale
  requiredQuestionsByDomain: Record<string, number>
  requiredQuestionsByTopic: Record<string, number>
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
  const validTopicIds = new Set(input.guide.domains.flatMap((domain) => domain.topics.map((topic) => topic.id)))
  const questionStems = new Set<string>()
  const coverage = new Map<string, number>()
  const topicCoverage = new Map<string, number>()
  const usedQuestionIds = new Set<string>()
  const correctAnswerPositions = balancedCorrectAnswerPositions()

  const questions = generated.questions.map((question: GeneratedQuestion, questionIndex): StoredSimulationQuestion => {
    const domain = domainsById.get(question.domainId)
    if (!domain || !domain.topics.some((topic) => topic.id === question.topicId)) {
      throw new InvalidQuestionSetError('A question uses a topic outside its official domain.')
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
    topicCoverage.set(question.topicId, (topicCoverage.get(question.topicId) ?? 0) + 1)
    const correctAnswer = question.answers[question.correctAnswerIndex]!.trim()
    const distractors = shuffle(question.answers
      .filter((_answer, index) => index !== question.correctAnswerIndex)
      .map((answer) => answer.trim()))
    const correctAnswerPosition = correctAnswerPositions[questionIndex]!
    distractors.splice(correctAnswerPosition, 0, correctAnswer)
    const answers: SimulationAnswerOption[] = distractors.map((text, index) => ({
      id: `${id}:option-${index + 1}`,
      text,
    }))

    return {
      id,
      domainId: domain.id,
      topicId: question.topicId,
      focus: question.focus.trim(),
      service: question.service.trim(),
      question: question.question.trim(),
      answers,
      correctAnswerId: answers[correctAnswerPosition]!.id,
      explanation: question.explanation.trim(),
      attempts: 0,
      outcome: 'pending',
    }
  })

  if (Object.keys(input.requiredQuestionsByDomain).length !== domainsById.size
    || input.guide.domains.some((domain) => (
      !Object.hasOwn(input.requiredQuestionsByDomain, domain.id)
      || !Number.isInteger(input.requiredQuestionsByDomain[domain.id])
      || (coverage.get(domain.id) ?? 0) !== input.requiredQuestionsByDomain[domain.id]
    ))) {
    throw new InvalidQuestionSetError('Question coverage does not match the certification domain weights.')
  }
  const topicQuotas = input.requiredQuestionsByTopic
  if (Object.keys(topicQuotas).length !== validTopicIds.size
    || [...validTopicIds].some((topicId) => (
      !Object.hasOwn(topicQuotas, topicId)
      || !Number.isInteger(topicQuotas[topicId])
      || topicQuotas[topicId]! < 0
      || (topicCoverage.get(topicId) ?? 0) !== topicQuotas[topicId]
    ))) {
    throw new InvalidQuestionSetError('Question coverage does not match the topic requirements.')
  }
  for (const domain of input.guide.domains) {
    const domainTopicTotal = domain.topics.reduce((sum, topic) => sum + topicQuotas[topic.id]!, 0)
    if (domainTopicTotal !== input.requiredQuestionsByDomain[domain.id]) {
      throw new InvalidQuestionSetError('Topic requirements do not match the domain question counts.')
    }
  }
  return questions
}
