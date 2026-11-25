import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import {
  type Locale,
} from '@cert-prep/contracts/certification-contracts'
import { useCertificationData } from '../../src/hooks/useCertificationData'
import { commonErrorMessage } from '../../src/i18n/error-messages'
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
  SimulationMode,
  PrintableSimulationQuestion,
  SimulationResult,
  SimulationSnapshot,
} from '@cert-prep/contracts/simulation-contracts'
import { translate } from '../../src/i18n/messages'
import { observeThemePreference, readInitialPreferences, saveInitialPreferences, writeLocalePreference, writeThemePreference, type Theme, type ThemePreference } from '../../src/i18n/preferences'
import { isCurrentRealAnswer, requireMatchingActiveSession } from '../../src/data/active-session'
import { getOwnedCompletedSession, type CompletedSessionView } from '../../src/data/completed-session'
import { hasIdentityChanged, isConfirmedSignOut } from '../../src/data/identity'
import { InitialPreferencesDialog } from '../../src/components/InitialPreferencesDialog'
import { generateStudyPlan, loadLatestStudyPlan, StudyPlanApiError } from '../../src/api/study-plans'
import { QuizScreen, ResultsScreen } from '../../src/components/SimulationScreens'
import { Header, SettingsScreen, LoadingState, ErrorState, SimulationProcessingOverlay } from '../../src/components/AppShell'
import { HomeScreen, type View } from '../../src/components/HomeScreen'
import '../../src/styles.css'

type Screen = 'home' | 'quiz' | 'results'
const views: View[] = ['dashboard', 'progress', 'study-plan', 'resources', 'settings']

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
  const [advancedPractice, setAdvancedPractice] = useState(false)
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
  const { catalogQuery, catalog, selectedCertification, guideQuery } = useCertificationData(initialPreferences === 'ready', selectedCertificationId)
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
      : startSimulation(selectedCertification!.id, simulationMode, locale, fetch, advancedPractice ? 'advanced' : 'ai'),
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
    if (id !== 'gcp-professional-cloud-developer') setAdvancedPractice(false)
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
    setAdvancedPractice(snapshot.questionSource === 'advanced')
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
          if (completedFrom.questionSource === 'advanced') setCompletedSession(null)
          else setCompletedSession({ ownerId, sessionId: completedFrom.sessionId, certificationId: completedFrom.certificationId, mode: completedFrom.mode, language: completedFrom.language, aiUsage: completedFrom.aiUsage, result: response.result, printableQuestions: response.printableQuestions })
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
    setAdvancedPractice(false)
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
        <ErrorState locale={locale} message={commonErrorMessage(locale, catalogQuery.error) ?? translate(locale, 'catalogError')} onRetry={() => void catalogQuery.refetch()} />
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
          onSimulationModeChange={(mode) => { setSimulationMode(mode); if (mode !== 'real') setAdvancedPractice(false) }}
          advancedPractice={advancedPractice}
          onAdvancedPracticeChange={setAdvancedPractice}
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
          locale={activeSession.questionSource === 'advanced' ? locale : activeSession.language}
          questionLanguage={activeSession.language}
          certificationName={activeSessionCertification?.name[activeSession.questionSource === 'advanced' ? locale : activeSession.language] ?? activeSession.certificationId}
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
          locale={activeSession?.questionSource === 'advanced' ? locale : activeSession?.language ?? ownedCompletedSession?.language ?? locale}
          certificationName={activeSessionCertification?.name[activeSession?.questionSource === 'advanced' ? locale : activeSession?.language ?? ownedCompletedSession?.language ?? locale]
            ?? activeSession?.certificationId
            ?? selectedCertification.name[ownedCompletedSession?.language ?? activeSession?.language ?? locale]}
          guide={guideQuery.data}
          result={sessionResult}
          printableQuestions={printableQuestions}
          simulationMode={activeSession?.mode ?? ownedCompletedSession?.mode ?? simulationMode}
          questionSource={activeSession?.questionSource ?? 'ai'}
          sessionId={activeSession?.sessionId}
          aiUsage={activeSession?.aiUsage ?? ownedCompletedSession?.aiUsage ?? null}
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
