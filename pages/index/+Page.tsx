import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import {
  type CertificationCatalogItem,
  type CertificationGuideResponse,
  type Locale,
} from '../../src/api/certification-contracts'
import { CertificationApiError, loadCertificationCatalog, loadCertificationGuide } from '../../src/api/certifications'
import {
  advancePracticeSimulation,
  cancelSimulation,
  clearSimulationHistory,
  loadCurrentUser,
  loadSimulationHistory,
  revealSimulationAnswer,
  SimulationApiError,
  startSimulation,
  submitSimulationAnswer,
} from '../../src/api/simulations'
import type {
  SimulationAnswerResponse,
  SimulationHistoryItem,
  SimulationMode,
  SimulationQuestion,
  SimulationResult,
  SimulationSnapshot,
} from '../../src/api/simulation-contracts'
import type { CurrentUserResponse } from '../../src/api/contracts'
import { translate } from '../../src/i18n/messages'
import { readLocalePreference, writeLocalePreference } from '../../src/i18n/preferences'
import { QuizScreen, ResultsScreen, simulationErrorMessage } from '../../src/components/SimulationScreens'
import '../../src/styles.css'

type Theme = 'light' | 'dark'
type Screen = 'home' | 'quiz' | 'results'
const topicColors = ['#F900D3', '#00E8FA', '#1DD566', '#FFC700']

export default function Page() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <CertificationApp />
    </QueryClientProvider>
  )
}

