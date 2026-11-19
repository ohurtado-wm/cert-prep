import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import {
  type CertificationCatalogItem,
  type CertificationGuideResponse,
  type Locale,
} from '@cert-prep/contracts/certification-contracts'
import { CertificationApiError, loadCertificationCatalog, loadCertificationGuide } from '../../src/api/certifications'
import {
  advancePracticeSimulation,
  cancelSimulation,
  clearSimulationHistory,
  loadCurrentUser,
  loadActiveSimulation,
  loadSimulationHistory,
  loadWeakTopicAnalysis,
  revealSimulationAnswer,
  SimulationApiError,
  startSimulation,
  startWeakTopicSimulation,
  submitSimulationAnswer,
} from '../../src/api/simulations'
import type {
  SimulationAnswerResponse,
  SimulationHistoryItem,
  SimulationMode,
  PrintableSimulationQuestion,
  SimulationResult,
  SimulationSnapshot,
} from '@cert-prep/contracts/simulation-contracts'
import type { WeakTopicAnalysisResponse } from '@cert-prep/contracts/weak-topic-contracts'
import type { CurrentUserResponse } from '@cert-prep/contracts/contracts'
import { translate } from '../../src/i18n/messages'
import { observeThemePreference, readInitialPreferences, saveInitialPreferences, writeLocalePreference, writeThemePreference, type Theme, type ThemePreference } from '../../src/i18n/preferences'
import { StudyPlanPanel } from '../../src/components/StudyPlanPanel'
import { SimulationHistory } from '../../src/components/SimulationHistory'
import { AccountAvatar } from '../../src/components/AccountAvatar'
import { GuideDescription } from '../../src/components/GuideDescription'
import { isCurrentRealAnswer, requireMatchingActiveSession } from '../../src/data/active-session'
import { getOwnedCompletedSession, type CompletedSessionView } from '../../src/data/completed-session'
import { hasIdentityChanged, isConfirmedSignOut } from '../../src/data/identity'
import { InitialPreferencesDialog } from '../../src/components/InitialPreferencesDialog'
import { generateStudyPlan, loadLatestStudyPlan, StudyPlanApiError } from '../../src/api/study-plans'
import type { StudyPlan } from '@cert-prep/contracts/study-plan-contracts'
import { QuizScreen, ResultsScreen, simulationErrorMessage } from '../../src/components/SimulationScreens'
import '../../src/styles.css'

