import { expect, test } from 'bun:test'
import { allocateQuestionsByWeight, InvalidQuestionSetError } from '../server/simulations/question-validation'
import type { GuideDomain } from '../src/api/certification-contracts'

const domains: GuideDomain[] = [17.5, 22.5, 30, 30].map((weight, index) => ({
  id: `section-${index + 1}`,
  sourceSectionNumber: index + 1,
  name: { en: `Domain ${index + 1}`, es: `Dominio ${index + 1}` },
  description: { en: 'Description', es: 'Descripción' },
  weight,
  topics: [{
    id: `topic-${index + 1}`,
    name: { en: 'Topic', es: 'Tema' },
    description: { en: 'Description', es: 'Descripción' },
  }],
}))

test('allocates questions using fractional exam weights', () => {
  expect(allocateQuestionsByWeight(domains, 20)).toEqual({
    'section-1': 4,
    'section-2': 4,
    'section-3': 6,
    'section-4': 6,
  })
})

test('rejects fractional weights that do not total 100 percent', () => {
  expect(() => allocateQuestionsByWeight(domains.map((domain, index) => (
    index === 0 ? { ...domain, weight: domain.weight - 0.5 } : domain
  )), 20)).toThrow(InvalidQuestionSetError)
})