function CertificationApp() {
  const queryClient = useQueryClient()
  const [theme, setTheme] = useState<Theme>('light')
  const [locale, setLocale] = useState<Locale>('es')
  const [screen, setScreen] = useState<Screen>('home')
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('practice')
  const [selectedCertificationId, setSelectedCertificationId] = useState('')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [activeSession, setActiveSession] = useState<SimulationSnapshot | null>(null)
  const [sessionQuestions, setSessionQuestions] = useState<SimulationQuestion[]>([])
  const [sessionResult, setSessionResult] = useState<SimulationResult | null>(null)
  const previousUserId = useRef<string | null>(null)
  const userQuery = useQuery({
    queryKey: ['current-user'],
    queryFn: () => loadCurrentUser(),
    staleTime: 60_000,
    retry: false,
  })
  const historyQuery = useQuery({
    queryKey: ['simulation-history', userQuery.data?.id],
    queryFn: () => loadSimulationHistory(),
    enabled: Boolean(userQuery.data?.id && !userQuery.isError),
    retry: false,
  })
  const catalogQuery = useQuery({
    queryKey: ['certification-catalog'],
    queryFn: () => loadCertificationCatalog(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  })
  const catalog = catalogQuery.data ?? []
  const selectedCertification = catalog.find((item) => item.id === selectedCertificationId) ?? catalog[0]
  const guideQuery = useQuery({
    queryKey: ['certification-guide', selectedCertification?.id],
    queryFn: () => loadCertificationGuide(selectedCertification!.id),
    enabled: Boolean(selectedCertification),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: false,
  })
  const guideReady = Boolean(guideQuery.data && !guideQuery.isError && !guideQuery.isFetching)

  useEffect(() => {
    const nextUserId = userQuery.data?.id ?? null
    const previous = previousUserId.current
    if (previous && previous !== nextUserId) {
      queryClient.removeQueries({ queryKey: ['simulation-history', previous] })
    }
    const signedOut = userQuery.isError || (historyQuery.error instanceof SimulationApiError && historyQuery.error.code === 'UNAUTHENTICATED')
    if (signedOut) queryClient.removeQueries({ queryKey: ['simulation-history'] })
    previousUserId.current = nextUserId
    if (!userQuery.isError && historyQuery.error instanceof SimulationApiError && historyQuery.error.code === 'UNAUTHENTICATED') {
      void userQuery.refetch()
    }
  }, [queryClient, userQuery.data?.id, userQuery.isError, userQuery.refetch, historyQuery.error])

  const startMutation = useMutation({
    mutationFn: () => startSimulation(selectedCertification!.id, simulationMode, locale),
    onSuccess: (snapshot) => {
      setActiveSession(snapshot)
      setSessionQuestions(snapshot.currentQuestion ? [snapshot.currentQuestion] : [])
      setSessionResult(null)
      setQuestionIndex(0)
      setScreen('quiz')
    },
    onError: clearHistoryIfUnauthenticated,
  })
  const answerMutation = useMutation({ mutationFn: (input: { questionId: string; answerId: string }) => {
    if (!activeSession) throw new SimulationApiError('SIMULATION_NOT_FOUND')
    return submitSimulationAnswer(activeSession.sessionId, input.questionId, input.answerId)
  } })
  const revealMutation = useMutation({ mutationFn: () => {
    if (!activeSession) throw new SimulationApiError('SIMULATION_NOT_FOUND')
    return revealSimulationAnswer(activeSession.sessionId)
  } })
  const nextMutation = useMutation({ mutationFn: () => {
    if (!activeSession) throw new SimulationApiError('SIMULATION_NOT_FOUND')
    return advancePracticeSimulation(activeSession.sessionId)
  } })
  const clearHistoryMutation = useMutation({
    mutationFn: () => clearSimulationHistory(),
    onSuccess: async () => {
      if (userQuery.data?.id) {
        await queryClient.invalidateQueries({ queryKey: ['simulation-history', userQuery.data.id] })
      }
    },
    onError: clearHistoryIfUnauthenticated,
  })

  function clearHistoryIfUnauthenticated(error: unknown) {
    if (error instanceof SimulationApiError && error.code === 'UNAUTHENTICATED') {
      queryClient.removeQueries({ queryKey: ['simulation-history'] })
      void userQuery.refetch()
    }
  }

  useEffect(() => {
    let savedTheme: string | null = null
    try {
      savedTheme = window.localStorage.getItem('cert-helper-theme')
    } catch {
      // The current theme remains usable if browser storage is unavailable.
    }

    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
      return
    }

    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    let savedLocale: Locale | null = null
    try {
      savedLocale = readLocalePreference(window.localStorage)
    } catch {
      // Spanish remains the default if browser storage is unavailable.
    }
    if (savedLocale) setLocale(savedLocale)
  }, [])

  useEffect(() => {
    document.documentElement.style.colorScheme = theme
    document.documentElement.lang = locale
    document.title = translate(locale, 'pageTitle')
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (favicon) {
      favicon.href = theme === 'dark'
        ? '/assets/logo/wm_compass_rev_wht_rgb_august2024.svg'
        : '/assets/logo/wm_compass_pos_clr_rgb_august2024.svg'
    }
  }, [theme, locale])

  function changeTheme() {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    try {
      window.localStorage.setItem('cert-helper-theme', nextTheme)
    } catch {
      // The selection still applies for this session if browser storage is unavailable.
    }
    setTheme(nextTheme)
  }

  function changeLocale(nextLocale: Locale) {
    try {
      writeLocalePreference(window.localStorage, nextLocale)
    } catch {
      // The selection still applies for this session if browser storage is unavailable.
    }
    setLocale(nextLocale)
  }

  function startSession() {
    if (!selectedCertification || !guideReady || !userQuery.data || userQuery.isError) return
    answerMutation.reset()
    revealMutation.reset()
    nextMutation.reset()
    startMutation.reset()
    startMutation.mutate()
  }

  async function answerQuestion(questionId: string, answerId: string): Promise<SimulationAnswerResponse> {
    const response = await answerMutation.mutateAsync({ questionId, answerId })
    if (response.mode === 'real') {
      if (response.status === 'advanced') {
        setSessionQuestions((questions) => [...questions, response.nextQuestion])
        setQuestionIndex((index) => index + 1)
        setActiveSession((current) => current ? {
          ...current,
          currentIndex: current.currentIndex + 1,
          currentQuestion: response.nextQuestion,
        } : current)
      } else {
        setSessionResult(response.result)
        setScreen('results')
        void queryClient.invalidateQueries({ queryKey: ['simulation-history', userQuery.data?.id] })
      }
    }
    return response
  }

  async function revealAnswer() {
    return revealMutation.mutateAsync()
  }

  async function advanceQuestion() {
    const snapshot = await nextMutation.mutateAsync()
    setActiveSession(snapshot)
    if (snapshot.status === 'completed' && snapshot.result) {
      setSessionResult(snapshot.result)
      setScreen('results')
      void queryClient.invalidateQueries({ queryKey: ['simulation-history', userQuery.data?.id] })
      return snapshot
    }
    if (snapshot.currentQuestion) {
      setSessionQuestions((questions) => questions.length > snapshot.currentIndex
        ? questions
        : [...questions, snapshot.currentQuestion!])
    }
    setQuestionIndex(snapshot.currentIndex)
    return snapshot
  }

  async function exitSession() {
    if (activeSession) {
      try {
        await cancelSimulation(activeSession.sessionId)
      } catch (error) {
        clearHistoryIfUnauthenticated(error)
      }
    }
    setActiveSession(null)
    setSessionQuestions([])
    setSessionResult(null)
    setQuestionIndex(0)
    setScreen('home')
  }

  return (
    <div className="app-shell min-h-screen w-full" data-theme={theme} lang={locale}>
      <Header theme={theme} locale={locale} onThemeChange={changeTheme} onLocaleChange={changeLocale} />

      {catalogQuery.isPending && <LoadingState locale={locale} />}
      {catalogQuery.isError && (
        <ErrorState locale={locale} message={translate(locale, 'catalogError')} onRetry={() => void catalogQuery.refetch()} />
      )}
      {!catalogQuery.isPending && !catalogQuery.isError && catalog.length === 0 && (
        <ErrorState locale={locale} message={translate(locale, 'catalogEmpty')} onRetry={() => void catalogQuery.refetch()} />
      )}
      {!catalogQuery.isPending && !catalogQuery.isError && catalog.length > 0 && selectedCertification && screen === 'home' && (
        <HomeScreen
          locale={locale}
          certification={selectedCertification}
          guide={guideQuery.isError || guideQuery.isFetching ? undefined : guideQuery.data}
          guideLoading={guideQuery.isPending || guideQuery.isFetching}
          guideError={guideQuery.error}
          onGuideRetry={() => void guideQuery.refetch()}
          certifications={catalog}
          selectedId={selectedCertification.id}
          onSelect={setSelectedCertificationId}
          simulationMode={simulationMode}
          onSimulationModeChange={setSimulationMode}
          onStart={startSession}
          user={userQuery.isError ? null : userQuery.data ?? null}
          userLoading={userQuery.isPending}
          userError={userQuery.error ?? null}
          onUserRetry={() => void userQuery.refetch()}
          history={historyQuery.data ?? []}
          historyLoading={historyQuery.isPending && Boolean(userQuery.data) && !userQuery.isError}
          historyError={historyQuery.error ?? clearHistoryMutation.error ?? null}
          onHistoryRetry={() => {
            clearHistoryMutation.reset()
            void historyQuery.refetch()
          }}
          onClearHistory={() => clearHistoryMutation.mutate()}
          clearingHistory={clearHistoryMutation.isPending}
          startingSimulation={startMutation.isPending}
          startError={startMutation.error ?? null}
        />
      )}
      {selectedCertification && activeSession && screen === 'quiz' && (
        <QuizScreen
          locale={activeSession.language}
          certificationName={selectedCertification.name[activeSession.language]}
          domains={guideQuery.data?.domains ?? []}
          questions={sessionQuestions}
          questionIndex={questionIndex}
          simulationMode={activeSession.mode}
          submitting={answerMutation.isPending}
          revealing={revealMutation.isPending}
          advancing={nextMutation.isPending}
          apiError={answerMutation.error ?? revealMutation.error ?? nextMutation.error ?? null}
          onAnswer={answerQuestion}
          onReveal={revealAnswer}
          onNext={advanceQuestion}
          onExit={exitSession}
        />
      )}
      {selectedCertification && sessionResult && screen === 'results' && (
        <ResultsScreen
          locale={activeSession?.language ?? locale}
          certificationName={selectedCertification.name[activeSession?.language ?? locale]}
          guide={guideQuery.data}
          result={sessionResult}
          simulationMode={activeSession?.mode ?? simulationMode}
          restarting={startMutation.isPending}
          startError={startMutation.error ?? null}
          onHome={() => {
            setActiveSession(null)
            setSessionQuestions([])
            setSessionResult(null)
            setScreen('home')
          }}
          onRestart={startSession}
        />
      )}
    </div>
  )
}

