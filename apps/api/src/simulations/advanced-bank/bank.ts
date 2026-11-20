import { createHash, randomInt } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { z } from 'zod'
import type { CertificationGuideResponse } from '@cert-prep/contracts/certification-contracts'
import type { StoredSimulationQuestion } from '../state'

export class AdvancedBankError extends Error {}

export type BankQuestion = { id: string; domain: string; question: string; answers: string[]; correctAnswerIndex: number }
const localizedSchema = z.object({ en: z.string(), es: z.string() })
export const referenceDomainSchema = z.object({ id: z.string(), name: localizedSchema, description: localizedSchema, topics: z.array(z.object({ id: z.string(), name: localizedSchema, description: localizedSchema })) })
export type ReferenceDomain = z.infer<typeof referenceDomainSchema>
export type ReviewedMapping = { guideFingerprint: string; bankFingerprint: string; reviewed: boolean; referenceDomains?: ReferenceDomain[]; questions: Record<string, { domainId: string; topicId: string | null; sourceDomain?: string }> }
const mappingSchema = z.object({ guideFingerprint: z.string(), bankFingerprint: z.string(), reviewed: z.boolean(), referenceDomains: z.array(referenceDomainSchema).optional(), questions: z.record(z.string(), z.object({ domainId: z.string(), topicId: z.string().nullable(), sourceDomain: z.string().optional() })) })
const domainIds: Record<string, string> = {
  'Designing highly scalable, available, and reliable cloud-nat': 'section-1',
  'Building and testing applications': 'section-2',
  'Deploying applications': 'section-3',
  'Integrating applications with Google Cloud services': 'section-4',
}

const norm = (value: string) => value.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
const normAnswer = (value: string) => value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim()
const removeCorrectMarker = (value: string) => value.replace(/\s*[—-]\s*_correct answer_\s*$/i, '').trim()

export function parseBankFile(contents: string, fileNumber: number): BankQuestion[] {
  const pieces = contents.split(/^## Question (\d+)\s*$/m)
  if (pieces.length !== 341) throw new AdvancedBankError(`Invalid question count in bank file ${fileNumber}`)
  const questions: BankQuestion[] = []
  for (let i = 1; i < pieces.length; i += 2) {
    const number = Number(pieces[i])
    const body = pieces[i + 1] ?? ''
    if (number !== (i + 1) / 2) throw new AdvancedBankError(`Invalid numbering in bank file ${fileNumber}`)
    const domain = [...body.matchAll(/^\*\*Domain:\*\*\s*(.+)$/gm)]
    const question = [...body.matchAll(/^\*\*Question:\*\*\s*(.+)$/gm)]
    const correct = [...body.matchAll(/^\*\*Correct answer:\*\*\s*([A-D])\.\s*(.+)$/gm)]
    const options = [...body.matchAll(/^- \*\*([A-D])\.\*\*\s*(.+)$/gm)]
    if (domain.length !== 1 || question.length !== 1 || correct.length !== 1 || options.length !== 4
      || options.map((option) => option[1]).join('') !== 'ABCD') throw new AdvancedBankError(`Invalid question in bank file ${fileNumber}, item ${number}`)
    const correctIndex = 'ABCD'.indexOf(correct[0]![1]!)
    const answers = options.map((option) => removeCorrectMarker(option[2]!))
    const marked = options.flatMap((option, index) => /_correct answer_\s*$/i.test(option[2]!) ? [index] : [])
    if (correctIndex < 0 || marked.length !== 1 || marked[0] !== correctIndex
      || answers[correctIndex] !== correct[0]![2]!.trim() || answers.some((answer) => !norm(answer))
      || new Set(answers.map(normAnswer)).size !== 4 || norm(question[0]![1]!).length < 20) {
      throw new AdvancedBankError(`Invalid answers in bank file ${fileNumber}, item ${number}`)
    }
    questions.push({ id: `bank-${fileNumber}-${number}`, domain: domain[0]![1]!.trim(), question: question[0]![1]!.trim(), answers, correctAnswerIndex: correctIndex })
  }
  return questions
}

export function guideFingerprint(guide: Pick<CertificationGuideResponse, 'domains'> | { domains: ReferenceDomain[] }): string {
  const normalize = (value: string) => value.normalize('NFKC').trim().replace(/\s+/g, ' ')
  const localize = (value: { en: string; es: string }) => ({ en: normalize(value.en), es: normalize(value.es) })
  const domains = guide.domains.map(({ id, name, description, topics }) => ({ id, name: localize(name), description: localize(description), topics: topics.map((topic) => ({ id: topic.id, name: localize(topic.name), description: localize(topic.description) })) }))
  return createHash('sha256').update(JSON.stringify(domains)).digest('hex')
}

export function bankFingerprint(bank: BankQuestion[]): string {
  const entries = bank.map(({ id, domain, question, answers, correctAnswerIndex }) => ({ id, domain, question, answers, correctAnswerIndex }))
    .sort((a, b) => a.id.localeCompare(b.id, 'en'))
  return createHash('sha256').update(JSON.stringify(entries)).digest('hex')
}

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}

