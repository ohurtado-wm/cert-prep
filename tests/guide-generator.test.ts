import { expect, test } from 'bun:test'
import { certificationCatalog } from '../server/catalog/certifications'
import {
  buildGuidePrompt,
  collectGuideResearchSources,
  createAiGuideGenerator,
  hashGuideResearchSources,
  isExpectedGuideResearch,
} from '../server/catalog/guide-generator'

const certification = certificationCatalog[0]!

test('guide prompt sends official guide and certification URLs and requires source review', () => {
  const examGuide = certification.sources.find((source) => source.kind === 'exam-guide')!
  const certificationPage = certification.sources.find((source) => source.kind === 'certification')!
  const prompt = buildGuidePrompt(certification)

  expect(prompt).toContain(examGuide.url)
  expect(prompt).toContain(certificationPage.url)
  expect(prompt).toContain('required web search')
  expect(prompt).toContain('including fractional percentages')
})

test('collects only unique HTTPS Google web-search citations', () => {
  const examGuide = certification.sources.find((source) => source.kind === 'exam-guide')!
  const results = collectGuideResearchSources([{
    toolName: 'web_search',
    output: { sources: [
      { type: 'url', url: examGuide.url },
      { type: 'url', url: examGuide.url },
      { type: 'url', url: 'https://example.com/guide' },
      { type: 'url', url: 'http://cloud.google.com/not-secure' },
      { type: 'api', name: 'ignored' },
    ] },
  }], certification)

  expect(results.map(({ url }) => url)).toEqual([examGuide.url])
  expect(isExpectedGuideResearch(certification, results)).toBe(true)
  expect(isExpectedGuideResearch(certification, [{ title: 'bad', url: 'https://example.com/guide' }])).toBe(false)
})

test('research source hash ignores citation ordering and tracking queries', () => {
  const sources = [
    { title: 'Guide', url: 'https://services.google.com/fh/exam.pdf?utm_source=app' },
    { title: 'Cert', url: 'https://cloud.google.com/learn/certification/example' },
  ]
  expect(hashGuideResearchSources(sources)).toBe(hashGuideResearchSources([...sources].reverse()))
  expect(hashGuideResearchSources(sources)).toBe(hashGuideResearchSources([
    { title: 'Guide', url: 'https://www.services.google.com/fh/exam.pdf' },
    { title: 'Cert', url: 'https://cloud.google.com/learn/certification/example' },
  ]))
})

test('guide generation stays disabled until a model is configured', async () => {
  const generate = createAiGuideGenerator('')
  await expect(generate({ certification })).rejects.toMatchObject({
    code: 'AI_NOT_CONFIGURED',
    status: 503,
  })
})