function Header({
  theme,
  locale,
  onThemeChange,
  onLocaleChange,
}: {
  theme: Theme
  locale: Locale
  onThemeChange: () => void
  onLocaleChange: (locale: Locale) => void
}) {
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)

  return (
    <header className="site-header">
      <div className="content-width header-inner flex w-full items-center justify-between">
        <div className="brand-lockup">
          <img
            className="brand-logo"
            src={theme === 'dark'
              ? '/assets/logo/wm_h_rev_wht_rgb_august2024.svg'
              : '/assets/logo/wm_h_pos_clr_rgb_august2024.svg'}
            alt={text('brandLabel')}
            width="173"
            height="36"
          />
          <span className="brand-divider" aria-hidden="true" />
          <span className="product-name">CERT HELPER</span>
        </div>
        <div className="header-actions">
          <span className="local-badge"><span aria-hidden="true" /> {text('localBadge')}</span>
          <div className="locale-switch" role="group" aria-label={text('languageLabel')}>
            {(['es', 'en'] as const).map((option) => (
              <button
                key={option}
                className={`locale-button ${locale === option ? 'is-active' : ''}`}
                type="button"
                onClick={() => onLocaleChange(option)}
                aria-pressed={locale === option}
                aria-label={text(option === 'es' ? 'languageSpanish' : 'languageEnglish')}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            className="theme-button"
            type="button"
            onClick={onThemeChange}
            aria-pressed={theme === 'dark'}
            aria-label={theme === 'dark' ? text('themeLight') : text('themeDark')}
          >
            {theme === 'dark' ? text('themeLight') : text('themeDark')}
          </button>
        </div>
      </div>
    </header>
  )
}

function LoadingState({ locale }: { locale: Locale }) {
  const text = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  return (
    <main className="content-width state-page" aria-live="polite">
      <p className="eyebrow">{text('loadingCatalogEyebrow')}</p>
      <h1>{text('loadingCatalogTitle')}</h1>
      <p className="body-copy">{text('loadingCatalogBody')}</p>
    </main>
  )
}

function ErrorState({ locale, message, onRetry }: { locale: Locale; message: string; onRetry: () => void }) {
  const text = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  return (
    <main className="content-width state-page" role="alert">
      <p className="eyebrow">{text('errorEyebrow')}</p>
      <h1>{text('errorTitle')}</h1>
      <p className="body-copy">{message}</p>
      <button className="button button-primary" type="button" onClick={onRetry}>{text('retry')}</button>
    </main>
  )
}

function HomeScreen({
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
  onStart,
  user,
  userLoading,
  userError,
  onUserRetry,
  history,
  historyLoading,
  historyError,
  onHistoryRetry,
  onClearHistory,
  clearingHistory,
  startingSimulation,
  startError,
}: {
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
  onStart: () => void
  user: CurrentUserResponse['user'] | null
  userLoading: boolean
  userError: unknown | null
  onUserRetry: () => void
  history: SimulationHistoryItem[]
  historyLoading: boolean
  historyError: unknown | null
  onHistoryRetry: () => void
  onClearHistory: () => void
  clearingHistory: boolean
  startingSimulation: boolean
  startError: unknown | null
}) {
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)
  const domains = guide?.domains ?? []
  const sourceLabels = {
    'exam-guide': text('sourceExamGuide'),
    certification: text('sourceCertification'),
    'learning-path': text('sourceLearningPath'),
  }
  const canStart = Boolean(guide && user && !userLoading && !userError && !guideLoading && !guideError && !startingSimulation)
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
          <label className="field-label" htmlFor="certification-select">{text('certificationLabel')}</label>
          <select
            id="certification-select"
            className="certification-select"
            value={selectedId}
            onChange={(event) => onSelect(event.currentTarget.value)}
          >
            {certifications.map((item) => <option key={item.id} value={item.id}>{item.name[locale]}</option>)}
          </select>
          <h2 id="certification-title">{certification.name[locale]}</h2>
          {user && <div className="user-identity">
            {user.avatar && <img src={user.avatar} alt="" width="32" height="32" />}
            <span>{user.email ?? user.id}</span>
          </div>}
          <div className="panel-stats">
            <div><strong>20</strong><span>{text('questionsLabel')}</span></div>
            <div><strong>{guideLoading || guideError ? '—' : domains.length}</strong><span>{text('domainsLabel')}</span></div>
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
          <button className="button button-inverse" type="button" onClick={onStart} disabled={!canStart}>
            {startingSimulation ? text('startingSimulation') : text('startSession')} <span aria-hidden="true">→</span>
          </button>
          <p className={`panel-note ${guideError || userError || startError ? 'has-error' : ''}`} role={guideError || userError || startError ? 'alert' : 'status'} aria-live="polite">{startStatus}</p>
          {(userError || (!userLoading && !user)) && <button className="button button-text guide-retry" type="button" onClick={onUserRetry}>{text('retry')}</button>}
          {Boolean(guideError) && <button className="button button-text guide-retry" type="button" onClick={onGuideRetry}>{text('guideRetry')}</button>}
          {guide && !guideError && (
            <div className="guide-freshness">
              <strong>{text('guideVersion', { version: guide.version })}</strong>
              <span>{text('sourceChecked')}: {formatDate(guide.freshness.sourceCheckedAt, locale)}</span>
              <span>{text('aiRefreshed')}: {formatDate(guide.freshness.aiRefreshedAt, locale)}</span>
            </div>
          )}
        </section>
      </section>

      <SimulationHistory
        locale={locale}
        available={Boolean(user)}
        certifications={certifications}
        currentGuide={guide}
        history={history}
        loading={historyLoading}
        error={historyError}
        clearing={clearingHistory}
        onRetry={onHistoryRetry}
        onClear={() => {
          if (window.confirm(text('clearHistoryConfirm'))) onClearHistory()
        }}
      />

      <section className="topics-section" aria-labelledby="topics-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{text('examMapEyebrow')}</p>
            <h2 id="topics-title">{text('examMapTitle')}</h2>
          </div>
          <a className="text-link" href={certification.sources.find((source) => source.kind === 'exam-guide')?.url} target="_blank" rel="noreferrer">
            {text('officialGuide')} <span aria-hidden="true">↗</span>
          </a>
        </div>

        {domains.length > 0 ? (
          <div className="topic-grid">
            {domains.map((domain, index) => (
              <TopicCard
                key={domain.id}
                domain={domain}
                locale={locale}
                accent={topicColors[index % topicColors.length] ?? topicColors[0]}
              />
            ))}
          </div>
        ) : <p className="guide-empty">{text('noTopics')}</p>}

        {guide && <section className="study-path-section" aria-labelledby="study-path-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{text('studyPathEyebrow')}</p>
              <h2 id="study-path-title">{text('studyPathTitle')}</h2>
              <p className="section-intro">{text('studyPathIntro')}</p>
            </div>
          </div>
          {guide.studyPath.length > 0 ? <ol className="study-path-list">
            {guide.studyPath.map((step, index) => (
              <li className="study-path-card" key={step.id}>
                <span className="study-path-index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p className="eyebrow">{text('step', { number: index + 1 })}</p>
                  <h3>{step.title[locale]}</h3>
                  <p>{step.description[locale]}</p>
                  <div className="study-path-domains">
                    <span>{text('domainsInStep')}:</span>
                    {step.domainIds.map((domainId) => guide.domains.find((domain) => domain.id === domainId)?.name[locale])
                      .filter((name): name is string => Boolean(name))
                      .map((name) => <span className="study-path-chip" key={name}>{name}</span>)}
                  </div>
                  <a className="text-link" href={step.url} target="_blank" rel="noreferrer">
                    {text('openResource')} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </li>
            ))}
          </ol> : <p className="guide-empty">{text('noStudyPath')}</p>}
        </section>}

        {guide && <section className="official-sources" aria-labelledby="official-sources-title">
          <h2 id="official-sources-title">{text('officialSourcesTitle')}</h2>
          <ul>
            {guide.sources.map((source) => (
              <li key={source.kind}>
                <span>{sourceLabels[source.kind]}</span>
                <a className="text-link" href={source.url} target="_blank" rel="noreferrer">
                  {text('openResource')} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>}
      </section>

      <footer className="page-footer">
        <span>{text('originalQuestions')}</span>
        <span>{text('notAffiliated')}</span>
      </footer>
    </main>
  )
}

function SimulationHistory({
  locale,
  available,
  certifications,
  currentGuide,
  history,
  loading,
  error,
  clearing,
  onRetry,
  onClear,
}: {
  locale: Locale
  available: boolean
  certifications: CertificationCatalogItem[]
  currentGuide: CertificationGuideResponse | undefined
  history: SimulationHistoryItem[]
  loading: boolean
  error: unknown | null
  clearing: boolean
  onRetry: () => void
  onClear: () => void
}) {
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)

  return (
    <section className="history-section" aria-labelledby="history-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{text('historyEyebrow')}</p>
          <h2 id="history-title">{text('historyTitle')}</h2>
          <p className="section-intro">{text('historyDescription')}</p>
        </div>
        {available && history.length > 0 && <button className="button button-text" type="button" onClick={onClear} disabled={clearing}>
          {clearing ? text('clearingHistory') : text('clearHistory')}
        </button>}
      </div>
      {!available ? null : loading ? (
        <p className="history-state" role="status">{text('historyLoading')}</p>
      ) : error ? (
        <div className="history-state history-error" role="alert">
          <p>{text('historyError')}</p>
          <button className="button button-secondary" type="button" onClick={onRetry}>{text('retry')}</button>
        </div>
      ) : history.length === 0 ? (
        <p className="history-state">{text('historyEmpty')}</p>
      ) : (
        <ol className="history-list">
          {history.map((session) => {
            const certification = certifications.find(({ id }) => id === session.certificationId)
            const title = certification?.name[locale] ?? session.certificationId
            const guide = currentGuide?.certification.id === session.certificationId ? currentGuide : undefined
            const weakDomains = session.domainBreakdown.filter(({ correct, total }) => correct < total)
            return (
              <li className="history-card" key={session.id}>
                <div className="history-card-heading">
                  <div>
                    <h3>{title}</h3>
                    <p>{text(session.mode === 'real' ? 'historyRealMode' : 'historyPracticeMode')} · {formatDate(session.completedAt, locale)}</p>
                  </div>
                  <strong className="history-score">{session.score}%</strong>
                </div>
                <p className="history-score-detail">{text('correctOfTotal', { correct: session.correctAnswers, total: session.totalQuestions })}</p>
                <div className="history-meta">
                  <span>{text('historyGuideVersion', { version: session.guideVersion })}</span>
                  <span>{session.language.toUpperCase()}</span>
                </div>
                {weakDomains.length > 0 && <div className="history-weak-domains">
                  <span>{text('historyReviewDomains')}</span>
                  <div className="review-chips">
                    {weakDomains.map((item) => {
                      const domain = guide?.domains.find(({ id }) => id === item.id)
                      return <span className="review-chip" key={item.id}>{domain?.name[locale] ?? item.id} · {item.correct}/{item.total}</span>
                    })}
                  </div>
                </div>}
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

function TopicCard({
  domain,
  locale,
  accent,
}: {
  domain: CertificationGuideResponse['domains'][number]
  locale: Locale
  accent: string
}) {
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)

  return (
    <article className="topic-card">
      <div className="topic-card-top">
        <span className="topic-weight">{domain.weight}%</span>
        <span className="topic-count">{text('coveredTopicsCount', { count: domain.topics.length })}</span>
      </div>
      <h3>{domain.name[locale]}</h3>
      <p className="topic-description">{domain.description[locale]}</p>
      <div className="topic-meter" aria-hidden="true">
        <span style={{ width: `${domain.weight}%`, backgroundColor: accent }} />
      </div>
      <p>{text('approximateExamWeight')}</p>
      <ul className="domain-topic-list">
        {domain.topics.map((topic) => <li key={topic.id}>{topic.name[locale]}</li>)}
      </ul>
    </article>
  )
}

function guideErrorMessage(locale: Locale, error: unknown) {
  if (error instanceof CertificationApiError && error.code === 'GUIDE_REFRESH_IN_PROGRESS') {
    return translate(locale, 'guideRefreshing')
  }
  return translate(locale, 'guideError')
}

function profileErrorMessage(locale: Locale, error: unknown) {
  if (!error || (error instanceof SimulationApiError && error.code === 'UNAUTHENTICATED')) {
    return translate(locale, 'authRequired')
  }
  return translate(locale, 'profileError')
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es' : 'en-US', { dateStyle: 'medium' }).format(new Date(value))
}