export function selectBankQuestions(input: {
  bank: BankQuestion[]; mapping: ReviewedMapping; guide: CertificationGuideResponse
  domainCounts: Record<string, number>; topicCounts: Record<string, number>; idFactory: () => string
}): StoredSimulationQuestion[] {
  const { bank, mapping, guide, domainCounts, topicCounts } = input
  if (!mapping.reviewed || mapping.guideFingerprint !== guideFingerprint(guide) || mapping.bankFingerprint !== bankFingerprint(bank)) throw new AdvancedBankError('Bank mapping has not been reviewed for the current guide and bank')
  if (bank.length !== 1020 || Object.keys(mapping.questions).length !== bank.length
    || new Set(bank.map(({ id }) => id)).size !== bank.length || new Set(bank.map(({ question }) => norm(question))).size !== bank.length) throw new AdvancedBankError('Bank or mapping is incomplete or duplicated')
  const pools = new Map<string, BankQuestion[]>()
  const guideTopics = guide.domains.flatMap((domain) => domain.topics.map((topic) => topic.id))
  if (Object.keys(domainCounts).length !== guide.domains.length || Object.keys(topicCounts).length !== guideTopics.length
    || guide.domains.some(({ id }) => !Object.hasOwn(domainCounts, id)) || guideTopics.some((id) => !Object.hasOwn(topicCounts, id))) throw new AdvancedBankError('Bank quotas do not match the current guide')
  for (const question of bank) {
    const item = mapping.questions[question.id]
    const domain = guide.domains.find(({ id }) => id === item?.domainId)
    if (!item || !domain || (domainIds[question.domain] !== domain.id && item.sourceDomain !== question.domain)
      || (item.sourceDomain !== undefined && item.sourceDomain !== question.domain)) throw new AdvancedBankError('Bank mapping does not match the current guide')
    if (item.topicId === null) continue
    if (!domain.topics.some(({ id }) => id === item.topicId)) throw new AdvancedBankError('Bank mapping does not match the current guide')
    const pool = pools.get(item!.topicId) ?? []
    pool.push(question)
    pools.set(item!.topicId, pool)
  }
  const selected: Array<{ question: BankQuestion; domainId: string; topicId: string }> = []
  for (const domain of guide.domains) {
    if (domain.topics.reduce((sum, topic) => sum + (topicCounts[topic.id] ?? -1000), 0) !== domainCounts[domain.id]) throw new AdvancedBankError('Topic quotas do not match domain quotas')
    for (const topic of domain.topics) {
      const count = topicCounts[topic.id]
      const pool = pools.get(topic.id) ?? []
      if (!Number.isInteger(count) || count! < 0 || pool.length < count!) throw new AdvancedBankError('Not enough reviewed questions for a topic')
      for (const question of shuffle(pool).slice(0, count)) selected.push({ question, domainId: domain.id, topicId: topic.id })
    }
  }
  if (selected.length !== 20) throw new AdvancedBankError('Bank selection must contain 20 questions')
  const positions = shuffle(Array.from({ length: 20 }, (_, index) => index % 4))
  const ids = new Set<string>()
  return shuffle(selected).map(({ question, domainId, topicId }, index) => {
    const id = input.idFactory()
    if (!id || ids.has(id)) throw new AdvancedBankError('Question identifiers must be unique')
    ids.add(id)
    const correct = question.answers[question.correctAnswerIndex]!
    const distractors = shuffle(question.answers.filter((_, answerIndex) => answerIndex !== question.correctAnswerIndex))
    const position = positions[index]!
    distractors.splice(position, 0, correct)
    const answers = distractors.map((text, answerIndex) => ({ id: `${id}:option-${answerIndex + 1}`, text }))
    return { id, bankQuestionId: question.id, domainId, topicId, question: question.question, answers, correctAnswerId: answers[position]!.id, attempts: 0, outcome: 'pending' }
  })
}

export async function loadAdvancedBank(): Promise<{ bank: BankQuestion[]; mapping: ReviewedMapping }> {
  const relative = 'apps/api/src/simulations/advanced-bank'
  const bases = [resolve(process.cwd(), relative), resolve(process.cwd(), '../..', relative)]
  for (const base of bases) {
    try {
      const files = await Promise.all(Array.from({ length: 6 }, (_, i) => readFile(resolve(base, 'data', `gcp-professional-cloud-developer-quiz-test #${i + 1}.md`), 'utf8')))
      const mapping = mappingSchema.parse(JSON.parse(await readFile(resolve(base, 'mapping.json'), 'utf8')))
      return { bank: files.flatMap((text, i) => parseBankFile(text, i + 1)), mapping }
    } catch (error) {
      if (error instanceof AdvancedBankError) throw error
    }
  }
  throw new AdvancedBankError('Bank or reviewed mapping is unavailable')
}
