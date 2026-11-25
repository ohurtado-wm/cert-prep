import { useEffect, useState } from 'react'
import type { CertificationCatalogItem, CertificationGuideResponse, Locale } from '@cert-prep/contracts/certification-contracts'
import type { CurrentUserResponse } from '@cert-prep/contracts/contracts'
import type { SimulationHistoryItem, SimulationMode, SimulationSnapshot, PrintableSimulationQuestion } from '@cert-prep/contracts/simulation-contracts'
import type { WeakTopicAnalysisResponse } from '@cert-prep/contracts/weak-topic-contracts'
import type { StudyPlan } from '@cert-prep/contracts/study-plan-contracts'
import { translate } from '../i18n/messages'
import { StudyPlanPanel } from './StudyPlanPanel'
import { SimulationHistory } from './SimulationHistory'
import { WeakTopicPractice } from './WeakTopicPractice'
import { ResourcesScreen } from './ResourcesScreen'
import { simulationErrorMessage } from './SimulationScreens'
import { commonErrorMessage, guideErrorMessage, profileErrorMessage } from '../i18n/error-messages'

export type View = 'dashboard' | 'progress' | 'study-plan' | 'resources' | 'settings'

export function HomeScreen({
  view,
  onDashboard,
  reminderClosed,
  onCloseReminder,
  locale,
  certification,
  guide,
  guideLoading,
  guideError,
  onGuideRetry,
  certifications,
  selectedId,
  onSelect,
  simulationMode,
  onSimulationModeChange,
  advancedPractice,
  onAdvancedPracticeChange,
  onStart,
  user,
  userLoading,
  userError,
  onUserRetry,
  history,
  historyLoading,
  historyError,
  pendingSession,
  pendingSessionLoading,
  pendingSessionError,
  discardSessionError,
  onPendingSessionRetry,
  onResumeSession,
  onResumeHistory,
  completedSessionAvailable,
  completedPrintableQuestions,
  onViewCompletedSession,
  onDiscardSession,
  discardingPendingSession,
  weakTopicAnalysis,
  weakTopicsLoading,
  weakTopicsError,
  weakTopicStartError,
  onWeakTopicsRetry,
  onStartWeakTopics,
  onHistoryRetry,
  onClearHistory,
  clearingHistory,
  studyPlan,
  studyPlanLoading,
  studyPlanError,
  generatingStudyPlan,
  studyPlanGenerationError,
  onGenerateStudyPlan,
  onRetryStudyPlan,
  startingSimulation,
  startError,
}: {
  view: Exclude<View, 'settings'>
  onDashboard: () => void
  reminderClosed: boolean
  onCloseReminder: () => void
  locale: Locale
  certification: CertificationCatalogItem
  guide: CertificationGuideResponse | undefined
  guideLoading: boolean
  guideError: unknown
  onGuideRetry: () => void
  certifications: CertificationCatalogItem[]
  selectedId: string
  onSelect: (id: string) => void
  simulationMode: SimulationMode
  onSimulationModeChange: (mode: SimulationMode) => void
  advancedPractice: boolean
  onAdvancedPracticeChange: (enabled: boolean) => void
  onStart: () => void
  user: CurrentUserResponse['user'] | null
  userLoading: boolean
  userError: unknown | null
  onUserRetry: () => void
  history: SimulationHistoryItem[]
  historyLoading: boolean
  historyError: unknown | null
  pendingSession: SimulationSnapshot | null
  pendingSessionLoading: boolean
  pendingSessionError: unknown | null
  discardSessionError: unknown | null
  onPendingSessionRetry: () => void
  onResumeSession: (snapshot: SimulationSnapshot) => void
  onResumeHistory: (snapshot: SimulationSnapshot) => Promise<void>
  completedSessionAvailable: boolean
  completedPrintableQuestions: PrintableSimulationQuestion[]
  onViewCompletedSession: () => void
  onDiscardSession: (sessionId: string) => void
  discardingPendingSession: boolean
  weakTopicAnalysis: WeakTopicAnalysisResponse | undefined
  weakTopicsLoading: boolean
  weakTopicsError: unknown
  weakTopicStartError: unknown | null
  onWeakTopicsRetry: () => void
  onStartWeakTopics: () => void
  onHistoryRetry: () => void
  onClearHistory: () => void
  clearingHistory: boolean
  studyPlan: StudyPlan | null | undefined
  studyPlanLoading: boolean
  studyPlanError: unknown | null
  generatingStudyPlan: boolean
  studyPlanGenerationError: unknown | null
  onGenerateStudyPlan: () => void
  onRetryStudyPlan: () => void
  startingSimulation: boolean
  startError: unknown | null
}) {
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)
  const domains = guide?.domains ?? []
  const providers = [...new Set(certifications.map((item) => item.provider))]
  const providerNames: Record<CertificationCatalogItem['provider'], string> = {
    'google-cloud': 'Google Cloud',
    'microsoft-azure': 'Microsoft Azure',
  }
  const providerCertifications = certifications.filter((item) => item.provider === certification.provider)
  const progressEmpty = Boolean(user) && !historyLoading && !historyError && history.length === 0
  function selectProvider(provider: string) {
    const first = certifications.find((item) => item.provider === provider)
    if (first && first.provider !== certification.provider) onSelect(first.id)
  }
  const [guideLoadingSeconds, setGuideLoadingSeconds] = useState(0)

  useEffect(() => {
    if (!guideLoading) {
      setGuideLoadingSeconds(0)
      return
    }

    const startedAt = Date.now()
    const interval = window.setInterval(() => {
      setGuideLoadingSeconds(Math.floor((Date.now() - startedAt) / 1_000))
    }, 1_000)
    return () => window.clearInterval(interval)
  }, [guideLoading])

  const canStart = Boolean(guide && user && !userLoading && !userError && !guideLoading && !guideError && !startingSimulation && !pendingSessionLoading && !pendingSessionError)
  const startStatus = userLoading
    ? text('profileLoading')
    : userError || !user
      ? profileErrorMessage(locale, userError)
      : startingSimulation
        ? text('startingSimulation')
        : startError
          ? simulationErrorMessage(locale, startError)
          : guideLoading
            ? text('guideLoading')
            : guideError
              ? guideErrorMessage(locale, guideError)
              : !guide
                ? text('guideError')
                : simulationMode === 'real'
                  ? text('noteReal')
                  : text('notePractice')

  return (
    <main className="content-width page-content">
      {view === 'dashboard' && <>
      {pendingSessionLoading && <p className="pending-session-state" role="status">{text('pendingSessionLoading')}</p>}
      {Boolean(pendingSessionError) && (
        <div className="pending-session-state pending-session-error" role="alert">
          <span>{commonErrorMessage(locale, pendingSessionError) ?? text('pendingSessionError')}</span>
          <button className="button button-text" type="button" onClick={onPendingSessionRetry}>{text('retry')}</button>
        </div>
      )}
      {pendingSession && !reminderClosed && (
        <section className="pending-session-card" aria-labelledby="pending-session-title">
          <div className="pending-session-copy">
            <h2 id="pending-session-title">{text('pendingSessionTitle')}</h2>
            <p className="pending-session-meta">
              {certifications.find(({ id }) => id === pendingSession.certificationId)?.name[locale] ?? pendingSession.certificationId}
              {' · '}
              {text(pendingSession.mode === 'real' ? 'historyRealMode' : 'historyPracticeMode')}
              {' · '}{text('pendingSessionProgress', { current: pendingSession.currentIndex + 1, total: pendingSession.questionCount })}
              {' · '}{formatDate(pendingSession.createdAt, locale)}
            </p>
          </div>
          <div className="pending-session-actions">
            <button className="button button-text pending-session-dismiss" type="button" onClick={onCloseReminder}>{text('dismissReminder')}</button>
            <button className="button button-primary" type="button" onClick={() => onResumeSession(pendingSession)}>{text('continueSession')}</button>
          </div>
        </section>
      )}

      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{text('heroEyebrow')}</p>
          <h1>{text('heroTitle')}</h1>
          <p className="hero-description">{text('heroDescription')}</p>
          <div className="hero-meta">
            <span>{text('metaLearn')}</span>
            <span className="meta-separator" aria-hidden="true" />
            <span>{text('metaUntimed')}</span>
          </div>
        </div>

        <section className="certification-panel" aria-labelledby="certification-title">
          <p className="panel-eyebrow">{text('nextCertification')}</p>
          <label className="field-label" htmlFor="provider-select">{text('providerLabel')}</label>
          <select
            id="provider-select"
            className="certification-select provider-select"
            value={certification.provider}
            disabled={guideLoading || startingSimulation}
            onChange={(event) => selectProvider(event.currentTarget.value)}
          >
            {providers.map((provider) => <option key={provider} value={provider}>{providerNames[provider]}</option>)}
          </select>
          <label className="field-label" htmlFor="certification-select">{text('certificationLabel')}</label>
          <select
            id="certification-select"
            className="certification-select"
            value={selectedId}
            disabled={guideLoading || startingSimulation}
            onChange={(event) => onSelect(event.currentTarget.value)}
          >
            {providerCertifications.map((item) => <option key={item.id} value={item.id}>{item.name[locale]}</option>)}
          </select>
          <h2 id="certification-title">{certification.name[locale]}</h2>
          <div className="panel-stats">
            <div><strong>20</strong><span>{text('questionsLabel')}</span></div>
            <div><strong>{guideLoading || guideError ? '—' : domains.length}</strong><span>{text('domainsLabel', { count: guideLoading || guideError ? 0 : domains.length })}</span></div>
            <div><strong>{locale.toUpperCase()}</strong><span>{text('languageLabel')}</span></div>
          </div>
          <label className="simulation-mode-control">
            <input
              type="checkbox"
              checked={simulationMode === 'real'}
              onChange={(event) => onSimulationModeChange(event.currentTarget.checked ? 'real' : 'practice')}
            />
            <span>
              <strong>{text('realMode')}</strong>
              <small>{text('realModeHelp')}</small>
            </span>
          </label>
          {certification.id === 'gcp-professional-cloud-developer' && (
            <div className={`advanced-mode-reveal${simulationMode === 'real' ? ' is-open' : ''}`} inert={simulationMode !== 'real'} aria-hidden={simulationMode !== 'real'}>
              <div className="advanced-mode-reveal-content">
                <div className="advanced-mode-control">
                  <label className="simulation-mode-control">
                    <input type="checkbox" checked={advancedPractice} disabled={startingSimulation} onChange={(event) => onAdvancedPracticeChange(event.currentTarget.checked)} />
                    <span><strong>{text('advancedMode')}</strong><small>{text('advancedModeHelp')}</small></span>
                  </label>
                  {simulationMode === 'real' && <details className="advanced-source-info" onMouseEnter={(event) => {
                    if (window.matchMedia('(hover: hover)').matches) event.currentTarget.open = true
                  }} onMouseLeave={(event) => {
                    if (window.matchMedia('(hover: hover)').matches && !event.currentTarget.contains(document.activeElement)) event.currentTarget.open = false
                  }} onKeyDown={(event) => {
                    if (event.key === 'Escape' && event.currentTarget.open) {
                      event.currentTarget.open = false
                      event.currentTarget.querySelector('summary')?.focus()
                    }
                  }}>
                    <summary aria-label={text('advancedSourceInfo')}><span aria-hidden="true">i</span></summary>
                    <div className="advanced-source-notice">
                      <p>{text('advancedSourceNotice')}</p><p>{text('advancedLanguageNotice')}</p>
                      <p>{text('advancedSourceCredit')} · <a href="https://www.udemy.com/course/google-cloud-platform-professional-cloud-developer-practice-exams/" target="_blank" rel="noreferrer">{text('advancedCourseLink')}</a></p>
                    </div>
                  </details>}
                </div>
              </div>
            </div>
          )}
          <button className="button button-inverse" type="button" onClick={onStart} disabled={!canStart}>
            {startingSimulation ? text('startingSimulation') : text('startSession')} <span aria-hidden="true">→</span>
          </button>
          {guideLoading ? (
            <div className="guide-loading" role="status" aria-live="polite" aria-busy="true">
              <div className="guide-loading-heading">
                <span className="guide-loading-spinner" aria-hidden="true" />
                <span key={guideLoadingSeconds < 25 ? 'initial' : 'taking-longer'} className="guide-loading-message">
                  {text(guideLoadingSeconds < 25 ? 'guideLoading' : 'guideLoadingSlow')}
                </span>
              </div>
              <p className="guide-loading-detail">{text('guideLoadingDetail')}</p>
              {guideLoadingSeconds > 0 && (
                <span className="guide-loading-elapsed" aria-hidden="true">
                  {text('guideLoadingElapsed', { seconds: guideLoadingSeconds })}
                </span>
              )}
              <div className="guide-loading-track" aria-hidden="true"><span /></div>
            </div>
          ) : (
            <p className={`panel-note ${guideError || userError || startError ? 'has-error' : ''}`} role={guideError || userError || startError ? 'alert' : 'status'} aria-live="polite"><span key={startStatus} className="panel-note-text">{startStatus}</span></p>
          )}
          {(userError || (!userLoading && !user)) && <button className="button button-text guide-retry" type="button" onClick={onUserRetry}>{text('retry')}</button>}
          {Boolean(guideError) && <button className="button button-text guide-retry" type="button" onClick={onGuideRetry}>{text('guideRetry')}</button>}
          {/* {guide && !guideError && (
            <div className="guide-freshness">
              <strong>{text('guideVersion', { version: guide.version })}</strong>
              <span>{text('aiRefreshed')}: {formatDate(guide.freshness.aiRefreshedAt, locale)}</span>
              {guide.freshness.sourceCheckedAt && (
                <span>{text('guideSourcesChecked')}: {formatDate(guide.freshness.sourceCheckedAt, locale)}</span>
              )}
              <AiTokenUsage locale={locale} usage={guide.aiUsage} compact />
            </div>
          )} */}
        </section>
      </section>

      </>}
      {view !== 'dashboard' && <><h1 className="view-title">{text(view === 'progress' ? 'navProgress' : view === 'study-plan' ? 'navStudyPlan' : 'navResources')}</h1><div className="view-heading">
        <label className="field-label" htmlFor="view-provider-select">{text('providerLabel')}</label>
        <select id="view-provider-select" className="view-certification-select" value={certification.provider} disabled={guideLoading || startingSimulation} onChange={(event) => selectProvider(event.currentTarget.value)}>{providers.map(provider => <option key={provider} value={provider}>{providerNames[provider]}</option>)}</select>
        <label className="field-label" htmlFor="view-certification-select">{text('certificationLabel')}</label>
        <select id="view-certification-select" className="view-certification-select" value={selectedId} disabled={guideLoading || startingSimulation} onChange={(event) => onSelect(event.currentTarget.value)}>{providerCertifications.map(item => <option key={item.id} value={item.id}>{item.name[locale]}</option>)}</select>
      </div></>}
      {view === 'progress' && <>
      {!user && <div className="history-state" role="status"><p>{userLoading ? text('profileLoading') : profileErrorMessage(locale, userError)}</p>{!userLoading && <button className="button button-secondary" type="button" onClick={onUserRetry}>{text('retry')}</button>}</div>}
      {user && (guideLoading || guideError) && <div className="history-state" role="status"><p>{guideError ? guideErrorMessage(locale, guideError) : text('guideLoading')}</p>{Boolean(guideError) && <button className="button button-secondary" type="button" onClick={onGuideRetry}>{text('guideRetry')}</button>}</div>}
      {user && <SimulationHistory
        locale={locale}
        certification={certification}
        certifications={certifications}
        currentGuide={guide}
        history={history}
        loading={historyLoading}
        error={historyError}
        clearing={clearingHistory}
        pendingSession={pendingSession}
        pendingLoading={pendingSessionLoading}
        pendingError={pendingSessionError}
        onRetry={onHistoryRetry}
        onRetryPending={onPendingSessionRetry}
        onResume={onResumeHistory}
        completedSessionAvailable={completedSessionAvailable}
        completedPrintableQuestions={completedPrintableQuestions}
        onViewCompletedSession={onViewCompletedSession}
        onDiscard={onDiscardSession}
        discarding={discardingPendingSession}
        discardError={discardSessionError}
        onDashboard={onDashboard}
        onClear={() => {
          if (window.confirm(text('clearHistoryConfirm'))) onClearHistory()
        }}
      />}

      {user && !progressEmpty && !historyLoading && !historyError && <WeakTopicPractice locale={locale} domains={domains} weakTopicAnalysis={weakTopicAnalysis} weakTopicsLoading={weakTopicsLoading} weakTopicsError={weakTopicsError} weakTopicStartError={weakTopicStartError} onWeakTopicsRetry={onWeakTopicsRetry} simulationMode={simulationMode} startingSimulation={startingSimulation} onSimulationModeChange={onSimulationModeChange} onStartWeakTopics={onStartWeakTopics} canStart={canStart} />}

      </>}
      {view === 'study-plan' && progressEmpty && (
        <section className="progress-empty" aria-labelledby="study-plan-empty-title">
          <p className="eyebrow">{text('studyPlanEyebrow')}</p>
          <h2 id="study-plan-empty-title">{text('studyPlanEmptyTitle')}</h2>
          <p>{text('studyPlanEmptyDescription', { certification: certification.name[locale] })}</p>
          <p className="progress-empty-next">{text(pendingSession?.certificationId === certification.id ? 'progressEmptyPending' : 'progressEmptyNext')}</p>
          {pendingSession?.certificationId === certification.id ? (
            <button className="button button-primary" type="button" onClick={() => onResumeSession(pendingSession)}>{text('continueSession')} <span aria-hidden="true">→</span></button>
          ) : (
            <button className="button button-primary" type="button" onClick={onDashboard}>{text('progressGoHome')} <span aria-hidden="true">→</span></button>
          )}
        </section>
      )}
      {view === 'study-plan' && !progressEmpty && <StudyPlanPanel
        locale={locale}
        certificationName={certification.name[locale]}
        available={Boolean(user)}
        historyCount={history.filter((session) => session.certificationId === certification.id).length}
        historyLoading={historyLoading}
        historyError={historyError}
        onRetryHistory={onHistoryRetry}
        guideReady={Boolean(guide && !guideLoading && !guideError)}
        guideLoading={guideLoading}
        guideError={guideError}
        onRetryGuide={onGuideRetry}
        plan={studyPlan}
        planLoading={studyPlanLoading}
        planError={studyPlanError}
        generating={generatingStudyPlan}
        generationError={studyPlanGenerationError}
        onRetry={onRetryStudyPlan}
        onGenerate={onGenerateStudyPlan}
      />}
      {view === 'study-plan' && !user && <p role="status">{userLoading ? text('profileLoading') : profileErrorMessage(locale, userError)}</p>}

      {view === 'resources' && <ResourcesScreen locale={locale} certification={certification} guide={guide} guideLoading={guideLoading} guideError={guideError} onGuideRetry={onGuideRetry} />}

      <footer className="page-footer">
        <span>{text('originalQuestions')}</span>
        <span>{text('notAffiliated')}</span>
      </footer>
    </main>
  )
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es' : 'en-US', { dateStyle: 'medium' }).format(new Date(value))
}

