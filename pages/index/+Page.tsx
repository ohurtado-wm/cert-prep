import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import {
  type CertificationCatalogItem,
  type CertificationGuideResponse,
  type Locale,
} from '../../src/api/certification-contracts'
import { CertificationApiError, loadCertificationCatalog, loadCertificationGuide } from '../../src/api/certifications'
import { loadCertifications, QuestionBankLoadError } from '../../src/data/load-certification'
import type { Certification, CertificationQuestion, CertificationTopic } from '../../src/data/certification-schema'
import { translate } from '../../src/i18n/messages'
import { readLocalePreference, writeLocalePreference } from '../../src/i18n/preferences'
import '../../src/styles.css'

type Theme = 'light' | 'dark'
type Screen = 'home' | 'quiz' | 'results'
type SimulationMode = 'practice' | 'real'
type Outcome = 'first_try' | 'retry' | 'revealed' | 'incorrect'
type SavedResponse = { outcome: Outcome; wrongAttempts: number }

const topicColors = ['#F900D3', '#00E8FA', '#1DD566', '#FFC700']
const sectionByQuestionTopic: Record<string, number> = {
  design: 1,
  build_test: 2,
  deploy: 3,
  integrate: 4,
}

function createSessionCertification(
  bank: Certification | undefined,
  item: CertificationCatalogItem | undefined,
  guide: CertificationGuideResponse | undefined,
  locale: Locale,
): Certification | null {
  if (!bank || !item || !guide || guide.domains.length !== bank.topics.length) return null
  const examGuide = guide.sources.find((source) => source.kind === 'exam-guide')
  if (!examGuide) return null

  const topics: CertificationTopic[] = []
  for (const topic of bank.topics) {
    const sourceSectionNumber = sectionByQuestionTopic[topic.id]
    const domain = guide.domains.find((candidate) => candidate.sourceSectionNumber === sourceSectionNumber)
    if (!domain) return null
    topics.push({ ...topic, name: domain.name[locale], weight: domain.weight })
  }

  return {
    ...bank,
    name: item.name[locale],
    language: locale,
    source: examGuide.url,
    topics: topics as CertificationTopic[],
  }
}

export default function Page() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <CertificationApp />
    </QueryClientProvider>
  )
}

