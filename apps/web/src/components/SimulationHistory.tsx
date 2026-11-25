import { commonErrorMessage } from '../i18n/error-messages'
import { useState } from 'react'
import type { CertificationCatalogItem, CertificationGuideResponse, Locale } from '@cert-prep/contracts/certification-contracts'
import type { PrintableSimulationQuestion, SimulationHistoryItem, SimulationSnapshot } from '@cert-prep/contracts/simulation-contracts'
import { translate } from '../i18n/messages'

export function SimulationHistory({
  locale, certification, certifications, currentGuide, history, loading, error, clearing,
  pendingSession, pendingLoading, pendingError, onRetry, onRetryPending, onResume, onClear, onDashboard,
  completedSessionAvailable, completedPrintableQuestions, onViewCompletedSession, onDiscard, discarding, discardError,
}: {
  locale: Locale
  certification: CertificationCatalogItem
  certifications: CertificationCatalogItem[]
  currentGuide: CertificationGuideResponse | undefined
  history: SimulationHistoryItem[]
  loading: boolean
  error: unknown | null
  clearing: boolean
  pendingSession: SimulationSnapshot | null
  pendingLoading: boolean
  pendingError: unknown | null
  onRetry: () => void
  onRetryPending: () => void
  onResume: (session: SimulationSnapshot) => Promise<void>
  completedSessionAvailable: boolean
  completedPrintableQuestions: PrintableSimulationQuestion[]
  onViewCompletedSession: () => void
  onDiscard: (sessionId: string) => void
  discarding: boolean
  discardError: unknown | null
  onClear: () => void
  onDashboard: () => void
}) {
  const [resuming, setResuming] = useState(false)
  const [resumeError, setResumeError] = useState(false)
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)
  const completed = history.filter((session) => session.certificationId === certification.id)
  const active = !pendingError && pendingSession?.status === 'active' && pendingSession.certificationId === certification.id && !completed.some((session) => session.id === pendingSession.sessionId) ? pendingSession : null
  const empty = !loading && !error && completed.length === 0 && !pendingLoading && !pendingError && !active && !completedSessionAvailable

  async function continueSession(session: SimulationSnapshot) {
    if (resuming) return
    setResumeError(false)
    setResuming(true)
    try { await onResume(session) } catch { setResumeError(true) } finally { setResuming(false) }
  }

  if (empty && !resumeError) {
    return <section className="progress-empty" aria-labelledby="progress-empty-title">
      <p className="eyebrow">{text('historyTitle')}</p>
      <h2 id="progress-empty-title">{text('progressEmptyTitle')}</h2>
      <p>{text('progressEmptyDescription', { certification: certification.name[locale] })}</p>
      <p className="progress-empty-next">{text('progressEmptyNext')}</p>
      <button className="button button-primary" type="button" onClick={onDashboard}>{text('progressGoHome')} <span aria-hidden="true">→</span></button>
    </section>
  }

  return <section className="history-section" aria-labelledby="history-title">
    <div className="section-heading">
      <div>
        <p className="eyebrow">{text('historyEyebrow')}</p>
        <h2 id="history-title">{text('historyTitle')}</h2>
        <p className="section-intro">{text('historyDescription')}</p>
      </div>
      {completed.length > 0 && <button className="button button-text" type="button" onClick={onClear} disabled={clearing}>{clearing ? text('clearingHistory') : text('clearHistory')}</button>}
    </div>
    {completedSessionAvailable && <div className="history-recent-result">
      <p>{text('historyRecentResultAvailable')}</p>
      <div className="history-result-actions">
        <button className="button button-secondary" type="button" onClick={onViewCompletedSession}>{text('historyViewResult')}</button>
        {completedPrintableQuestions.length === 20 && <button className="button button-primary" type="button" onClick={() => window.print()}>{text('printQuestions')}</button>}
      </div>
    </div>}
    {completedPrintableQuestions.length !== 20 && (completed.length > 0 || completedSessionAvailable) && <p className="history-print-unavailable">{text('historyPrintUnavailable')}</p>}
    {completedPrintableQuestions.length === 20 && <ol className="printable-answer-sheet" aria-hidden="true">
      {completedPrintableQuestions.map((item, index) => <li key={`${index}-${item.question}`}><span>{item.question}</span><p>- {item.answer}</p></li>)}
    </ol>}
    {pendingLoading && <p className="history-state" role="status">{text('pendingSessionLoading')}</p>}
    {Boolean(pendingError) && <div className="history-state history-error" role="alert"><p>{commonErrorMessage(locale, pendingError) ?? text('pendingSessionError')}</p><button className="button button-secondary" type="button" onClick={onRetryPending}>{text('retry')}</button></div>}
    {loading && <p className="history-state" role="status">{text('historyLoading')}</p>}
    {Boolean(error) && <div className="history-state history-error" role="alert"><p>{commonErrorMessage(locale, error) ?? text('historyError')}</p><button className="button button-secondary" type="button" onClick={onRetry}>{text('retry')}</button></div>}
    {resumeError && <div className="history-state history-error" role="alert"><p>{text('pendingSessionChanged')}</p><button className="button button-secondary" type="button" onClick={() => { setResumeError(false); onRetryPending() }}>{text('retry')}</button></div>}
    {Boolean(discardError) && <p className="history-state history-error" role="alert">{commonErrorMessage(locale, discardError) ?? text('discardSessionError')}</p>}
    {!loading && !error && completed.length === 0 && active && <p className="history-state">{text('historyNoCompleted')}</p>}
    {(active || completed.length > 0) && <ol className="history-list">
      {active && <li className="history-card history-card-active">
        <div className="history-card-topline"><strong className="history-active-status">{text('historyInProgress')}</strong><time dateTime={active.createdAt}>{formatDate(active.createdAt, locale)}</time></div>
        <div className="history-card-heading">
          <div><h3>{certification.name[locale]}</h3><p>{text(active.mode === 'real' ? 'historyRealMode' : 'historyPracticeMode')} · {text(active.questionSource === 'advanced' ? 'advancedMode' : 'historyAiSource')}</p></div>
        </div>
        <div className="history-progress">
          <p className="history-score-detail">{text('pendingSessionProgress', { current: active.currentIndex + 1, total: active.questionCount })}</p>
          <progress className="history-meter" max={active.questionCount} value={active.currentIndex} aria-label={text('progressLabel')} aria-valuetext={text('pendingSessionProgress', { current: active.currentIndex + 1, total: active.questionCount })} />
        </div>
        <div className="history-meta"><span>{active.language.toUpperCase()}</span></div>
        <div className="history-active-actions">
          <button className="button button-primary" type="button" disabled={resuming || pendingLoading || discarding} onClick={() => void continueSession(active)}>{text(resuming ? 'pendingSessionResuming' : 'continueSession')} <span aria-hidden="true">→</span></button>
          <button className="button button-text history-discard" type="button" disabled={resuming || pendingLoading || discarding} onClick={() => onDiscard(active.sessionId)}>{text(discarding ? 'discardingSession' : 'discardSession')}</button>
        </div>
      </li>}
      {completed.map((session) => {
        const item = certifications.find(({ id }) => id === session.certificationId)
        const title = item?.name[locale] ?? session.certificationId
        const guide = currentGuide?.certification.id === session.certificationId ? currentGuide : undefined
        const weakDomains = session.domainBreakdown.filter(({ correct, total }) => correct < total)
        return <li className="history-card" key={session.id}>
          <div className="history-card-topline"><strong className="history-completed-status">{text('historyCompleted')}</strong><time dateTime={session.completedAt}>{formatDate(session.completedAt, locale)}</time></div>
          <div className="history-card-heading">
            <div><h3>{title}</h3><p>{text(session.mode === 'real' ? 'historyRealMode' : 'historyPracticeMode')} · {text(session.questionSource === 'advanced' ? 'advancedMode' : 'historyAiSource')}</p></div>
            <div className="history-result-score"><span>{text('historyScore')}</span><strong className="history-score">{session.score}%</strong></div>
          </div>
          <div className="history-progress">
            <p className="history-score-detail">{text('correctOfTotal', { correct: session.correctAnswers, total: session.totalQuestions })}</p>
            <progress className="history-meter" max={100} value={session.score} aria-label={text('historyScore')} aria-valuetext={`${session.score}%`} />
          </div>
          <div className="history-meta"><span>{text('historyGuideVersion', { version: session.guideVersion })}</span><span>{session.language.toUpperCase()}</span></div>
          {weakDomains.length > 0 && <div className="history-weak-domains"><span>{text('historyReviewDomains')}</span><div className="review-chips">{weakDomains.map((item) => {
            const domain = guide?.domains.find(({ id }) => id === item.id)
            return <span className="review-chip" key={item.id}>{domain?.name[locale] ?? item.id} · {item.correct}/{item.total}</span>
          })}</div></div>}
        </li>
      })}
    </ol>}
  </section>
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es' : 'en-US', { dateStyle: 'medium' }).format(new Date(value))
}
