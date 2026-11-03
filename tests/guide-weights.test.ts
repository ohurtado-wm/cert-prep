import { expect, test } from 'bun:test'
import { allocateQuestionsByTopic, allocateQuestionsByWeight, InvalidQuestionSetError } from '../apps/api/src/simulations/question-validation'
import type { GuideDomain } from '@cert-prep/contracts/certification-contracts'

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

const sixTopicDomain: GuideDomain[] = [{
  id: 'section-1',
  sourceSectionNumber: 1,
  name: { en: 'Domain', es: 'Dominio' },
  description: { en: 'Description', es: 'Descripción' },
  weight: 100,
  topics: Array.from({ length: 6 }, (_, index) => ({
    id: `topic-${index + 1}`,
    name: { en: `Topic ${index + 1}`, es: `Tema ${index + 1}` },
    description: { en: 'Description', es: 'Descripción' },
  })),
}]

test('allocates the empty-history remainder by stable topic ID and rotates over the latest two results', () => {
  const first = allocateQuestionsByTopic(sixTopicDomain, { 'section-1': 20 })
  expect(first).toEqual({
    'topic-1': 4,
    'topic-2': 4,
    'topic-3': 3,
    'topic-4': 3,
    'topic-5': 3,
    'topic-6': 3,
  })

  const second = allocateQuestionsByTopic(sixTopicDomain, { 'section-1': 20 }, [
    Object.fromEntries(Object.entries(first).map(([id, total]) => [id, { correct: 0, total }])),
  ])
  expect(second).toEqual({
    'topic-1': 3,
    'topic-2': 3,
    'topic-3': 4,
    'topic-4': 4,
    'topic-5': 3,
    'topic-6': 3,
  })

  const third = allocateQuestionsByTopic(sixTopicDomain, { 'section-1': 20 }, [
    Object.fromEntries(Object.entries(first).map(([id, total]) => [id, { correct: 0, total }])),
    Object.fromEntries(Object.entries(second).map(([id, total]) => [id, { correct: 0, total }])),
  ])
  expect(third).toEqual({
    'topic-1': 3,
    'topic-2': 3,
    'topic-3': 3,
    'topic-4': 3,
    'topic-5': 4,
    'topic-6': 4,
  })
})

test('preserves each supplied domain quota when allocating topic quotas', () => {
  const domainQuestions = allocateQuestionsByWeight(domains, 20)
  const topicQuestions = allocateQuestionsByTopic(domains, domainQuestions)
  for (const domain of domains) {
    expect(domain.topics.reduce((sum, topic) => sum + topicQuestions[topic.id]!, 0)).toBe(domainQuestions[domain.id])
  }
  expect(Object.values(topicQuestions).reduce((sum, count) => sum + count, 0)).toBe(20)
})

test('keeps the current certification domain split at 5/4/4/4/3 questions', () => {
  const currentGuideDomains: GuideDomain[] = [25, 20, 20, 20, 15].map((weight, domainIndex) => ({
    ...sixTopicDomain[0]!,
    id: `section-${domainIndex + 1}`,
    sourceSectionNumber: domainIndex + 1,
    weight,
    topics: sixTopicDomain[0]!.topics.map((topic, topicIndex) => ({
      ...topic,
      id: `topic-${domainIndex + 1}-${topicIndex + 1}`,
    })),
  }))
  const domainQuestions = allocateQuestionsByWeight(currentGuideDomains)
  expect(domainQuestions).toEqual({
    'section-1': 5,
    'section-2': 4,
    'section-3': 4,
    'section-4': 4,
    'section-5': 3,
  })

  const topicQuestions = allocateQuestionsByTopic(currentGuideDomains, domainQuestions)
  for (const domain of currentGuideDomains) {
    expect(domain.topics.reduce((sum, topic) => sum + topicQuestions[topic.id]!, 0)).toBe(domainQuestions[domain.id])
  }
})

test('rejects invalid domain allocations before assigning topic quotas', () => {
  expect(() => allocateQuestionsByTopic(sixTopicDomain, { 'section-1': 19 })).toThrow(InvalidQuestionSetError)
  expect(() => allocateQuestionsByTopic([{ ...sixTopicDomain[0]!, topics: [] }], { 'section-1': 20 }))
    .toThrow(InvalidQuestionSetError)
})
