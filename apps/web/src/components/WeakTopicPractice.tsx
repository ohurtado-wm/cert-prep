import type { Locale, GuideDomain } from '@cert-prep/contracts/certification-contracts'
import type { SimulationMode } from '@cert-prep/contracts/simulation-contracts'
import type { WeakTopicAnalysisResponse } from '@cert-prep/contracts/weak-topic-contracts'
import { SimulationApiError } from '../api/simulations'
import { translate } from '../i18n/messages'

export function WeakTopicPractice({ locale, domains, weakTopicAnalysis, weakTopicsLoading, weakTopicsError, weakTopicStartError, onWeakTopicsRetry, simulationMode, startingSimulation, onSimulationModeChange, onStartWeakTopics, canStart }: {
  locale: Locale
  domains: GuideDomain[]
  weakTopicAnalysis: WeakTopicAnalysisResponse | undefined
  weakTopicsLoading: boolean
  weakTopicsError: unknown
  weakTopicStartError: unknown
  onWeakTopicsRetry: () => void
  simulationMode: SimulationMode
  startingSimulation: boolean
  onSimulationModeChange: (mode: SimulationMode) => void
  onStartWeakTopics: () => void
  canStart: boolean
}) {
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)
  const weakTopicsToPractice = (weakTopicAnalysis?.topics ?? []).flatMap((item) => {
    const domain = domains.find((candidate) => candidate.topics.some((topic) => topic.id === item.topicId))
    const topic = domain?.topics.find((candidate) => candidate.id === item.topicId)
    return domain && topic ? [{ ...item, topicName: topic.name[locale], domainName: domain.name[locale] }] : []
  })
  const showWeakTopicActions = !weakTopicsLoading && !weakTopicsError && weakTopicAnalysis?.status === 'ready' && weakTopicsToPractice.length > 0
  const getWeakTopicScoreText = (item: (typeof weakTopicsToPractice)[number]) => text('weakTopicScore', {
    correct: item.correct,
    total: item.total,
    accuracy: item.accuracyPercent,
  })
  const weakTopicStartMessage = weakTopicStartError instanceof SimulationApiError
    ? weakTopicStartError.code === 'SIMULATION_HISTORY_EMPTY'
      ? text('weakTopicHistoryEmpty')
      : weakTopicStartError.code === 'NO_WEAK_TOPICS'
        ? text('weakTopicNoWeakAreas', { threshold: weakTopicAnalysis?.thresholdPercent ?? 80 })
        : weakTopicStartError.code === 'WEAK_TOPICS_UNAVAILABLE'
          ? text('weakTopicGuideChanged')
          : text('weakTopicStartError')
    : weakTopicStartError ? text('weakTopicStartError') : null
  return (
    <section className={`weak-topic-practice${showWeakTopicActions ? ' has-actions' : ''}`} aria-labelledby="weak-topic-title">
        <div className="weak-topic-copy">
          <h2 id="weak-topic-title">{text('weakTopicTitle')}</h2>
          <p className="weak-topic-description">{text('weakTopicThreshold', { threshold: weakTopicAnalysis?.thresholdPercent ?? 80 })}</p>
        </div>
        <div className="weak-topic-inline">
          {weakTopicsLoading && <p className="weak-topic-message" role="status">{text('weakTopicLoading')}</p>}
          {!weakTopicsLoading && Boolean(weakTopicsError) && (
            <div className="weak-topic-message has-error" role="alert">
              <span>{text('weakTopicLoadError')}</span>
              <button className="button button-text" type="button" onClick={onWeakTopicsRetry}>{text('retry')}</button>
            </div>
          )}
          {!weakTopicsLoading && !weakTopicsError && weakTopicAnalysis?.status === 'history_empty' && (
            <p className="weak-topic-message">{text('weakTopicHistoryEmpty')}</p>
          )}
          {!weakTopicsLoading && !weakTopicsError && weakTopicAnalysis?.status === 'no_weak_topics' && (
            <p className="weak-topic-message">{text('weakTopicNoWeakAreas', { threshold: weakTopicAnalysis.thresholdPercent })}</p>
          )}
          {!weakTopicsLoading && !weakTopicsError && weakTopicAnalysis?.status === 'ready' && weakTopicsToPractice.length === 0 && (
            <p className="weak-topic-message">{text('weakTopicGuideChanged')}</p>
          )}
          {!weakTopicsLoading && !weakTopicsError && weakTopicAnalysis?.status === 'ready' && weakTopicsToPractice.length > 0 && (
            <>
              <span className="weak-topic-basis">
                {weakTopicAnalysis.analyzedSessionCount === 1
                  ? text('weakTopicRecentSingle')
                  : text('weakTopicRecentCount', { count: weakTopicAnalysis.analyzedSessionCount })}
              </span>
              {weakTopicsToPractice.length === 1 ? (
                <div className="weak-topic-priority">
                  <strong className="weak-topic-name">{weakTopicsToPractice[0]!.topicName}</strong>
                  <span className="weak-topic-score">{getWeakTopicScoreText(weakTopicsToPractice[0]!)}</span>
                </div>
              ) : (
                <details className="weak-topic-details">
                  <summary>
                    <span className="weak-topic-priority">
                      <strong className="weak-topic-name">{weakTopicsToPractice[0]!.topicName}</strong>
                      <span className="weak-topic-score">{getWeakTopicScoreText(weakTopicsToPractice[0]!)}</span>
                    </span>
                    <span className="weak-topic-more">{text('weakTopicMoreCompact', { count: weakTopicsToPractice.length - 1 })}</span>
                    <span className="weak-topic-disclosure" aria-hidden="true" />
                  </summary>
                  <ul className="weak-topic-list">
                    {weakTopicsToPractice.map((item) => (
                      <li key={item.topicId}>
                        <span className="weak-topic-name">{item.topicName}</span>
                        <span className="weak-topic-domain">{item.domainName}</span>
                        <span className="weak-topic-score">{getWeakTopicScoreText(item)}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              {weakTopicAnalysis.excludedWeakTopicCount > 0 && (
                <span
                  className="weak-topic-excluded"
                  role="note"
                  title={text('weakTopicMoreAreas', { count: weakTopicAnalysis.excludedWeakTopicCount })}
                  aria-label={text('weakTopicMoreAreas', { count: weakTopicAnalysis.excludedWeakTopicCount })}
                >
                  {text('weakTopicExcludedCompact', { count: weakTopicAnalysis.excludedWeakTopicCount })}
                </span>
              )}
            </>
          )}
        </div>
        {showWeakTopicActions && (
          <div className="weak-topic-actions">
            <label className="weak-topic-mode">
              <input type="checkbox" checked={simulationMode === 'real'} disabled={startingSimulation} onChange={(event) => onSimulationModeChange(event.currentTarget.checked ? 'real' : 'practice')} />
              <span><strong>{text('realMode')}</strong><small>{text('focusedRealModeHelp')}</small></span>
            </label>
            <button className="button button-secondary weak-topic-button" type="button" onClick={onStartWeakTopics} disabled={!canStart}>
              {text('weakTopicStart')} <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
        {weakTopicStartMessage && weakTopicAnalysis?.status === 'ready' && <p className="weak-topic-message weak-topic-start-error has-error" role="alert">{weakTopicStartMessage}</p>}
      </section>
  )
}
