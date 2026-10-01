import type { CertificationGuideResponse, Locale } from '../../src/api/certification-contracts'

type Breakdown = { correct: number; total: number }
type ResultBreakdowns = {
  domainBreakdown: Record<string, Breakdown>
  topicBreakdown: Record<string, Breakdown>
  focusBreakdown: Record<string, Breakdown>
}

export type StudyPlanTarget = {
  kind: 'domain' | 'topic'
  id: string
  domainId: string
  label: string
  correct: number
  total: number
  incorrect: number
  accuracy: number
  priority: number
}

export type StudyPlanFocus = {
  label: string
  correct: number
  total: number
  incorrect: number
  accuracy: number
}

function sumBreakdowns(rows: ResultBreakdowns[], key: keyof ResultBreakdowns) {
  const totals = new Map<string, Breakdown>()
  for (const row of rows) {
    for (const [id, value] of Object.entries(row[key])) {
      if (!Number.isInteger(value.correct) || !Number.isInteger(value.total) || value.correct < 0 || value.total < value.correct || value.total < 1) continue
      const current = totals.get(id) ?? { correct: 0, total: 0 }
      current.correct += value.correct
      current.total += value.total
      totals.set(id, current)
    }
  }
  return totals
}

function compareWeakness(
  a: { correct: number; total: number; incorrect: number; kind?: string; id?: string; label?: string },
  b: { correct: number; total: number; incorrect: number; kind?: string; id?: string; label?: string },
) {
  const errorRateOrder = b.incorrect * a.total - a.incorrect * b.total
  if (errorRateOrder !== 0) return errorRateOrder
  if (a.incorrect !== b.incorrect) return b.incorrect - a.incorrect
  if (a.total !== b.total) return b.total - a.total
  if (a.kind && b.kind && a.kind !== b.kind) return a.kind === 'topic' ? -1 : 1
  const aKey = a.id ?? a.label ?? ''
  const bKey = b.id ?? b.label ?? ''
  return aKey < bKey ? -1 : aKey > bKey ? 1 : 0
}

function toFocus(label: string, value: Breakdown): StudyPlanFocus {
  return {
    label,
    correct: value.correct,
    total: value.total,
    incorrect: value.total - value.correct,
    accuracy: Math.round(value.correct / value.total * 100),
  }
}

export function aggregateStudyResults(rows: ResultBreakdowns[], guide: CertificationGuideResponse, locale: Locale) {
  const domainTotals = sumBreakdowns(rows, 'domainBreakdown')
  const topicTotals = sumBreakdowns(rows, 'topicBreakdown')
  const focusTotals = new Map<string, Breakdown>()
  const labels = new Map<string, string>()
  for (const row of rows) {
    for (const [label, value] of Object.entries(row.focusBreakdown)) {
      if (!Number.isInteger(value.correct) || !Number.isInteger(value.total) || value.correct < 0 || value.total < value.correct || value.total < 1) continue
      const displayLabel = label.trim().replace(/\s+/g, ' ')
      const normalized = displayLabel.toLowerCase()
      if (!normalized) continue
      const current = focusTotals.get(normalized) ?? { correct: 0, total: 0 }
      current.correct += value.correct
      current.total += value.total
      focusTotals.set(normalized, current)
      if (!labels.has(normalized)) labels.set(normalized, displayLabel)
    }
  }
  const topics = guide.domains.flatMap((domain) => domain.topics.flatMap((topic) => {
    const value = topicTotals.get(topic.id)
    if (!value || value.total === value.correct) return []
    return [{
      kind: 'topic' as const,
      id: topic.id,
      domainId: domain.id,
      label: topic.name[locale],
      correct: value.correct,
      total: value.total,
      incorrect: value.total - value.correct,
      accuracy: Math.round(value.correct / value.total * 100),
      priority: 0,
    }]
  }))

  const knownTopicIds = new Set(guide.domains.flatMap((domain) => domain.topics.map(({ id }) => id)))
  const validTopicTotals = [...topicTotals.keys()].some((id) => knownTopicIds.has(id))
  const domainTargets = guide.domains.flatMap((domain) => {
    const value = domainTotals.get(domain.id)
    if (!value || value.total === value.correct) return []
    return [{
      kind: 'domain' as const,
      id: domain.id,
      domainId: domain.id,
      label: domain.name[locale],
      correct: value.correct,
      total: value.total,
      incorrect: value.total - value.correct,
      accuracy: Math.round(value.correct / value.total * 100),
      priority: 0,
    }]
  })
  const candidatePool = topics.length > 0 ? topics : validTopicTotals ? [] : domainTargets
  const candidates = candidatePool.sort(compareWeakness).slice(0, 5)
    .map((target, index) => ({ ...target, priority: index + 1 }))
  const failedFocuses = [...focusTotals.entries()]
    .filter(([, value]) => value.total > value.correct)
    .map(([id, value]) => toFocus(labels.get(id) ?? id, value))
    .sort(compareWeakness)
    .slice(0, 10)

  return {
    sessionCount: rows.length,
    domains: guide.domains.flatMap((domain) => {
      const value = domainTotals.get(domain.id)
      return value ? [{
        id: domain.id,
        label: domain.name[locale],
        correct: value.correct,
        total: value.total,
        incorrect: value.total - value.correct,
        accuracy: Math.round(value.correct / value.total * 100),
      }] : []
    }),
    targets: candidates,
    failedFocuses,
  }
}
