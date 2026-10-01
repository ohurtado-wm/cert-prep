import { expect, test } from 'bun:test'
import { allocateFocusedQuestions, analyzeWeakTopics } from '../server/simulations/weak-topic-analysis'

test('weak topic analysis ranks errors, accuracy, and recency while excluding the 80% boundary', () => {
  const analysis = analyzeWeakTopics({
    certificationId: 'gcp-developer',
    knownTopicIds: new Set(['containers', 'iam', 'monitoring', 'logging', 'pubsub']),
    sessions: [
      { completedAt: new Date('2026-10-01T00:00:00.000Z'), topicBreakdown: { containers: { correct: 2, total: 5 }, iam: { correct: 4, total: 5 }, logging: { correct: 0, total: 2 }, pubsub: { correct: 1, total: 3 }, unknown: { correct: 0, total: 5 } } },
      { completedAt: new Date('2026-09-01T00:00:00.000Z'), topicBreakdown: { containers: { correct: 3, total: 5 }, iam: { correct: 4, total: 5 }, monitoring: { correct: 1, total: 3 } } },
    ],
  })

  expect(analysis).toMatchObject({ status: 'ready', analyzedSessionCount: 2, thresholdPercent: 80, excludedWeakTopicCount: 0 })
  expect(analysis.topics.map(({ topicId, correct, total, accuracyPercent }) => ({ topicId, correct, total, accuracyPercent }))).toEqual([
    { topicId: 'containers', correct: 5, total: 10, accuracyPercent: 50 },
    { topicId: 'logging', correct: 0, total: 2, accuracyPercent: 0 },
    { topicId: 'pubsub', correct: 1, total: 3, accuracyPercent: 33 },
    { topicId: 'monitoring', correct: 1, total: 3, accuracyPercent: 33 },
  ])
  expect(analysis.topics[0]).toMatchObject({ incorrect: 5 })
  expect(analysis.topics[2]?.lastPracticedAt).toBe('2026-10-01T00:00:00.000Z')
})

test('weak topic analysis distinguishes empty history from a history with no weak topics', () => {
  expect(analyzeWeakTopics({ certificationId: 'gcp-developer', sessions: [] })).toMatchObject({
    status: 'history_empty', analyzedSessionCount: 0, topics: [],
  })
  expect(analyzeWeakTopics({
    certificationId: 'gcp-developer',
    sessions: [{ completedAt: new Date('2026-10-01T00:00:00.000Z'), topicBreakdown: { containers: { correct: 4, total: 5 }, iam: { correct: 5, total: 5 } } }],
  })).toMatchObject({ status: 'no_weak_topics', analyzedSessionCount: 1, topics: [] })
})

test('focused question allocation includes every selected topic and distributes the 20 questions deterministically', () => {
  const topics = [
    { topicId: 'a' }, { topicId: 'b' }, { topicId: 'c' },
  ]
  const counts = allocateFocusedQuestions(topics)
  expect(counts).toEqual({ a: 7, b: 7, c: 6 })
  expect(Object.values(counts).reduce((sum, count) => sum + count, 0)).toBe(20)
})
