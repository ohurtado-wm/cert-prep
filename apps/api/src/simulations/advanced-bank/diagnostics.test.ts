import { expect, test } from 'bun:test'
import type { CertificationGuideResponse } from '@cert-prep/contracts/certification-contracts'
import { ApiException } from '../../errors'
import { AdvancedBankError, bankFingerprint, guideFingerprint, type ReferenceDomain } from './bank'
import { adaptMappingToGuide, type GuideCompatibilityChecker } from './guide-compatibility'

const localized = { en: 'Reference', es: 'Referencia' }
const reference: ReferenceDomain[] = [{ id: 'section-1', name: localized, description: localized, topics: [] }]
const mapping = { reviewed: true, bankFingerprint: bankFingerprint([]), guideFingerprint: guideFingerprint({ domains: reference }), referenceDomains: reference, questions: {} }
const guide = { domains: [{ ...reference[0]!, description: { en: 'Changed', es: 'Cambio' } }] } as CertificationGuideResponse

test('classifies compatibility failures without recording provider output', async () => {
  const failures = [
    [new ApiException(503, 'AI_NOT_CONFIGURED', 'secret'), 'provider_configuration'],
    [Object.assign(new Error('secret'), { name: 'TimeoutError' }), 'provider_timeout'],
    [new Error('secret question and answer'), 'provider_request_failed'],
  ] as const
  for (const [cause, reason] of failures) {
    try {
      await adaptMappingToGuide([], mapping, guide, async () => { throw cause })
      throw new Error('Expected failure')
    } catch (error) {
      expect(error).toBeInstanceOf(AdvancedBankError)
      expect(error).toMatchObject({ category: 'compatibility_provider', reason })
      expect((error as Error).message).not.toContain('secret')
    }
  }
  const invalid = (async () => ({ private: 'secret' })) as unknown as GuideCompatibilityChecker
  await expect(adaptMappingToGuide([], mapping, guide, invalid)).rejects.toMatchObject({ category: 'compatibility_provider', reason: 'provider_invalid_output' })
})