type Screen = 'home' | 'quiz' | 'results'
type View = 'dashboard' | 'progress' | 'study-plan' | 'resources' | 'settings'
const views: View[] = ['dashboard', 'progress', 'study-plan', 'resources', 'settings']
const GUIDE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1_000

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
  const [themePreference, setThemePreference] = useState<ThemePreference | null>(null)
  const [locale, setLocale] = useState<Locale>('es')
  const [initialPreferences, setInitialPreferences] = useState<'checking' | 'required' | 'ready'>('checking')
  const [preferencesNotSaved, setPreferencesNotSaved] = useState(false)
  const focusAfterConfirmation = useRef(false)
  const [screen, setScreen] = useState<Screen>('home')
  const [view, setView] = useState<View>('dashboard')
  const [reminderClosed, setReminderClosed] = useState(false)
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('practice')
  const [selectedCertificationId, setSelectedCertificationId] = useState('')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [activeSession, setActiveSession] = useState<SimulationSnapshot | null>(null)
  const [simulationLoadingSeconds, setSimulationLoadingSeconds] = useState(0)
  const [sessionResult, setSessionResult] = useState<SimulationResult | null>(null)
  const [printableQuestions, setPrintableQuestions] = useState<PrintableSimulationQuestion[]>([])
  const [completedSession, setCompletedSession] = useState<CompletedSessionView | null>(null)
  const previousUserId = useRef<string | null>(null)
  const userQuery = useQuery({
    queryKey: ['current-user'],
    queryFn: () => loadCurrentUser(),
    enabled: initialPreferences === 'ready',
    staleTime: 60_000,
    retry: false,
  })
  const activeSimulationQuery = useQuery({
    queryKey: ['active-simulation', userQuery.data?.id],
    queryFn: () => loadActiveSimulation(),
    enabled: Boolean(initialPreferences === 'ready' && userQuery.data?.id && !userQuery.isError),
    retry: false,
  })
  const catalogQuery = useQuery({
    queryKey: ['certification-catalog'],
    queryFn: () => loadCertificationCatalog(),
    enabled: initialPreferences === 'ready',
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  })
  const catalog = catalogQuery.data ?? []
  const selectedCertification = catalog.find((item) => item.id === selectedCertificationId) ?? catalog[0]
  const historyQuery = useQuery({
    queryKey: ['simulation-history', userQuery.data?.id, selectedCertification?.id],
    queryFn: () => loadSimulationHistory(selectedCertification!.id),
    enabled: Boolean(initialPreferences === 'ready' && userQuery.data?.id && selectedCertification && !userQuery.isError),
    retry: false,
  })
  const activeSessionCertification = activeSession
    ? catalog.find((item) => item.id === activeSession.certificationId)
    : undefined
  const weakTopicsQuery = useQuery({
    queryKey: ['weak-topic-analysis', userQuery.data?.id, selectedCertification?.id],
    queryFn: () => loadWeakTopicAnalysis(selectedCertification!.id),
    enabled: Boolean(initialPreferences === 'ready' && userQuery.data?.id && selectedCertification && !userQuery.isError),
    retry: false,
  })
  const studyPlanQuery = useQuery({
    queryKey: ['study-plan-latest', userQuery.data?.id, selectedCertification?.id],
    queryFn: () => loadLatestStudyPlan(selectedCertification!.id),
    enabled: Boolean(initialPreferences === 'ready' && userQuery.data?.id && !userQuery.isError && selectedCertification),
    retry: false,
  })
  const confirmedSignedOut = isConfirmedSignOut(userQuery.error, historyQuery.error, activeSimulationQuery.error, studyPlanQuery.error)
  const progressContext = useRef({ userId: userQuery.data?.id, authenticated: !confirmedSignedOut, certificationId: selectedCertification?.id, activeSessionId: activeSession?.sessionId, questionId: activeSession?.currentQuestion?.id, questionIndex: activeSession?.currentIndex, view, screen })
  progressContext.current = { userId: userQuery.data?.id, authenticated: !confirmedSignedOut, certificationId: selectedCertification?.id, activeSessionId: activeSession?.sessionId, questionId: activeSession?.currentQuestion?.id, questionIndex: activeSession?.currentIndex, view, screen }
  const ownedCompletedSession = getOwnedCompletedSession(completedSession, confirmedSignedOut || userQuery.isError ? undefined : userQuery.data?.id, selectedCertification?.id)
  const guideQuery = useQuery({
    queryKey: ['certification-guide', selectedCertification?.id],
    queryFn: () => loadCertificationGuide(selectedCertification!.id),
    enabled: initialPreferences === 'ready' && Boolean(selectedCertification),
    staleTime: (query) => {
      const refreshedAt = query.state.data?.freshness.aiRefreshedAt
      if (!refreshedAt) return 0
      return Math.max(0, Date.parse(refreshedAt) + GUIDE_MAX_AGE_MS - Date.now())
    },
    refetchOnWindowFocus: false,
    retry: false,
  })
  const guideReady = Boolean(guideQuery.data && !guideQuery.isError && !guideQuery.isFetching)

  useEffect(() => {
    const nextUserId = userQuery.data?.id ?? null
    const previous = previousUserId.current
    if (previous && hasIdentityChanged(previous, nextUserId, userQuery.error)) {
      setCompletedSession(null)
      setSessionResult(null)
      setPrintableQuestions([])
      setActiveSession(null)
      setScreen('home')
      queryClient.removeQueries({ queryKey: ['simulation-history', previous] })
      queryClient.removeQueries({ queryKey: ['active-simulation', previous] })
      queryClient.removeQueries({ queryKey: ['weak-topic-analysis', previous] })
      queryClient.removeQueries({ queryKey: ['study-plan-latest', previous] })
    }
    if (confirmedSignedOut) {
      setCompletedSession(null)
      setSessionResult(null)
      setPrintableQuestions([])
      setActiveSession(null)
      setScreen('home')
      queryClient.removeQueries({ queryKey: ['simulation-history'] })
      queryClient.removeQueries({ queryKey: ['active-simulation'] })
      queryClient.removeQueries({ queryKey: ['weak-topic-analysis'] })
      queryClient.removeQueries({ queryKey: ['study-plan-latest'] })
    }
    if (nextUserId !== null || !userQuery.isError) previousUserId.current = nextUserId
    if (!userQuery.isError && ((historyQuery.error instanceof SimulationApiError && historyQuery.error.code === 'UNAUTHENTICATED') || (activeSimulationQuery.error instanceof SimulationApiError && activeSimulationQuery.error.code === 'UNAUTHENTICATED') || (studyPlanQuery.error instanceof StudyPlanApiError && studyPlanQuery.error.code === 'UNAUTHENTICATED'))) {
      void userQuery.refetch()
    }
  }, [queryClient, userQuery.data?.id, userQuery.isError, userQuery.refetch, historyQuery.error, activeSimulationQuery.error, studyPlanQuery.error, confirmedSignedOut])

  const startMutation = useMutation({
    mutationFn: (focusWeakTopics: boolean) => focusWeakTopics
      ? startWeakTopicSimulation(selectedCertification!.id, simulationMode, locale)
      : startSimulation(selectedCertification!.id, simulationMode, locale),
    onSuccess: (snapshot) => {
      if (userQuery.data?.id) queryClient.setQueryData(['active-simulation', userQuery.data.id], null)
      setActiveSession(snapshot)
      setSessionResult(null)
      setPrintableQuestions([])
      setQuestionIndex(0)
      setScreen('quiz')
    },
    onError: (error, focusWeakTopics) => {
      clearHistoryIfUnauthenticated(error)
      if (focusWeakTopics) void weakTopicsQuery.refetch()
    },
  })
  const discardSessionMutation = useMutation({
    mutationFn: (sessionId: string) => cancelSimulation(sessionId),
    onSuccess: async () => {
      if (userQuery.data?.id) {
        await queryClient.invalidateQueries({ queryKey: ['active-simulation', userQuery.data.id] })
      }
    },
    onError: clearHistoryIfUnauthenticated,
  })
  useEffect(() => {
    if (!startMutation.isPending) {
      setSimulationLoadingSeconds(0)
      return
    }
    const timer = window.setInterval(() => setSimulationLoadingSeconds((seconds) => seconds + 1), 1_000)
    return () => window.clearInterval(timer)
  }, [startMutation.isPending])
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
      setCompletedSession(null)
      if (userQuery.data?.id) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['simulation-history', userQuery.data.id] }),
          queryClient.invalidateQueries({ queryKey: ['weak-topic-analysis', userQuery.data.id] }),
          queryClient.invalidateQueries({ queryKey: ['study-plan-latest', userQuery.data.id] }),
        ])
      }
    },
    onError: clearHistoryIfUnauthenticated,
  })
  const studyPlanMutation = useMutation({
    mutationFn: ({ certificationId, language }: { certificationId: string; language: Locale; userId: string }) => generateStudyPlan(certificationId, language),
    onSuccess: (plan, variables) => {
      if (userQuery.data?.id === variables.userId) {
        queryClient.setQueryData(['study-plan-latest', variables.userId, variables.certificationId], plan)
      }
    },
    onError: clearHistoryIfUnauthenticated,
  })

  function clearHistoryIfUnauthenticated(error: unknown) {
    if ((error instanceof SimulationApiError || error instanceof StudyPlanApiError) && error.code === 'UNAUTHENTICATED') {
      queryClient.removeQueries({ queryKey: ['simulation-history'] })
      queryClient.removeQueries({ queryKey: ['active-simulation'] })
      queryClient.removeQueries({ queryKey: ['weak-topic-analysis'] })
      queryClient.removeQueries({ queryKey: ['study-plan-latest'] })
      void userQuery.refetch()
    }
  }

  useEffect(() => {
    const updateView = () => {
      const requested = window.location.hash.slice(2) as View
      setView(views.includes(requested) ? requested : 'dashboard')
      setScreen('home')
      setActiveSession(null)
      setSessionResult(null)
      setPrintableQuestions([])
      void queryClient.invalidateQueries({ queryKey: ['active-simulation'] })
    }
    updateView()
    window.addEventListener('hashchange', updateView)
    try {
      const saved = window.sessionStorage.getItem('cert-helper-certification')
      if (saved) setSelectedCertificationId(saved)
    } catch { /* Selection remains available for this visit. */ }
    return () => window.removeEventListener('hashchange', updateView)
  }, [queryClient])

  function selectCertification(id: string) {
    setSelectedCertificationId(id)
    try { window.sessionStorage.setItem('cert-helper-certification', id) } catch { /* Keep current selection in memory. */ }
  }

  function navigate(next: View) {
    if (window.location.hash === `#/${next}`) {
      setScreen('home')
      setView(next)
      setActiveSession(null)
      void queryClient.invalidateQueries({ queryKey: ['active-simulation'] })
    } else {
      window.location.hash = `/${next}`
    }
  }

  useEffect(() => {
    let storage: Storage | undefined
    try {
      storage = window.localStorage
    } catch {
      // Treat unavailable storage as missing preferences for this session.
    }
    const saved = readInitialPreferences(storage)
    setLocale(saved.locale)
    setThemePreference(saved.theme)
    setInitialPreferences(saved.needsConfirmation ? 'required' : 'ready')
  }, [])

  useEffect(() => {
    if (!themePreference) return
    const matchMedia = typeof window.matchMedia === 'function' ? window.matchMedia.bind(window) : undefined
    return observeThemePreference(themePreference, matchMedia, setTheme)
  }, [themePreference])

  useEffect(() => {
    if (initialPreferences === 'ready' && focusAfterConfirmation.current) {
      focusAfterConfirmation.current = false
      document.querySelector<HTMLButtonElement>('.account-trigger')?.focus()
    }
  }, [initialPreferences])

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

  function changeTheme(nextPreference: ThemePreference) {
    try {
      writeThemePreference(window.localStorage, nextPreference)
    } catch {
      // The selection still applies for this session if browser storage is unavailable.
    }
    setThemePreference(nextPreference)
  }

  function changeLocale(nextLocale: Locale) {
    try {
      writeLocalePreference(window.localStorage, nextLocale)
    } catch {
      // The selection still applies for this session if browser storage is unavailable.
    }
    setLocale(nextLocale)
  }

  function startSession(focusWeakTopics = false) {
    if (!selectedCertification || !guideReady || !userQuery.data || userQuery.isError) return
    if (activeSimulationQuery.isPending || activeSimulationQuery.isError) return
    if (activeSimulationQuery.data && !window.confirm(translate(locale, 'replacePendingConfirm'))) return
    answerMutation.reset()
    revealMutation.reset()
    nextMutation.reset()
    startMutation.reset()
    startMutation.mutate(focusWeakTopics)
  }
  function resumeSession(snapshot: SimulationSnapshot) {
    const certification = catalog.find(({ id }) => id === snapshot.certificationId)
    if (!certification) return
    selectCertification(snapshot.certificationId)
    setSimulationMode(snapshot.mode)
    setActiveSession(snapshot)
    setQuestionIndex(snapshot.currentIndex)
    setSessionResult(null)
    answerMutation.reset()
    revealMutation.reset()
    nextMutation.reset()
    setScreen('quiz')
  }

  async function resumeHistorySession(snapshot: SimulationSnapshot) {
    const initialUserId = userQuery.data?.id
    const latest = await requireMatchingActiveSession(snapshot, async () => {
      const result = await activeSimulationQuery.refetch()
      if (result.error) throw result.error
      return result.data ?? null
    })
    const current = progressContext.current
    if (current.userId !== initialUserId || current.certificationId !== snapshot.certificationId || current.view !== 'progress' || current.screen !== 'home') return
    resumeSession(latest)
  }
  function suggestStudyPlan() {
    if (!selectedCertification || !userQuery.data || userQuery.isError) return
    studyPlanMutation.reset()
    studyPlanMutation.mutate({ certificationId: selectedCertification.id, language: locale, userId: userQuery.data.id })
  }

  async function answerQuestion(questionId: string, answerId: string): Promise<SimulationAnswerResponse> {
    const completedFrom = activeSession
    const ownerId = userQuery.data?.id
    const response = await answerMutation.mutateAsync({ questionId, answerId })
    if (response.mode === 'real') {
      if (response.status === 'advanced') {
        if (isCurrentRealAnswer(progressContext.current, ownerId, completedFrom, questionId) && completedFrom) {
          setQuestionIndex(completedFrom.currentIndex + 1)
          setActiveSession((current) => current?.sessionId === completedFrom.sessionId && current.currentIndex === completedFrom.currentIndex && current.currentQuestion?.id === questionId ? {
            ...current,
            currentIndex: completedFrom.currentIndex + 1,
            currentQuestion: response.nextQuestion,
          } : current)
        }
      } else {
        const current = progressContext.current
        if (completedFrom && ownerId && current.authenticated && current.userId === ownerId) {
          setCompletedSession({ ownerId, sessionId: completedFrom.sessionId, certificationId: completedFrom.certificationId, mode: completedFrom.mode, language: completedFrom.language, aiUsage: completedFrom.aiUsage, result: response.result, printableQuestions: response.printableQuestions })
          if (current.screen === 'quiz' && current.activeSessionId === completedFrom.sessionId) {
            setPrintableQuestions(response.printableQuestions)
            setSessionResult(response.result)
            setScreen('results')
          }
        }
        if (userQuery.data?.id) void queryClient.invalidateQueries({ queryKey: ['active-simulation', userQuery.data.id] })
        void queryClient.invalidateQueries({ queryKey: ['simulation-history', userQuery.data?.id] })
        void queryClient.invalidateQueries({ queryKey: ['weak-topic-analysis', userQuery.data?.id] })
        void queryClient.invalidateQueries({ queryKey: ['study-plan-latest', userQuery.data?.id] })
      }
    }
    return response
  }

  async function revealAnswer() {
    return revealMutation.mutateAsync()
  }

  async function advanceQuestion() {
    const ownerId = userQuery.data?.id
    const previousSessionId = activeSession?.sessionId
    const snapshot = await nextMutation.mutateAsync()
    const current = progressContext.current
    const sameUser = Boolean(ownerId && current.authenticated && current.userId === ownerId)
    const sameQuiz = sameUser && current.screen === 'quiz' && current.activeSessionId === previousSessionId
    if (sameQuiz) setActiveSession(snapshot)
    if (snapshot.status === 'completed' && snapshot.result) {
      if (ownerId && sameUser) {
        setCompletedSession({ ownerId, sessionId: snapshot.sessionId, certificationId: snapshot.certificationId, mode: snapshot.mode, language: snapshot.language, aiUsage: snapshot.aiUsage, result: snapshot.result, printableQuestions: snapshot.printableQuestions ?? [] })
        if (sameQuiz) {
          setPrintableQuestions(snapshot.printableQuestions ?? [])
          setSessionResult(snapshot.result)
          setScreen('results')
        }
      }
      if (userQuery.data?.id) void queryClient.invalidateQueries({ queryKey: ['active-simulation', userQuery.data.id] })
      void queryClient.invalidateQueries({ queryKey: ['simulation-history', userQuery.data?.id] })
      void queryClient.invalidateQueries({ queryKey: ['weak-topic-analysis', userQuery.data?.id] })
      void queryClient.invalidateQueries({ queryKey: ['study-plan-latest', userQuery.data?.id] })
      return snapshot
    }
    if (sameQuiz) setQuestionIndex(snapshot.currentIndex)
    return snapshot
  }

  function viewCompletedSession() {
    if (!ownedCompletedSession) return
    selectCertification(ownedCompletedSession.certificationId)
    setSimulationMode(ownedCompletedSession.mode)
    setActiveSession(null)
    setSessionResult(ownedCompletedSession.result)
    setPrintableQuestions(ownedCompletedSession.printableQuestions)
    setScreen('results')
  }

  function exitSession() {
    setActiveSession(null)
    setSessionResult(null)
    setPrintableQuestions([])
    setQuestionIndex(0)
    navigate('dashboard')
    if (userQuery.data?.id) void queryClient.invalidateQueries({ queryKey: ['active-simulation', userQuery.data.id] })
  }

  if (initialPreferences === 'checking') {
    return <div className="app-shell initial-preferences-loading" role="status"><span lang="es">Cargando preferencias…</span> / <span lang="en">Loading preferences…</span></div>
  }

  return (
    <div className="app-shell min-h-screen w-full" data-theme={theme} lang={locale}>
      <div inert={initialPreferences === 'required'}>
      <Header theme={theme} locale={locale} user={userQuery.isError ? null : userQuery.data ?? null} loading={userQuery.isPending} view={view} onNavigate={navigate} />
      {preferencesNotSaved && <div className="content-width preferences-storage-warning" role="status"><span lang="es">No pudimos guardar tus preferencias; se aplicarán durante esta visita.</span> <span lang="en">Your preferences could not be saved; they will apply for this visit.</span></div>}
      {screen === 'home' && view === 'settings' && <SettingsScreen locale={locale} themePreference={themePreference ?? 'system'} onThemeChange={changeTheme} onLocaleChange={changeLocale} />}

      {view !== 'settings' && catalogQuery.isPending && <LoadingState locale={locale} />}
      {view !== 'settings' && catalogQuery.isError && (
        <ErrorState locale={locale} message={translate(locale, 'catalogError')} onRetry={() => void catalogQuery.refetch()} />
      )}
      {view !== 'settings' && !catalogQuery.isPending && !catalogQuery.isError && catalog.length === 0 && (
        <ErrorState locale={locale} message={translate(locale, 'catalogEmpty')} onRetry={() => void catalogQuery.refetch()} />
      )}
      {!catalogQuery.isPending && !catalogQuery.isError && catalog.length > 0 && selectedCertification && screen === 'home' && view !== 'settings' && (
        <HomeScreen
          view={view}
          onDashboard={() => { setReminderClosed(false); navigate('dashboard') }}
          reminderClosed={reminderClosed}
          onCloseReminder={() => setReminderClosed(true)}
          locale={locale}
          certification={selectedCertification}
          guide={guideQuery.isError ? undefined : guideQuery.data}
          guideLoading={guideQuery.isPending || guideQuery.isFetching}
          guideError={guideQuery.error}
          onGuideRetry={() => void guideQuery.refetch()}
          certifications={catalog}
          selectedId={selectedCertification.id}
          onSelect={selectCertification}
          simulationMode={simulationMode}
          onSimulationModeChange={setSimulationMode}
          onStart={() => startSession(false)}
          user={userQuery.isError ? null : userQuery.data ?? null}
          userLoading={userQuery.isPending}
          userError={userQuery.error ?? null}
          onUserRetry={() => void userQuery.refetch()}
          history={historyQuery.data ?? []}
          historyLoading={historyQuery.isPending && Boolean(userQuery.data) && !userQuery.isError}
          historyError={historyQuery.error ?? clearHistoryMutation.error ?? null}
          pendingSession={activeSimulationQuery.data ?? null}
          pendingSessionLoading={(activeSimulationQuery.isPending || activeSimulationQuery.isFetching) && Boolean(userQuery.data) && !userQuery.isError}
          pendingSessionError={activeSimulationQuery.error ?? null}
          discardSessionError={discardSessionMutation.error ?? null}
          onPendingSessionRetry={() => void activeSimulationQuery.refetch()}
          onResumeSession={resumeSession}
          onResumeHistory={resumeHistorySession}
          completedSessionAvailable={Boolean(ownedCompletedSession)}
          completedPrintableQuestions={ownedCompletedSession?.printableQuestions ?? []}
          onViewCompletedSession={viewCompletedSession}
          onDiscardSession={(sessionId) => {
            if (window.confirm(translate(locale, 'discardPendingConfirm'))) discardSessionMutation.mutate(sessionId)
          }}
          discardingPendingSession={discardSessionMutation.isPending}
          weakTopicAnalysis={weakTopicsQuery.data}
          weakTopicsLoading={(weakTopicsQuery.isPending || guideQuery.isFetching) && Boolean(userQuery.data) && !userQuery.isError}
          weakTopicsError={weakTopicsQuery.error}
          weakTopicStartError={startMutation.variables ? startMutation.error : null}
          onWeakTopicsRetry={() => void weakTopicsQuery.refetch()}
          onStartWeakTopics={() => startSession(true)}
          onHistoryRetry={() => {
            clearHistoryMutation.reset()
            void historyQuery.refetch()
          }}
          onClearHistory={() => clearHistoryMutation.mutate()}
          clearingHistory={clearHistoryMutation.isPending}
          studyPlan={studyPlanQuery.data}
          studyPlanLoading={studyPlanQuery.isPending}
          studyPlanError={studyPlanQuery.error ?? null}
          generatingStudyPlan={studyPlanMutation.isPending}
          studyPlanGenerationError={studyPlanMutation.error ?? null}
          onGenerateStudyPlan={suggestStudyPlan}
          onRetryStudyPlan={() => void studyPlanQuery.refetch()}
          startingSimulation={startMutation.isPending}
          startError={startMutation.error ?? null}
        />
      )}
      {selectedCertification && activeSession && screen === 'quiz' && (
        <QuizScreen
          locale={activeSession.language}
          certificationName={activeSessionCertification?.name[activeSession.language] ?? activeSession.certificationId}
          domains={guideQuery.data?.domains ?? []}
          currentQuestion={activeSession.currentQuestion}
          questionIndex={questionIndex}
          practiceProgress={activeSession.practiceProgress}
          simulationMode={activeSession.mode}
          aiUsage={activeSession.aiUsage ?? null}
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
          locale={ownedCompletedSession?.language ?? activeSession?.language ?? locale}
          certificationName={activeSessionCertification?.name[ownedCompletedSession?.language ?? activeSession?.language ?? locale]
            ?? activeSession?.certificationId
            ?? selectedCertification.name[ownedCompletedSession?.language ?? activeSession?.language ?? locale]}
          guide={guideQuery.data}
          result={sessionResult}
          printableQuestions={printableQuestions}
          simulationMode={ownedCompletedSession?.mode ?? activeSession?.mode ?? simulationMode}
          aiUsage={ownedCompletedSession?.aiUsage ?? activeSession?.aiUsage ?? null}
          restarting={startMutation.isPending}
          startError={startMutation.error ?? null}
          onHome={() => {
            setActiveSession(null)
            setSessionResult(null)
            setPrintableQuestions([])
            navigate('dashboard')
          }}
          onRestart={() => startSession(false)}
        />
      )}
      {startMutation.isPending && (
        <SimulationProcessingOverlay locale={locale} elapsedSeconds={simulationLoadingSeconds} />
      )}
      </div>
      {initialPreferences === 'required' && <InitialPreferencesDialog initialLocale={locale} initialTheme={themePreference ?? 'system'} onPreviewTheme={setThemePreference} onConfirm={(nextLocale, nextTheme) => {
        let saved = false
        try { saved = saveInitialPreferences(window.localStorage, nextLocale, nextTheme) } catch { /* Storage is unavailable. */ }
        setPreferencesNotSaved(!saved)
        setLocale(nextLocale)
        setThemePreference(nextTheme)
        focusAfterConfirmation.current = true
        setInitialPreferences('ready')
      }} />}
    </div>
  )
}

