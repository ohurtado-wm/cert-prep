import { expect, test } from 'bun:test'
import { generateText } from 'ai'
import type { CertificationGuideResponse } from '../src/api/certification-contracts'
import { certificationCatalog } from '../server/catalog/certifications'
import { createAiGuideGenerator } from '../server/catalog/guide-generator'
import { createAiQuestionGenerator } from '../server/simulations/question-generator'
import { createAiStudyPlanGenerator } from '../server/study-plans/plan-generator'

const environment = {
  AI_MODEL: 'test-model',
  OPENAI_API_KEY: 'test-key',
  AI_GUIDE_MAX_OUTPUT_TOKENS: '6100',
  AI_QUESTION_MAX_OUTPUT_TOKENS: '10100',
  AI_STUDY_PLAN_MAX_OUTPUT_TOKENS: '3100',
}

function generateTextCapture(onMaxOutputTokens: (value: number | undefined) => void): typeof generateText {
  return (async (options: unknown) => {
    onMaxOutputTokens((options as { maxOutputTokens?: number }).maxOutputTokens)
    throw new Error('Stop after capturing generation options.')
  }) as typeof generateText
}

const certification = certificationCatalog[0]!
const guide: CertificationGuideResponse = {
  certification,
  version: 1,
  domains: [],
  studyPath: [],
  sources: certification.sources,
  researchSources: [],
  freshness: { aiRefreshedAt: '2026-10-06T00:00:00.000Z', sourceCheckedAt: null },
}

test('guide generator passes its configured output limit to the AI SDK', async () => {
  let maxOutputTokens: number | undefined
  const generator = createAiGuideGenerator('test-model', {
    environment,
    generateText: generateTextCapture((value) => { maxOutputTokens = value }),
  })

  await expect(generator({ certification })).rejects.toMatchObject({ status: 503 })
  expect(maxOutputTokens).toBe(6100)
})

test('question generator passes its configured output limit to the AI SDK', async () => {
  let maxOutputTokens: number | undefined
  const generator = createAiQuestionGenerator({
    environment,
    generateText: generateTextCapture((value) => { maxOutputTokens = value }),
    reporter: () => undefined,
  })

  await expect(generator({
    guide,
    language: 'en',
    requiredQuestionsByDomain: {},
    requiredQuestionsByTopic: {},
    topicScope: 'selected-only',
  })).rejects.toMatchObject({ status: 503 })
  expect(maxOutputTokens).toBe(10100)
})

test('study plan generator passes its configured output limit to the AI SDK', async () => {
  let maxOutputTokens: number | undefined
  const generator = createAiStudyPlanGenerator({
    environment,
    generateText: generateTextCapture((value) => { maxOutputTokens = value }),
  })

  await expect(generator({
    language: 'en',
    certificationName: 'Certification',
    sessionCount: 1,
    domains: [],
    targets: [],
    failedFocuses: [],
    studyPath: [],
  })).rejects.toMatchObject({ status: 503 })
  expect(maxOutputTokens).toBe(3100)
})

test('invalid output limits stop all generators before the AI SDK call', async () => {
  const flows: Array<{
    key: string
    run: (environment: Record<string, string | undefined>, generateTextImplementation: typeof generateText) => Promise<unknown>
  }> = [
    {
      key: 'AI_GUIDE_MAX_OUTPUT_TOKENS',
      run: (env, runGenerateText) => createAiGuideGenerator('test-model', {
        environment: env,
        generateText: runGenerateText,
      })({ certification }),
    },
    {
      key: 'AI_QUESTION_MAX_OUTPUT_TOKENS',
      run: (env, runGenerateText) => createAiQuestionGenerator({
        environment: env,
        generateText: runGenerateText,
        reporter: () => undefined,
      })({
        guide,
        language: 'en',
        requiredQuestionsByDomain: {},
        requiredQuestionsByTopic: {},
        topicScope: 'selected-only',
      }),
    },
    {
      key: 'AI_STUDY_PLAN_MAX_OUTPUT_TOKENS',
      run: (env, runGenerateText) => createAiStudyPlanGenerator({
        environment: env,
        generateText: runGenerateText,
      })({
        language: 'en',
        certificationName: 'Certification',
        sessionCount: 1,
        domains: [],
        targets: [],
        failedFocuses: [],
        studyPath: [],
      }),
    },
  ]

  for (const flow of flows) {
    let called = false
    await expect(flow.run(
      { ...environment, [flow.key]: undefined },
      generateTextCapture(() => { called = true }),
    )).rejects.toMatchObject({ code: 'AI_OUTPUT_TOKENS_INVALID' })
    expect(called).toBe(false)
  }
})
