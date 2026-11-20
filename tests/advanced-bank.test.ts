import { describe, expect, test } from 'bun:test'
import type { CertificationGuideResponse } from '@cert-prep/contracts/certification-contracts'
import { certificationCatalog } from '../apps/api/src/catalog/certifications'
import { AdvancedBankError, bankFingerprint, guideFingerprint, loadAdvancedBank, parseBankFile, selectBankQuestions } from '../apps/api/src/simulations/advanced-bank/bank'
import { adaptMappingToGuide } from '../apps/api/src/simulations/advanced-bank/guide-compatibility'
import { allocateQuestionsByTopic, allocateQuestionsByWeight } from '../apps/api/src/simulations/question-validation'

const labels = [
  'Designing highly scalable, available, and reliable cloud-nat',
  'Building and testing applications',
  'Deploying applications',
  'Integrating applications with Google Cloud services',
]
const certification = certificationCatalog.find(({ id }) => id === 'gcp-professional-cloud-developer')!
const guide: CertificationGuideResponse = {
  certification, version: 1,
  domains: labels.map((label, i) => ({ id: `section-${i + 1}`, sourceSectionNumber: i + 1, name: { en: label, es: label }, description: { en: label, es: label }, weight: [32, 23, 24, 21][i]!, topics: [{ id: `topic-${i + 1}`, name: { en: 'Topic', es: 'Tema' }, description: { en: 'Description', es: 'Descripción' } }] })),
  studyPath: [], sources: certification.sources, researchSources: [], freshness: { aiRefreshedAt: '2026-01-01T00:00:00.000Z', sourceCheckedAt: null },
}
const bank = Array.from({ length: 1020 }, (_, index) => ({ id: `bank-${Math.floor(index / 170) + 1}-${index % 170 + 1}`, domain: labels[index % 4]!, question: `Which decision solves fictional scenario ${index + 1}?`, answers: ['Correct', 'Alternative 1', 'Alternative 2', 'Alternative 3'], correctAnswerIndex: 0 }))
const mapping = { reviewed: true, guideFingerprint: guideFingerprint(guide), bankFingerprint: bankFingerprint(bank), questions: Object.fromEntries(bank.map((q) => {
  const domainNumber = labels.indexOf(q.domain) + 1
  return [q.id, { domainId: `section-${domainNumber}`, topicId: `topic-${domainNumber}` }]
})) }
const input = () => ({ bank, mapping, guide, domainCounts: { 'section-1': 6, 'section-2': 5, 'section-3': 5, 'section-4': 4 }, topicCounts: { 'topic-1': 6, 'topic-2': 5, 'topic-3': 5, 'topic-4': 4 }, idFactory: (() => { let id = 0; return () => `q-${++id}` })() })