function SimulationProcessingOverlay({ locale, elapsedSeconds }: { locale: Locale; elapsedSeconds: number }) {
  const slow = elapsedSeconds >= 25
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)

  return (
    <div className="ai-processing-backdrop">
      <div className="ai-processing-dialog" role="status" aria-live="polite" aria-busy="true">
        <p className="eyebrow">{text('simulationLoadingEyebrow')}</p>
        <div className="ai-processing-heading">
          <span className="guide-loading-spinner" aria-hidden="true" />
          <h2>{text('simulationLoadingTitle')}</h2>
        </div>
        <p key={slow ? 'slow' : 'detail'} className="ai-processing-detail">
          {text(slow ? 'simulationLoadingSlow' : 'simulationLoadingDetail')}
        </p>
        <span className="ai-processing-elapsed" aria-hidden="true">
          {text('guideLoadingElapsed', { seconds: elapsedSeconds })}
        </span>
        <div className="guide-loading-track" aria-hidden="true"><span /></div>
      </div>
    </div>
  )
}

function Header({ theme, locale, user, loading, view, onNavigate }: {
  theme: Theme
  locale: Locale
  user: CurrentUserResponse['user'] | null
  loading: boolean
  view: View
  onNavigate: (view: View) => void
}) {
  const text = (key: Parameters<typeof translate>[1]) => translate(locale, key)
  const [open, setOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => { if (!container.current?.contains(event.target as Node)) setOpen(false) }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
  }, [open])
  const links: Array<[View, Parameters<typeof translate>[1]]> = [
    ['dashboard', 'navDashboard'], ['progress', 'navProgress'], ['study-plan', 'navStudyPlan'],
    ['resources', 'navResources'], ['settings', 'navSettings'],
  ]
  // TODO: Show the full name when the gateway's verified profile field is documented.
  const accountLabel = user?.email ?? user?.id
  return (
    <header className="site-header sticky top-0 z-50 flex w-full items-center justify-center border-b border-neutral-300 bg-neutral-50/90 py-2 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/90">
      <div className="content-width header-inner flex w-full items-center justify-between">
        <a className="brand-lockup" href="#/dashboard" onClick={() => onNavigate('dashboard')}>
          <img className="brand-logo" src={theme === 'dark' ? '/assets/logo/wm_h_rev_wht_rgb_august2024.svg' : '/assets/logo/wm_h_pos_clr_rgb_august2024.svg'} alt={text('brandLabel')} width="173" height="36" />
          <span className="brand-divider" aria-hidden="true" /><span className="product-name">CERTIFICATION HELPER</span>
        </a>
        <div className="account-menu" ref={container}>
          <button ref={trigger} className="account-trigger" type="button" aria-expanded={open} aria-controls="account-navigation" onClick={() => setOpen(!open)}>
            <AccountAvatar key={user?.avatar ?? ''} avatar={user?.avatar} />
            <span className="account-name">{loading ? text('profileLoading') : accountLabel || text('accountMenu')}</span>
            <svg className="account-caret" aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="m3 6 5 5 5-5" /></svg>
          </button>
          {open && <nav id="account-navigation" className="account-dropdown" aria-label={text('accountMenu')}>
            {user?.email && <p className="account-email">{user.email}</p>}
            {links.map(([destination, label]) => <a key={destination} href={`#/${destination}`} aria-current={view === destination ? 'page' : undefined} onClick={() => { setOpen(false); onNavigate(destination) }}>{text(label)}</a>)}
          </nav>}
        </div>
      </div>
    </header>
  )
}

