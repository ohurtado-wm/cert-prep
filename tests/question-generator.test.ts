import { expect, test } from 'bun:test'
import type { CertificationGuideResponse } from '../src/api/certification-contracts'
import { certificationCatalog } from '../server/catalog/certifications'
import { buildQuestionGenerationPrompt } from '../server/simulations/question-generator'

const certification = certificationCatalog[0]!
const guide: CertificationGuideResponse = {
  certification,
  version: 1,
  domains: [{
    id: 'section-1',
    sourceSectionNumber: 1,
    name: { en: 'Design', es: 'Diseño' },
    description: { en: 'Design applications', es: 'Diseñar aplicaciones' },
    weight: 100,
    topics: [1, 2].map((number) => ({
      id: `topic-${number}`,
      name: { en: `Topic ${number}`, es: `Tema ${number}` },
      description: { en: 'Topic description', es: 'Descripción del tema' },
    })),
  }],
  studyPath: [],
  sources: certification.sources,
  researchSources: [],
  freshness: { aiRefreshedAt: '2026-10-06T00:00:00.000Z', sourceCheckedAt: null },
}

const promptInput = {
  guide,
  language: 'en' as const,
  requiredQuestionsByDomain: { 'section-1': 20 },
  requiredQuestionsByTopic: { 'topic-1': 20, 'topic-2': 0 },
}

test('standard topic quotas prompt full-guide coverage and exclude zero-quota topics', () => {
  const prompt = buildQuestionGenerationPrompt({ ...promptInput, topicScope: 'all-guide-topics' })
  expect(prompt).toContain('full-guide simulation')
  expect(prompt).toContain('do not use topics with a zero quota')
  expect(prompt).toContain('"topic-2"')
  expect(prompt).toContain('"requiredQuestions":0')
  expect(prompt).toContain('assess a distinct decision')
  expect(prompt).not.toContain('This is a focused simulation')
})

test('focused topic quotas keep selected-only prompt language', () => {
  const prompt = buildQuestionGenerationPrompt({ ...promptInput, topicScope: 'selected-only' })
  expect(prompt).toContain('This is a focused simulation')
  expect(prompt).not.toContain('This is a full-guide simulation')
})