describe('advanced question bank', () => {
  test('parses the expected markdown format and rejects an inconsistent key', () => {
    const file = Array.from({ length: 170 }, (_, index) => `## Question ${index + 1}\n\n**Domain:** ${labels[0]}\n\n**Question:** Which decision solves fictional scenario ${index + 1}?\n\n**Correct answer:** A. Correct\n\n**Options:**\n\n- **A.** Correct — _correct answer_\n- **B.** Alternative 1\n- **C.** Alternative 2\n- **D.** Alternative 3\n`).join('\n')
    expect(parseBankFile(file, 1)).toHaveLength(170)
    expect(() => parseBankFile(file.replace('**Correct answer:** A. Correct', '**Correct answer:** B. Alternative 1'), 1)).toThrow(AdvancedBankError)
  })
  test('loads 1,020 questions and selects exact quotas without duplicates', () => {
    expect(bank).toHaveLength(1020)
    const selected = selectBankQuestions(input())
    expect(selected).toHaveLength(20)
    expect(new Set(selected.map((question) => question.bankQuestionId)).size).toBe(20)
    for (const [domainId, count] of Object.entries(input().domainCounts)) expect(selected.filter((question) => question.domainId === domainId)).toHaveLength(count)
    expect(selected.every((question) => question.answers.some((answer) => answer.id === question.correctAnswerId))).toBe(true)
  })
  test('rejects unreviewed mapping and changed guide', () => {
    expect(() => selectBankQuestions({ ...input(), mapping: { ...mapping, reviewed: false } })).toThrow(AdvancedBankError)
    expect(() => selectBankQuestions({ ...input(), guide: { ...guide, domains: guide.domains.map((domain, index) => index ? domain : { ...domain, description: { ...domain.description, en: 'Changed' } }) } })).toThrow(AdvancedBankError)
    expect(() => selectBankQuestions({ ...input(), bank: bank.map((question, index) => index ? question : { ...question, question: `${question.question} Changed` }) })).toThrow(AdvancedBankError)
    expect(() => selectBankQuestions({ ...input(), bank: bank.map((question, index) => index ? question : { ...question, correctAnswerIndex: 1 }) })).toThrow(AdvancedBankError)
    expect(bankFingerprint([...bank].reverse())).toBe(mapping.bankFingerprint)
  })
  test('rejects missing or mismatched topic allocations without redistributing', () => {
    expect(() => selectBankQuestions({ ...input(), topicCounts: { 'topic-1': 7, 'topic-2': 4, 'topic-3': 5, 'topic-4': 4 } })).toThrow(AdvancedBankError)
    expect(() => selectBankQuestions({ ...input(), bank: bank.slice(0, -1) })).toThrow(AdvancedBankError)
  })
  test('accepts explicitly corrected source-domain labels without trusting arbitrary labels', () => {
    const question = bank[0]!
    const corrected = { ...mapping, questions: { ...mapping.questions, [question.id]: { domainId: 'section-2', topicId: 'topic-2', sourceDomain: question.domain } } }
    expect(selectBankQuestions({ ...input(), mapping: corrected })).toHaveLength(20)
    expect(() => selectBankQuestions({ ...input(), mapping: { ...corrected, questions: { ...corrected.questions, [question.id]: { domainId: 'section-2', topicId: 'topic-2' } } } })).toThrow(AdvancedBankError)
  })
  test('accepts cosmetic whitespace without a new compatibility check', async () => {
    const changed = { ...guide, domains: guide.domains.map((domain, index) => index ? domain : { ...domain, description: { ...domain.description, en: ` ${domain.description.en}  ` } }) }
    let called = false
    expect(await adaptMappingToGuide(bank, mapping, changed, async () => { called = true; throw new Error('unexpected') })).toBe(mapping)
    expect(called).toBe(false)
  })
  test('adapts equivalent topics and rejects fabricated or incompatible matches', async () => {
    const referenceDomains = guide.domains
    const original = { ...mapping, referenceDomains }
    const changed = { ...guide, domains: guide.domains.map((domain) => ({ ...domain, description: { ...domain.description, en: `${domain.description.en} revised` }, topics: domain.topics.map((topic) => ({ ...topic, id: `${topic.id}-new`, name: { ...topic.name, en: 'Rephrased topic' } })) })) }
    const response = { domains: guide.domains.map(({ id }) => ({ id, compatible: true })), topics: guide.domains.flatMap((domain) => domain.topics.map(({ id }) => ({ sourceTopicId: id, targetTopicId: `${id}-new` }))) }
    const adapted = await adaptMappingToGuide(bank, original, changed, async (reference, current) => {
      expect(JSON.stringify({ reference, current })).not.toContain('fictional scenario')
      return response
    })
    const topicCounts = Object.fromEntries(Object.entries(input().topicCounts).map(([id, count]) => [`${id}-new`, count]))
    expect(selectBankQuestions({ ...input(), mapping: adapted, guide: changed, topicCounts })).toHaveLength(20)
    const bad = { ...response, topics: response.topics.map((topic, index) => index ? topic : { ...topic, targetTopicId: 'topic-2-new' }) }
    await expect(adaptMappingToGuide(bank, original, changed, async () => bad)).rejects.toThrow(AdvancedBankError)
    await expect(adaptMappingToGuide(bank, original, changed, async () => ({ ...response, domains: response.domains.map((domain, index) => index ? domain : { ...domain, compatible: false }) }))).rejects.toThrow(AdvancedBankError)
    const unavailable = { ...response, topics: response.topics.map((topic, index) => index ? topic : { ...topic, targetTopicId: null }) }
    const partial = await adaptMappingToGuide(bank, original, changed, async () => unavailable)
    expect(() => selectBankQuestions({ ...input(), mapping: partial, guide: changed, topicCounts })).toThrow(AdvancedBankError)
  })
  test('keeps the corrected bank aligned with the reference guide and exact quotas', async () => {
    const actual = await loadAdvancedBank()
    expect(actual.mapping.questions['bank-4-140']).toMatchObject({ domainId: 'section-1', topicId: 'topic-1-3' })
    expect(actual.mapping.questions['bank-1-160']).toMatchObject({ domainId: 'section-4', topicId: 'topic-4-4' })
    const messageQuestions = actual.bank.filter(({ id }) => actual.mapping.questions[id]?.topicId === 'topic-4-2')
    expect(messageQuestions.map(({ id }) => id)).toEqual(['bank-5-47'])
    expect(messageQuestions[0]!.answers[messageQuestions[0]!.correctAnswerIndex]).toContain('Pub/Sub')
    const reference = actual.mapping.referenceDomains!
    const realGuide: CertificationGuideResponse = { ...guide, domains: reference.map((domain, index) => ({ ...domain, sourceSectionNumber: index + 1, weight: [32, 23, 24, 21][index]! })) }
    const domainCounts = allocateQuestionsByWeight(realGuide.domains)
    const ids = realGuide.domains.flatMap((domain) => domain.topics.map((topic) => topic.id))
    for (const favored of ids) {
      const exposure = Object.fromEntries(ids.map((id) => [id, { correct: 0, total: id === favored ? 0 : 100 }]))
      const topicCounts = allocateQuestionsByTopic(realGuide.domains, domainCounts, [exposure])
      let count = 0
      const selected = selectBankQuestions({ ...actual, guide: realGuide, domainCounts, topicCounts, idFactory: () => `q-${++count}` })
      expect(selected).toHaveLength(20)
      expect(selected.filter((question) => question.topicId === 'topic-4-2').map((question) => question.bankQuestionId)).toEqual(['bank-5-47'])
    }
    const unsupportedCounts = { ...domainCounts, 'section-4': domainCounts['section-4']! + 1, 'section-1': domainCounts['section-1']! - 1 }
    const unsupportedTopics = allocateQuestionsByTopic(realGuide.domains, unsupportedCounts, [{ 'topic-4-1': { correct: 0, total: 10 }, 'topic-4-3': { correct: 0, total: 10 }, 'topic-4-4': { correct: 0, total: 10 } }])
    expect(unsupportedTopics['topic-4-2']).toBe(2)
    expect(() => selectBankQuestions({ ...actual, guide: realGuide, domainCounts: unsupportedCounts, topicCounts: unsupportedTopics, idFactory: () => 'unused' })).toThrow(AdvancedBankError)
  })
})