function SettingsScreen({ locale, themePreference, onThemeChange, onLocaleChange }: {
  locale: Locale; themePreference: ThemePreference; onThemeChange: (preference: ThemePreference) => void; onLocaleChange: (locale: Locale) => void
}) {
  const text = (key: Parameters<typeof translate>[1]) => translate(locale, key)
  return <main className="content-width page-content settings-page">
    <h1 className="view-title">{text('settingsTitle')}</h1>
    <p className="section-intro settings-intro">{text('settingsDescription')}</p>
    <section className="settings-card" aria-labelledby="settings-preferences">
      <h2 id="settings-preferences">{text('settingsPreferences')}</h2>
      <div className="settings-row"><div><strong id="language-preference-label">{text('languageLabel')}</strong><p>{text('settingsLanguageHelp')}</p></div>
        <div className="theme-preference" role="radiogroup" aria-labelledby="language-preference-label">
          {([['es', 'Español'], ['en', 'English']] as const).map(([option, label]) => (
            <label className={`theme-preference-option${locale === option ? ' is-active' : ''}`} key={option}>
              <input type="radio" name="language-preference" value={option} checked={locale === option} onChange={() => onLocaleChange(option)} />
              <span lang={option}>{label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="settings-row">
        <div><strong id="theme-preference-label">{text('settingsAppearance')}</strong><p>{text('settingsThemeHelp')}</p></div>
        <div className="theme-preference" role="radiogroup" aria-labelledby="theme-preference-label">
          {(['system', 'light', 'dark'] as const).map(option => (
            <label className={`theme-preference-option${themePreference === option ? ' is-active' : ''}`} key={option}>
              <input type="radio" name="theme-preference" value={option} checked={themePreference === option} onChange={() => onThemeChange(option)} />
              {text(option === 'system' ? 'themeSystem' : option === 'light' ? 'themeLight' : 'themeDark')}
            </label>
          ))}
        </div>
      </div>
    </section>
    <section className="settings-card" aria-labelledby="settings-about"><h2 id="settings-about">{text('settingsAbout')}</h2><p>{text('settingsAboutDescription')}</p><p><strong>{text('settingsVersion')}</strong> v1</p></section>
  </main>
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

  const sourceLabels = {
    'exam-guide': text('sourceExamGuide'),
    'exam-details': text('sourceExamDetails'),
    certification: text('sourceCertification'),
    'learning-path': text('sourceLearningPath'),
  }
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
          <span>{text('pendingSessionError')}</span>
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
            <p className={`panel-note ${guideError || userError || startError ? 'has-error' : ''}`} role={guideError || userError || startError ? 'alert' : 'status'} aria-live="polite">{startStatus}</p>
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

      {user && !progressEmpty && !historyLoading && !historyError && <section className={`weak-topic-practice${showWeakTopicActions ? ' has-actions' : ''}`} aria-labelledby="weak-topic-title">
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
      </section>}

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

      {view === 'resources' && <section className="topics-section" aria-labelledby="topics-title">
        {guideLoading && <p role="status">{text('guideLoading')}</p>}
        {Boolean(guideError) && <div role="alert"><p>{guideErrorMessage(locale, guideError)}</p><button type="button" className="button button-secondary" onClick={onGuideRetry}>{text('guideRetry')}</button></div>}
        {guide && !guideError && <p className="section-intro">{text('guideVersion', { version: guide.version })} · {text('aiRefreshed')}: {formatDate(guide.freshness.aiRefreshedAt, locale)}{guide.freshness.sourceCheckedAt && <> · {text('guideSourcesChecked')}: {formatDate(guide.freshness.sourceCheckedAt, locale)}</>}</p>}
        <div className="section-heading">
          <div>
            <p className="eyebrow">{text('examMapEyebrow')}</p>
            <h2 id="topics-title">{text('examMapTitle')}</h2>
          </div>
          {certification.sources.find((source) => source.kind === 'exam-guide') && <a className="text-link" href={certification.sources.find((source) => source.kind === 'exam-guide')!.url} target="_blank" rel="noreferrer">
            {text('officialGuide')} <span aria-hidden="true">↗</span>
          </a>}
        </div>

        {domains.length > 0 ? (
          <div className="topic-grid">
            {domains.map((domain) => (
              <TopicCard
                key={domain.id}
                domain={domain}
                locale={locale}
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
            {guide.studyPath.map((step, index) => {
              const stepTitle = step.title[locale].replace(/^\s*\d+[.)]\s+/, '')
              return <li className="study-path-card" key={step.id}>
                <div>
                  <p className="eyebrow study-path-step">{text('step', { number: String(index + 1).padStart(2, '0') })}</p>
                  <h3>{stepTitle}</h3>
                  <GuideDescription text={step.description[locale]} />
                  <div className="study-path-domains">
                    <span>{text('domainsInStep')}:</span>
                    <ul>
                      {step.domainIds.map((domainId) => guide.domains.find((domain) => domain.id === domainId)?.name[locale])
                        .filter((name): name is string => Boolean(name))
                        .map((name) => <li key={name}>{name}</li>)}
                    </ul>
                  </div>
                  <a className="text-link" href={step.url} target="_blank" rel="noreferrer" aria-label={`${text('openResource')}: ${stepTitle}`}>
                    {text('openResource')} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </li>
            })}
          </ol> : <p className="guide-empty">{text('noStudyPath')}</p>}
        </section>}

        {guide && <section className="official-sources" aria-labelledby="official-sources-title">
          <h2 id="official-sources-title">{text('officialSourcesTitle')}</h2>
          <ul>
            {guide.sources.map((source) => (
              <li key={source.url}>
                <span>{sourceLabels[source.kind]}</span>
                <a className="text-link" href={source.url} target="_blank" rel="noreferrer">
                  {source.title} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
          {guide.researchSources.length > 0 && <>
            <h3>{text('guideResearchSourcesTitle')}</h3>
            <ul>
              {guide.researchSources.map((source) => (
                <li key={source.url}>
                  <a className="text-link" href={source.url} target="_blank" rel="noreferrer">
                    {source.title} <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </>}
        </section>}
      </section>}

      <footer className="page-footer">
        <span>{text('originalQuestions')}</span>
        <span>{text('notAffiliated')}</span>
      </footer>
    </main>
  )
}

function TopicCard({
  domain,
  locale,
}: {
  domain: CertificationGuideResponse['domains'][number]
  locale: Locale
}) {
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)

  return (
    <details className="topic-card">
      <summary className="topic-summary">
        <span className="topic-summary-content">
          <span className="topic-name">{domain.name[locale]}</span>
          <span className="topic-summary-meta">{text('domainTopics')} · {text('coveredTopicsCount', { count: domain.topics.length })}</span>
        </span>
        <span className="topic-summary-weight">
          <span className="topic-weight">{domain.weightRange && domain.weightRange.min !== domain.weightRange.max
            ? `${formatWeight(domain.weightRange.min, locale)}–${formatWeight(domain.weightRange.max, locale)}%`
            : `${formatWeight(domain.weightRange?.min ?? domain.weight, locale)}%`}</span>
          <span className="topic-weight-label">{text('approximateExamWeight')}</span>
        </span>
        <span className="topic-disclosure" aria-hidden="true">⌄</span>
      </summary>
      <div className="topic-details">
        <GuideDescription text={domain.description[locale]} />
        <ul className="domain-topic-list">
          {domain.topics.map((topic) => <li key={topic.id}>{topic.name[locale]}</li>)}
        </ul>
      </div>
    </details>
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

function formatWeight(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)
}
