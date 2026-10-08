import { expect, test } from 'bun:test'
import { readAiMaxOutputTokens } from '../server/ai/output-token-limits'

const environment = {
  AI_GUIDE_MAX_OUTPUT_TOKENS: '6000',
  AI_QUESTION_MAX_OUTPUT_TOKENS: '10000',
  AI_STUDY_PLAN_MAX_OUTPUT_TOKENS: '3000',
}

test('reads each generation flow output limit from its own environment variable', () => {
  expect(readAiMaxOutputTokens('guide', environment)).toBe(6000)
  expect(readAiMaxOutputTokens('questions', environment)).toBe(10000)
  expect(readAiMaxOutputTokens('studyPlan', environment)).toBe(3000)
})

test('rejects missing output limits with the variable name', () => {
  expect(() => readAiMaxOutputTokens('guide', {})).toThrow('AI_GUIDE_MAX_OUTPUT_TOKENS')
})

test('rejects output limits that are not positive safe integers', () => {
  for (const value of ['', '0', '-1', '1.5', 'invalid', '9007199254740992']) {
    expect(() => readAiMaxOutputTokens('questions', { AI_QUESTION_MAX_OUTPUT_TOKENS: value })).toThrow(
      'AI_QUESTION_MAX_OUTPUT_TOKENS must be configured as a positive integer.',
    )
  }
})
