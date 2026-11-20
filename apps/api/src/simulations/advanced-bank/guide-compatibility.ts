import { generateText, Output } from 'ai'
import { z } from 'zod'
import type { CertificationGuideResponse } from '@cert-prep/contracts/certification-contracts'
import { createAiModel } from '../../ai/model-provider'
import { AI_REQUEST_TIMEOUT_MS } from '../../ai/request-timeout'
import { AdvancedBankError, bankFingerprint, guideFingerprint, type BankQuestion, type ReferenceDomain, type ReviewedMapping } from './bank'

const compatibilitySchema = z.object({
  domains: z.array(z.object({ id: z.string(), compatible: z.boolean() })),
  topics: z.array(z.object({ sourceTopicId: z.string(), targetTopicId: z.string().nullable() })),
})
type Compatibility = z.infer<typeof compatibilitySchema>
export type GuideCompatibilityChecker = (reference: ReferenceDomain[], current: ReferenceDomain[]) => Promise<Compatibility>

export const checkGuideCompatibility: GuideCompatibilityChecker = async (reference, current) => {
  const response = await generateText({
    model: createAiModel(),
    output: Output.object({ schema: compatibilitySchema }),
    prompt: [
      'Compare two versions of a certification guide for mapping an existing bank of practice questions. Do not generate questions.',
      'For every reference domain, mark compatible only if the current domain with the same ID covers its same scope. For every reference topic, choose a current topic ID in that domain only when the current topic fully covers the reference topic. Use null when uncertain, missing, narrower, or split. Do not match solely by ID. Include every reference domain and topic exactly once.',
      `Reference guide: ${JSON.stringify(reference)}`,
      `Current guide: ${JSON.stringify(current)}`,
    ].join('\n\n'),
    maxOutputTokens: 2500,
    maxRetries: 0,
    abortSignal: AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS),
    providerOptions: { openai: { store: false } },
  })
  return compatibilitySchema.parse(response.output)
}

export async function adaptMappingToGuide(bank: BankQuestion[], mapping: ReviewedMapping, guide: CertificationGuideResponse, checker: GuideCompatibilityChecker = checkGuideCompatibility): Promise<ReviewedMapping> {
  if (!mapping.reviewed || mapping.bankFingerprint !== bankFingerprint(bank)) throw new AdvancedBankError('Bank mapping is unavailable')
  const currentFingerprint = guideFingerprint(guide)
  if (mapping.guideFingerprint === currentFingerprint) return mapping
  const reference = mapping.referenceDomains
  if (!reference || guideFingerprint({ domains: reference }) !== mapping.guideFingerprint) throw new AdvancedBankError('Reference guide is unavailable')
  const current = guide.domains.map(({ id, name, description, topics }) => ({ id, name, description, topics: topics.map(({ id, name, description }) => ({ id, name, description })) }))
  let checked: Compatibility
  try { checked = compatibilitySchema.parse(await checker(reference, current)) } catch { throw new AdvancedBankError('Guide compatibility could not be checked') }
  if (checked.domains.length !== reference.length || new Set(checked.domains.map(({ id }) => id)).size !== reference.length
    || checked.domains.some(({ id, compatible }) => !compatible || !reference.some((domain) => domain.id === id) || !current.some((domain) => domain.id === id))) {
    throw new AdvancedBankError('Guide domains are incompatible')
  }
  const sourceTopics = reference.flatMap((domain) => domain.topics.map((topic) => ({ ...topic, domainId: domain.id })))
  if (new Set(sourceTopics.map(({ id }) => id)).size !== sourceTopics.length || checked.topics.length !== sourceTopics.length
    || new Set(checked.topics.map(({ sourceTopicId }) => sourceTopicId)).size !== sourceTopics.length) throw new AdvancedBankError('Guide topic mapping is incomplete')
  const mappedTopics = new Map<string, string | null>()
  for (const { sourceTopicId, targetTopicId } of checked.topics) {
    const source = sourceTopics.find(({ id }) => id === sourceTopicId)
    if (!source || (targetTopicId !== null && !current.find(({ id }) => id === source.domainId)?.topics.some(({ id }) => id === targetTopicId))) throw new AdvancedBankError('Guide topic mapping is invalid')
    mappedTopics.set(sourceTopicId, targetTopicId)
  }
  const questions: ReviewedMapping['questions'] = {}
  for (const [id, item] of Object.entries(mapping.questions)) {
    const source = sourceTopics.find((topic) => topic.id === item.topicId && topic.domainId === item.domainId)
    if (!source || !mappedTopics.has(source.id)) throw new AdvancedBankError('Bank topic mapping is invalid')
    questions[id] = { ...item, topicId: mappedTopics.get(source.id)! }
  }
  return { ...mapping, guideFingerprint: currentFingerprint, questions }
}
