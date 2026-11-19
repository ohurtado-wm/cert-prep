import type { Locale } from '@cert-prep/contracts/certification-contracts'
import type { StudyPlan } from '@cert-prep/contracts/study-plan-contracts'
import { StudyPlanApiError } from '../api/study-plans'
import { AiTokenUsage } from './AiTokenUsage'
import { translate } from '../i18n/messages'

export function StudyPlanPanel({
  locale,
  certificationName,
  available,
  historyCount,
  historyLoading,
  historyError,
  onRetryHistory,
  guideReady,
  guideLoading,
  guideError,
  onRetryGuide,
  plan,
  planLoading,
  planError,
  generating,
  generationError,
  onRetry,
  onGenerate,
}: {
  locale: Locale
  certificationName: string
  available: boolean
  historyCount: number
  historyLoading: boolean
  historyError: unknown | null
  onRetryHistory: () => void
  guideReady: boolean
  guideLoading: boolean
  guideError: unknown
  onRetryGuide: () => void
  plan: StudyPlan | null | undefined
  planLoading: boolean
  planError: unknown | null
  generating: boolean
  generationError: unknown | null
  onRetry: () => void
  onGenerate: () => void
}) {
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)
  if (!available) return null

  const noHistory = !historyLoading && !historyError && historyCount === 0
  const canGenerate = !historyLoading && !historyError && historyCount > 0 && guideReady && !generating && !planLoading
  const error = generationError ?? planError
  const languageMismatch = Boolean(plan && plan.language !== locale)

  return (
    <section className="study-plan-section" aria-labelledby="study-plan-title">
      <div className="section-heading study-plan-heading">
        <div>
          <p className="eyebrow">{text('studyPlanEyebrow')}</p>
          <h2 id="study-plan-title">{text('studyPlanTitle')}</h2>
          <p className="section-intro">{text('studyPlanDescription')}</p>
          <p className="study-plan-certification">{certificationName}</p>
        </div>
        <button className="button button-primary" type="button" onClick={onGenerate} disabled={!canGenerate}>
          {generating ? text('studyPlanGenerating') : plan ? text('studyPlanRegenerate') : text('studyPlanButton')}
        </button>
      </div>

      {historyLoading ? (
        <p className="history-state" role="status">{text('historyLoading')}</p>
      ) : historyError ? (
        <div className="history-state history-error" role="alert">
          <p>{text('historyError')}</p>
          <button className="button button-secondary" type="button" onClick={onRetryHistory}>{text('retry')}</button>
        </div>
      ) : noHistory ? (
        <p className="history-state">{text('studyPlanNoHistory')}</p>
      ) : (
        <>
          {guideLoading && <p className="history-state" role="status">{text('studyPlanWaitGuide')}</p>}
          {!guideLoading && Boolean(guideError) && <div className="history-state history-error" role="alert"><p>{text('guideError')}</p><button className="button button-secondary" type="button" onClick={onRetryGuide}>{text('guideRetry')}</button></div>}
          {planLoading && <p className="history-state" role="status">{text('studyPlanLoading')}</p>}
          {generating && (
            <div className="study-plan-loading" role="status" aria-live="polite" aria-busy="true">
              <span className="guide-loading-spinner" aria-hidden="true" />
              <span>{text('studyPlanGenerating')}</span>
            </div>
          )}
          {error ? (
            <div className="history-state history-error" role="alert">
              <p>{studyPlanErrorMessage(locale, error)}</p>
              {planError !== null && !generationError && <button className="button button-secondary" type="button" onClick={onRetry}>{text('retry')}</button>}
            </div>
          ) : null}
          {plan && !planLoading && languageMismatch && (
            <div className="study-plan-language-notice" role="status">
              <strong>{text('studyPlanDifferentLanguageTitle')}</strong>
              <p>{text('studyPlanDifferentLanguageDescription')}</p>
            </div>
          )}
          {!plan && !planLoading && !generating && !error && !guideLoading && !guideError && (
            <div className="study-plan-awaiting">
              <h3>{text('studyPlanNotGenerated')}</h3>
              <p>{text('studyPlanNotGeneratedDescription')}</p>
            </div>
          )}
          {plan && !planLoading && (
            <div className="study-plan-result">
              <div className="study-plan-summary">
                <div className="study-plan-summary-copy">
                  <h3>{text('studyPlanSummary')}</h3>
                  <p lang={plan.language}>{plan.summary}</p>
                  <span>{text('studyPlanBasedOn', { count: plan.basedOnSessions })} · <time dateTime={plan.createdAt}>{formatPlanDate(plan.createdAt, locale)}</time></span>
                </div>
                <span className="study-plan-language">{plan.language.toUpperCase()}</span>
              </div>
              <AiTokenUsage locale={locale} usage={plan.aiUsage} compact />
              <ol className="study-plan-list">
                {plan.recommendations.map((recommendation) => (
                  <li className="study-plan-card" key={recommendation.targetKind + ':' + recommendation.targetId}>
                    <div className="study-plan-card-heading">
                      <span className="study-plan-priority">{text('studyPlanPriority', { priority: recommendation.priority })}</span>
                    </div>
                    <p className="eyebrow" lang={plan.language}>{recommendation.label}</p>
                    <h3 lang={plan.language}>{recommendation.title}</h3>
                    <p className="study-plan-rationale" lang={plan.language}>{recommendation.rationale}</p>
                    <div className="study-plan-evidence">
                      <div className="study-plan-evidence-heading"><span>{text('studyPlanAccuracy')}</span><strong>{new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(recommendation.evidence.accuracy)}%</strong></div>
                      <progress className="study-plan-meter" value={recommendation.evidence.accuracy} max={100} aria-label={text('studyPlanAccuracy')} />
                      <span>{text('studyPlanEvidenceCount', { correct: recommendation.evidence.correct, total: recommendation.evidence.total })}</span>
                    </div>
                    <h4 className="study-plan-actions-title">{text('studyPlanActions')}</h4>
                    <ul className="study-plan-actions" lang={plan.language}>
                      {recommendation.actions.map((action, index) => <li key={index}>{action}</li>)}
                    </ul>
                    <a className="text-link" href={recommendation.resource.url} target="_blank" rel="noreferrer">
                      {text('studyPlanResource', { title: recommendation.resource.title })} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </>
      )}
    </section>
  )
}

function studyPlanErrorMessage(locale: Locale, error: unknown) {
  if (!(error instanceof StudyPlanApiError)) return translate(locale, 'studyPlanGenerateError')
  switch (error.code) {
    case 'STUDY_PLAN_HISTORY_EMPTY':
      return translate(locale, 'studyPlanNoHistory')
    case 'STUDY_PLAN_NO_REVIEW_AREAS':
      return translate(locale, 'studyPlanNoWeakAreas')
    case 'STUDY_PLAN_AI_UNAVAILABLE':
    case 'STUDY_PLAN_INVALID_OUTPUT':
      return translate(locale, 'studyPlanGenerateError')
    default:
      return translate(locale, 'studyPlanError')
  }
}

function formatPlanDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(value))
}