function CertificationApp() {
  const [theme, setTheme] = useState<Theme>('light')
  const [locale, setLocale] = useState<Locale>('es')
  const [screen, setScreen] = useState<Screen>('home')
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('practice')
  const [selectedCertificationId, setSelectedCertificationId] = useState('')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, SavedResponse>>({})
  const catalogQuery = useQuery({
    queryKey: ['certification-catalog'],
    queryFn: () => loadCertificationCatalog(),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  })
  const bankQuery = useQuery({
    queryKey: ['question-banks'],
    queryFn: async () => {
      const [es, en] = await Promise.all([loadCertifications('es'), loadCertifications('en')])
      return { es, en }
    },
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
  const bankCertification = bankQuery.data?.[locale].find((item) => item.id === selectedCertification?.id)
  const guideReady = Boolean(guideQuery.data && !guideQuery.isError && !guideQuery.isFetching)
  const certification = guideReady
    ? createSessionCertification(bankCertification, selectedCertification, guideQuery.data, locale)
    : null

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
    if (!certification) return
    setResponses({})
    setQuestionIndex(0)
    setScreen('quiz')
  }

  function saveResponse(questionId: string, result: SavedResponse) {
    setResponses((current) => ({ ...current, [questionId]: result }))
  }

  function advanceQuestion() {
    if (!certification) return
    if (questionIndex === certification.questions.length - 1) {
      setScreen('results')
      return
    }
    setQuestionIndex((index) => index + 1)
  }

  return (
    <div className="app-shell min-h-screen w-full" data-theme={theme} lang={locale}>
      <Header theme={theme} locale={locale} onThemeChange={changeTheme} onLocaleChange={changeLocale} />

      {catalogQuery.isPending && <LoadingState locale={locale} kind="catalog" />}
      {catalogQuery.isError && (
        <ErrorState locale={locale} message={translate(locale, 'catalogError')} onRetry={() => void catalogQuery.refetch()} />
      )}
      {!catalogQuery.isPending && !catalogQuery.isError && catalog.length === 0 && (
        <ErrorState locale={locale} message={translate(locale, 'catalogEmpty')} onRetry={() => void catalogQuery.refetch()} />
      )}
      {!catalogQuery.isPending && !catalogQuery.isError && catalog.length > 0 && bankQuery.isPending && <LoadingState locale={locale} kind="bank" />}
      {!catalogQuery.isPending && !catalogQuery.isError && catalog.length > 0 && bankQuery.isError && (
        <ErrorState locale={locale} message={questionBankErrorMessage(locale, bankQuery.error)} onRetry={() => void bankQuery.refetch()} />
      )}
      {!catalogQuery.isPending && !catalogQuery.isError && catalog.length > 0 && !bankQuery.isPending && !bankQuery.isError && selectedCertification && screen === 'home' && (
        <HomeScreen
          locale={locale}
          certification={selectedCertification}
          questionBank={bankCertification}
          guide={guideQuery.isError || guideQuery.isFetching ? undefined : guideQuery.data}
          sessionCertification={certification}
          guideLoading={guideQuery.isPending || guideQuery.isFetching}
          guideError={guideQuery.error}
          onGuideRetry={() => void guideQuery.refetch()}
          certifications={catalog}
          selectedId={selectedCertification.id}
          onSelect={setSelectedCertificationId}
          simulationMode={simulationMode}
          onSimulationModeChange={setSimulationMode}
          onStart={startSession}
        />
      )}
      {certification && screen === 'quiz' && (
        <QuizScreen
          locale={locale}
          certification={certification}
          questionIndex={questionIndex}
          simulationMode={simulationMode}
          onResolve={saveResponse}
          onNext={advanceQuestion}
          onExit={() => {
            setResponses({})
            setQuestionIndex(0)
            setScreen('home')
          }}
        />
      )}
      {certification && screen === 'results' && (
        <ResultsScreen
          locale={locale}
          certification={certification}
          responses={responses}
          simulationMode={simulationMode}
          onHome={() => setScreen('home')}
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
  const text = (key: Parameters<typeof translate>[1]) => translate(locale, key)

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

function LoadingState({ locale, kind }: { locale: Locale; kind: 'catalog' | 'bank' }) {
  const text = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  return (
    <main className="content-width state-page" aria-live="polite">
      <p className="eyebrow">{text(kind === 'catalog' ? 'loadingCatalogEyebrow' : 'loadingQuestionsEyebrow')}</p>
      <h1>{text(kind === 'catalog' ? 'loadingCatalogTitle' : 'loadingQuestionsTitle')}</h1>
      <p className="body-copy">{text(kind === 'catalog' ? 'loadingCatalogBody' : 'loadingQuestionsBody')}</p>
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
  questionBank,
  guide,
  sessionCertification,
  guideLoading,
  guideError,
  onGuideRetry,
  certifications,
  selectedId,
  onSelect,
  simulationMode,
  onSimulationModeChange,
  onStart,
}: {
  locale: Locale
  certification: CertificationCatalogItem
  questionBank: Certification | undefined
  guide: CertificationGuideResponse | undefined
  sessionCertification: Certification | null
  guideLoading: boolean
  guideError: unknown
  onGuideRetry: () => void
  certifications: CertificationCatalogItem[]
  selectedId: string
  onSelect: (id: string) => void
  simulationMode: SimulationMode
  onSimulationModeChange: (mode: SimulationMode) => void
  onStart: () => void
}) {
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)
  const questionCounts = questionBank ? countQuestionsByTopic(questionBank) : new Map<string, number>()
  const domains = guide?.domains ?? []
  const sourceLabels = {
    'exam-guide': text('sourceExamGuide'),
    certification: text('sourceCertification'),
    'learning-path': text('sourceLearningPath'),
  }
  const canStart = Boolean(sessionCertification && !guideLoading && !guideError)
  const startStatus = guideLoading
    ? text('guideLoading')
    : guideError
      ? guideErrorMessage(locale, guideError)
      : !questionBank
        ? text('bankUnavailable')
        : !sessionCertification
          ? text('bankMismatch')
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
          <div className="panel-stats">
            <div><strong>{questionBank?.questions.length ?? '—'}</strong><span>{text('questionsLabel')}</span></div>
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
            {text('startSession')} <span aria-hidden="true">→</span>
          </button>
          <p className={`panel-note ${guideError ? 'has-error' : ''}`} role={guideError ? 'alert' : 'status'} aria-live="polite">{startStatus}</p>
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
            {domains.map((domain, index) => {
            const bankTopicId = Object.entries(sectionByQuestionTopic).find(([, sectionNumber]) => sectionNumber === domain.sourceSectionNumber)?.[0]
            return (
              <TopicCard
                key={domain.id}
                domain={domain}
                locale={locale}
                questionCount={bankTopicId ? questionCounts.get(bankTopicId) ?? 0 : 0}
                accent={topicColors[index % topicColors.length] ?? topicColors[0]}
              />
            )
          })}
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

function TopicCard({
  domain,
  locale,
  questionCount,
  accent,
}: {
  domain: CertificationGuideResponse['domains'][number]
  locale: Locale
  questionCount: number
  accent: string
}) {
  const text = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  return (
    <article className="topic-card">
      <div className="topic-card-top">
        <span className="topic-weight">{domain.weight}%</span>
        <span className="topic-count">{questionCount} {text('questionsLabel')}</span>
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

function QuizScreen({
  locale,
  certification,
  questionIndex,
  simulationMode,
  onResolve,
  onNext,
  onExit,
}: {
  locale: Locale
  certification: Certification
  questionIndex: number
  simulationMode: SimulationMode
  onResolve: (questionId: string, result: SavedResponse) => void
  onNext: () => void
  onExit: () => void
}) {
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)
  const question = certification.questions[questionIndex]
  const topic = certification.topics.find((item) => item.id === question?.topicId)
  const questionNumber = questionIndex + 1
  const progress = (questionNumber / certification.questions.length) * 100

  if (!question || !topic) return null

  return (
    <main className="content-width page-content quiz-page">
      <div className="quiz-heading-row">
        <div>
          <p className="eyebrow">
            {simulationMode === 'real' ? text('simulationRealEyebrow') : text('simulationPracticeEyebrow')}
          </p>
          <h1>{simulationMode === 'real' ? text('examSessionTitle') : text('practiceSessionTitle')}</h1>
        </div>
        <div className="quiz-heading-actions">
          <span className="question-counter">{text('questionCounter', { current: questionNumber, total: certification.questions.length })}</span>
          <button
            className="button button-secondary quiz-exit-button"
            type="button"
            onClick={onExit}
            aria-label={text('exitQuizLabel')}
          >
            <span aria-hidden="true">←</span> {text('exitQuiz')}
          </button>
        </div>
      </div>
      <div
        className="session-progress"
        role="progressbar"
        aria-label={text('progressLabel')}
        aria-valuemin={0}
        aria-valuemax={certification.questions.length}
        aria-valuenow={questionNumber}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className={`quiz-grid ${simulationMode === 'real' ? 'quiz-grid-real' : ''}`}>
        <QuestionCard
          key={question.id}
          locale={locale}
          question={question}
          topic={topic}
          simulationMode={simulationMode}
          questionNumber={questionNumber}
          totalQuestions={certification.questions.length}
          onResolve={onResolve}
          onNext={onNext}
        />
        {simulationMode === 'practice' && (
          <aside className="study-rail">
            <div className="rail-rule" aria-hidden="true" />
            <p className="eyebrow">{text('studyFocus')}</p>
            <h2>{text('readScenario')}</h2>
            <p>{text('studyTip')}</p>
            <div className="rail-divider" />
            <div className="rail-progress-label">
              <span>{text('sessionLabel')}</span>
              <strong>{questionNumber.toString().padStart(2, '0')} / {certification.questions.length}</strong>
            </div>
            <div className="rail-dots" aria-hidden="true">
              {certification.questions.map((item, index) => (
                <span
                  key={item.id}
                  className={index < questionIndex ? 'is-complete' : index === questionIndex ? 'is-current' : ''}
                />
              ))}
            </div>
          </aside>
        )}
      </div>
    </main>
  )
}

function QuestionCard({
  locale,
  question,
  topic,
  simulationMode,
  questionNumber,
  totalQuestions,
  onResolve,
  onNext,
}: {
  locale: Locale
  question: CertificationQuestion
  topic: CertificationTopic
  simulationMode: SimulationMode
  questionNumber: number
  totalQuestions: number
  onResolve: (questionId: string, result: SavedResponse) => void
  onNext: () => void
}) {
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [status, setStatus] = useState<'answering' | 'incorrect' | 'correct' | 'revealed'>('answering')
  const selectedAnswer = question.answers.find((answer) => answer.id === selectedAnswerId)
  const isResolved = status === 'correct' || status === 'revealed'
  const isLastQuestion = questionNumber === totalQuestions

  function submitAnswer() {
    if (!selectedAnswer || status !== 'answering') return
    if (simulationMode === 'real') {
      onResolve(question.id, {
        outcome: selectedAnswer.isCorrect ? 'first_try' : 'incorrect',
        wrongAttempts: 0,
      })
      onNext()
      return
    }

    if (!selectedAnswer.isCorrect) {
      setWrongAttempts((count) => count + 1)
      setStatus('incorrect')
      return
    }

    const outcome: Outcome = wrongAttempts === 0 ? 'first_try' : 'retry'
    onResolve(question.id, { outcome, wrongAttempts })
    setStatus('correct')
  }

  function retryAnswer() {
    setSelectedAnswerId(null)
    setStatus('answering')
  }

  function revealAnswer() {
    onResolve(question.id, { outcome: 'revealed', wrongAttempts })
    setStatus('revealed')
  }

  return (
    <article className="question-card" aria-labelledby={`question-${question.id}`}>
      <div className="question-card-header">
        <p className="eyebrow">{text('questionLabel', { number: questionNumber.toString().padStart(2, '0') })}</p>
        <span className="single-answer-label">{text('singleSelection')}</span>
      </div>
      <h2 id={`question-${question.id}`}>{question.question}</h2>

      <fieldset className="answer-fieldset">
        <legend className="sr-only">{text('selectAnswer')}</legend>
        <div className="answer-list">
          {question.answers.map((answer, index) => {
            const isSelected = selectedAnswerId === answer.id
            const showCorrect = isResolved && answer.isCorrect
            const showIncorrect = (status === 'incorrect' || status === 'revealed')
              && isSelected && !answer.isCorrect
            const classes = [
              'answer-option',
              isSelected ? 'is-selected' : '',
              showCorrect ? 'is-correct' : '',
              showIncorrect ? 'is-incorrect' : '',
            ].filter(Boolean).join(' ')

            return (
              <label className={classes} key={answer.id}>
                <input
                  type="radio"
                  name={`answer-${question.id}`}
                  value={answer.id}
                  checked={isSelected}
                  disabled={status !== 'answering'}
                  onChange={() => setSelectedAnswerId(answer.id)}
                />
                <span className="answer-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                <span className="answer-text">{answer.text}</span>
                {showCorrect && <span className="answer-result">{text('correctAnswer')}</span>}
                {showIncorrect && <span className="answer-result">{text('selectedAnswer')}</span>}
              </label>
            )
          })}
        </div>
      </fieldset>

      {status !== 'answering' && (
        <div className={`answer-feedback feedback-${status}`} role="status" aria-live="polite">
          <div className="feedback-title-row">
            <span className="feedback-symbol" aria-hidden="true">
              {status === 'incorrect' ? '×' : '✓'}
            </span>
            <h3>
              {status === 'incorrect' && text('incorrectFeedback')}
              {status === 'correct' && (wrongAttempts === 0 ? text('correctFirstTry') : text('correctAfterRetry'))}
              {status === 'revealed' && text('answerRevealed')}
            </h3>
          </div>
          {status !== 'incorrect' && (
            <>
              <p className="answer-explanation">{question.explanation}</p>
              <div className="question-context">
                <div><span>{text('domainLabel')}</span><strong>{topic.name}</strong></div>
                <div><span>{text('topicLabel')}</span><strong>{question.focus}</strong></div>
                <div><span>{text('serviceLabel')}</span><strong>{question.service}</strong></div>
              </div>
            </>
          )}
          {status === 'incorrect' && (
            <p className="answer-explanation">
              {text('incorrectHelp')}
            </p>
          )}
        </div>
      )}

      <div className="question-actions">
        {status === 'answering' && (
          <button
            className="button button-primary"
            type="button"
            onClick={submitAnswer}
            disabled={!selectedAnswer}
          >
            {simulationMode === 'real'
              ? isLastQuestion ? text('showResult') : text('nextQuestion')
              : text('submitAnswer')}
            <span aria-hidden="true">→</span>
          </button>
        )}
        {status === 'incorrect' && (
          <>
            <button className="button button-primary" type="button" onClick={retryAnswer}>
              {text('tryAgain')}
            </button>
            <button className="button button-text" type="button" onClick={revealAnswer}>
              {text('revealCorrect')}
            </button>
          </>
        )}
        {isResolved && (
          <button className="button button-primary" type="button" onClick={onNext}>
            {isLastQuestion ? text('showResult') : text('nextQuestion')} <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </article>
  )
}

function ResultsScreen({
  locale,
  certification,
  responses,
  simulationMode,
  onHome,
  onRestart,
}: {
  locale: Locale
  certification: Certification
  responses: Record<string, SavedResponse>
  simulationMode: SimulationMode
  onHome: () => void
  onRestart: () => void
}) {
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)
  const firstTryCorrect = certification.questions.filter(
    (question) => responses[question.id]?.outcome === 'first_try',
  ).length
  const retriedCorrect = certification.questions.filter(
    (question) => responses[question.id]?.outcome === 'retry',
  ).length
  const revealed = certification.questions.filter(
    (question) => responses[question.id]?.outcome === 'revealed',
  ).length
  const incorrect = certification.questions.filter(
    (question) => responses[question.id]?.outcome === 'incorrect',
  ).length
  const score = Math.round((firstTryCorrect / certification.questions.length) * 100)
  const domainResults = certification.topics.map((topic) => {
    const questions = certification.questions.filter((question) => question.topicId === topic.id)
    const correct = questions.filter((question) => responses[question.id]?.outcome === 'first_try').length
    const needsReview = questions.filter((question) => responses[question.id]?.outcome !== 'first_try')
    return { topic, questions, correct, needsReview }
  })
  const overallMessage = simulationMode === 'real'
    ? score >= 80
      ? text('resultStrongReal')
      : text('resultNeedsWork')
    : score >= 80
      ? text('resultStrongPractice')
      : text('resultNeedsWork')

  return (
    <main className="content-width page-content results-page">
      <p className="eyebrow">{text('sessionComplete')}</p>
      <h1>{simulationMode === 'real' ? text('realResultTitle') : text('practiceResultTitle')}</h1>

      <section className="results-summary" aria-label={text('resultsSummary')}>
        <div className="score-panel">
          <span className="score-label">{simulationMode === 'real' ? text('finalScore') : text('firstTryScore')}</span>
          <div className="score-number">{score}<span>%</span></div>
          <p>{text('correctOfTotal', { correct: firstTryCorrect, total: certification.questions.length })}</p>
          <div className="score-track" aria-hidden="true"><span style={{ width: `${score}%` }} /></div>
        </div>
        <div className="result-breakdown">
          <h2>{overallMessage}</h2>
          <div className="result-stat-grid">
            {simulationMode === 'real' ? (
              <>
                <div><strong>{firstTryCorrect}</strong><span>{text('correctAnswers')}</span></div>
                <div><strong>{incorrect}</strong><span>{text('incorrectAnswers')}</span></div>
                <div><strong>{certification.questions.length}</strong><span>{text('simulationQuestions')}</span></div>
              </>
            ) : (
              <>
                <div><strong>{firstTryCorrect}</strong><span>{text('correctFirstCount')}</span></div>
                <div><strong>{retriedCorrect}</strong><span>{text('correctRetriedCount')}</span></div>
                <div><strong>{revealed}</strong><span>{text('revealedCount')}</span></div>
              </>
            )}
          </div>
          <p className="result-note">{text('scoreDisclaimer')}</p>
        </div>
      </section>

      <section className="results-topics" aria-labelledby="results-topics-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{text('performanceByDomain')}</p>
            <h2 id="results-topics-title">{text('topicsToReview')}</h2>
          </div>
        </div>
        <div className="results-topic-list">
          {domainResults.map(({ topic, questions, correct, needsReview }, index) => (
            <article className="results-topic" key={topic.id}>
              <div className="results-topic-heading">
                <div className="results-topic-index" style={{ borderColor: topicColors[index % topicColors.length] }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="results-topic-name"><h3>{topic.name}</h3><span>{questions.length} {text('questionsLabel')}</span></div>
                <strong className="results-topic-score">{correct} / {questions.length}</strong>
              </div>
              <div className="topic-meter result-meter" aria-hidden="true">
                <span style={{ width: `${questions.length ? (correct / questions.length) * 100 : 0}%` }} />
              </div>
              {needsReview.length > 0 ? (
                <div className="review-list">
                  <span className="review-label">{text('review')}</span>
                  <div className="review-chips">
                    {uniqueStrings(needsReview.map((question) => question.focus)).map((focus) => (
                      <span className="review-chip" key={focus}>{focus}</span>
                    ))}
                  </div>
                  <p className="review-services">
                    {text('servicesAndConcepts')} {uniqueStrings(needsReview.map((question) => question.service)).join(', ')}
                  </p>
                </div>
              ) : (
                <p className="all-correct-note">{text('allCorrect')}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <div className="results-actions">
        <button className="button button-primary" type="button" onClick={onRestart}>
          {simulationMode === 'real' ? text('restartReal') : text('practiceAgain')}
        </button>
        <button className="button button-secondary" type="button" onClick={onHome}>{text('backHome')}</button>
      </div>
      <p className="results-disclaimer">{text('practiceDisclaimer')}</p>
    </main>
  )
}

function countQuestionsByTopic(certification: Certification): Map<string, number> {
  const counts = new Map<string, number>()
  for (const question of certification.questions) {
    counts.set(question.topicId, (counts.get(question.topicId) ?? 0) + 1)
  }
  return counts
}

function guideErrorMessage(locale: Locale, error: unknown) {
  if (error instanceof CertificationApiError && error.code === 'GUIDE_REFRESH_IN_PROGRESS') {
    return translate(locale, 'guideRefreshing')
  }
  return translate(locale, 'guideError')
}

function questionBankErrorMessage(locale: Locale, error: unknown) {
  if (error instanceof QuestionBankLoadError && error.code === 'QUESTION_TRANSLATION_MISSING') {
    return translate(locale, 'translationBankError')
  }
  return translate(locale, 'bankError')
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es' : 'en-US', { dateStyle: 'medium' }).format(new Date(value))
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)]
}
