import { readFileSync } from 'node:fs'
import { expect, test } from 'bun:test'

type Rubric = {
  questionCountPerRun: number
  questionTextRetained: boolean
  baseline: {
    repeatedObjectiveFamilyCount: number
    repeatedObjectiveFamilies: Array<{ id: string; items: string[] }>
  }
  rubric: Array<{ id: string; passWhen: string }>
}

const rubric = JSON.parse(readFileSync(new URL('./evaluation/simulation-topic-coverage/rubric.json', import.meta.url), 'utf8')) as Rubric

test('topic coverage rubric records the repeated-family baseline without retaining PDF question text', () => {
  expect(rubric.questionCountPerRun).toBe(20)
  expect(rubric.questionTextRetained).toBe(false)
  expect(rubric.baseline.repeatedObjectiveFamilies).toHaveLength(rubric.baseline.repeatedObjectiveFamilyCount)
  expect(rubric.baseline.repeatedObjectiveFamilies.length).toBeGreaterThanOrEqual(12)
  for (const family of rubric.baseline.repeatedObjectiveFamilies) {
    expect(family.id).toMatch(/^[a-z0-9-]+$/)
    expect(family.items.some((item) => item.startsWith('Q1#'))).toBe(true)
    expect(family.items.some((item) => item.startsWith('Q2#'))).toBe(true)
    expect(family.items.every((item) => /^Q[12]#([1-9]|1\d|20)$/.test(item))).toBe(true)
  }
  expect(rubric.rubric.map(({ id }) => id)).toEqual([
    'exact-topic-quotas',
    'least-covered-topic-rotation',
    'distinct-decisions-within-run',
  ])
})
