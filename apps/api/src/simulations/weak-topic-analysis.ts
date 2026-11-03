import type { WeakTopic, WeakTopicAnalysisResponse } from '@cert-prep/contracts/weak-topic-contracts'

export const WEAK_TOPIC_THRESHOLD_PERCENT = 80
export const MAX_WEAK_TOPICS_IN_SIMULATION = 20

type Breakdown = { correct: number; total: number }
export type WeakTopicHistoryRow = {
  topicBreakdown: Record<string, Breakdown>
  completedAt: Date
}

function compareWeakness(a: WeakTopic, b: WeakTopic) {
  if (a.incorrect !== b.incorrect) return b.incorrect - a.incorrect
  const accuracyOrder = a.correct * b.total - b.correct * a.total
  if (accuracyOrder !== 0) return accuracyOrder
  const recencyOrder = Date.parse(b.lastPracticedAt) - Date.parse(a.lastPracticedAt)
  if (recencyOrder !== 0) return recencyOrder
  return a.topicId < b.topicId ? -1 : a.topicId > b.topicId ? 1 : 0
}

export function analyzeWeakTopics(input: {
  certificationId: string
  sessions: WeakTopicHistoryRow[]
  knownTopicIds?: ReadonlySet<string>
}): WeakTopicAnalysisResponse {
  const totals = new Map<string, { correct: number; total: number; lastPracticedAt: Date }>()

  for (const session of input.sessions) {
    for (const [topicId, value] of Object.entries(session.topicBreakdown)) {
      if (input.knownTopicIds && !input.knownTopicIds.has(topicId)) continue
      if (!Number.isInteger(value.correct) || !Number.isInteger(value.total)
        || value.correct < 0 || value.total < 1 || value.correct > value.total) continue
      const current = totals.get(topicId) ?? { correct: 0, total: 0, lastPracticedAt: session.completedAt }
      current.correct += value.correct
      current.total += value.total
      totals.set(topicId, current)
    }
  }

  const allWeakTopics = [...totals.entries()].flatMap(([topicId, score]) => {
    const incorrect = score.total - score.correct
    if (incorrect === 0 || score.correct * 100 >= WEAK_TOPIC_THRESHOLD_PERCENT * score.total) return []
    return [{
      topicId,
      correct: score.correct,
      total: score.total,
      incorrect,
      accuracyPercent: Math.floor((score.correct * 100) / score.total),
      lastPracticedAt: score.lastPracticedAt.toISOString(),
    }]
  }).sort(compareWeakness)

  const topics = allWeakTopics.slice(0, MAX_WEAK_TOPICS_IN_SIMULATION)
  const status = input.sessions.length === 0 ? 'history_empty' : allWeakTopics.length === 0 ? 'no_weak_topics' : 'ready'
  return {
    certificationId: input.certificationId,
    status,
    thresholdPercent: WEAK_TOPIC_THRESHOLD_PERCENT,
    analyzedSessionCount: input.sessions.length,
    excludedWeakTopicCount: allWeakTopics.length - topics.length,
    topics,
  }
}

export function allocateFocusedQuestions(topics: Pick<WeakTopic, 'topicId'>[], total = 20) {
  if (topics.length === 0 || topics.length > total) throw new Error('Focused simulation topics must fit the question count.')
  const counts = new Map(topics.map(({ topicId }) => [topicId, 1]))
  for (let remaining = total - topics.length, index = 0; remaining > 0; remaining -= 1, index = (index + 1) % topics.length) {
    const topicId = topics[index]!.topicId
    counts.set(topicId, counts.get(topicId)! + 1)
  }
  return Object.fromEntries(counts)
}
