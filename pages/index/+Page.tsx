import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { Certification, CertificationQuestion, CertificationTopic } from '../../src/data/certification-schema'
import { loadCertifications } from '../../src/data/load-certification'
import '../../src/styles.css'

type Theme = 'light' | 'dark'
type Screen = 'home' | 'quiz' | 'results'
type SimulationMode = 'practice' | 'real'
type Outcome = 'first_try' | 'retry' | 'revealed' | 'incorrect'
type SavedResponse = { outcome: Outcome; wrongAttempts: number }

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
  const [theme, setTheme] = useState<Theme>('light')
  const [screen, setScreen] = useState<Screen>('home')
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('practice')
  const [selectedCertificationId, setSelectedCertificationId] = useState('')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, SavedResponse>>({})
  const { data: certifications, isPending, isError, error, refetch } = useQuery({
    queryKey: ['certifications'],
    queryFn: loadCertifications,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  })

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
    document.documentElement.style.colorScheme = theme
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (favicon) {
      favicon.href = theme === 'dark'
        ? '/assets/logo/wm_compass_rev_wht_rgb_august2024.svg'
        : '/assets/logo/wm_compass_pos_clr_rgb_august2024.svg'
    }
  }, [theme])

  const certification = certifications?.find((item) => item.id === selectedCertificationId)
    ?? certifications?.[0]

  function changeTheme() {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    try {
      window.localStorage.setItem('cert-helper-theme', nextTheme)
    } catch {
      // The selection still applies for this session if browser storage is unavailable.
    }
    setTheme(nextTheme)
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
    <div className="app-shell min-h-screen w-full" data-theme={theme}>
      <Header theme={theme} onThemeChange={changeTheme} />

      {isPending && <LoadingState />}
      {isError && <ErrorState message={error.message} onRetry={() => void refetch()} />}
      {!isPending && !isError && certification && screen === 'home' && (
        <HomeScreen
          certification={certification}
          certifications={certifications ?? []}
          selectedId={certification.id}
          onSelect={setSelectedCertificationId}
          simulationMode={simulationMode}
          onSimulationModeChange={setSimulationMode}
          onStart={startSession}
        />
      )}
      {!isPending && !isError && certification && screen === 'quiz' && (
        <QuizScreen
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
      {!isPending && !isError && certification && screen === 'results' && (
        <ResultsScreen
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

function Header({ theme, onThemeChange }: { theme: Theme; onThemeChange: () => void }) {
  return (
    <header className="site-header">
      <div className="content-width header-inner flex w-full items-center justify-between">
        <div className="brand-lockup">
          <img
            className="brand-logo"
            src={theme === 'dark'
              ? '/assets/logo/wm_h_rev_wht_rgb_august2024.svg'
              : '/assets/logo/wm_h_pos_clr_rgb_august2024.svg'}
            alt="West Monroe"
            width="173"
            height="36"
          />
          <span className="brand-divider" aria-hidden="true" />
          <span className="product-name">CERT HELPER</span>
        </div>
        <div className="header-actions">
          <span className="local-badge"><span aria-hidden="true" /> PoC local</span>
          <button
            className="theme-button"
            type="button"
            onClick={onThemeChange}
            aria-pressed={theme === 'dark'}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          </button>
        </div>
      </div>
    </header>
  )
}

function LoadingState() {
  return (
    <main className="content-width state-page" aria-live="polite">
      <p className="eyebrow">PREPARANDO TU SESIÓN</p>
      <h1>Cargando el banco de preguntas…</h1>
      <p className="body-copy">Validamos el archivo local antes de mostrarlo.</p>
    </main>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <main className="content-width state-page" role="alert">
      <p className="eyebrow">NO SE PUDO CARGAR EL BANCO</p>
      <h1>Revisa los datos de la certificación</h1>
      <p className="body-copy">{message}</p>
      <button className="button button-primary" type="button" onClick={onRetry}>Intentar de nuevo</button>
    </main>
  )
}

function HomeScreen({
  certification,
  certifications,
  selectedId,
  onSelect,
  simulationMode,
  onSimulationModeChange,
  onStart,
}: {
  certification: Certification
  certifications: Certification[]
  selectedId: string
  onSelect: (id: string) => void
  simulationMode: SimulationMode
  onSimulationModeChange: (mode: SimulationMode) => void
  onStart: () => void
}) {
  const questionCounts = countQuestionsByTopic(certification)

  return (
    <main className="content-width page-content">
      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">SIMULADOR DE CERTIFICACIONES</p>
          <h1>Practica con propósito.</h1>
          <p className="hero-description">
            Resuelve preguntas situacionales, entiende por qué una opción funciona y descubre
            cuáles temas vale la pena repasar.
          </p>
          <div className="hero-meta">
            <span>Hecho para aprender</span>
            <span className="meta-separator" aria-hidden="true" />
            <span>Sin cronómetro</span>
          </div>
        </div>

        <section className="certification-panel" aria-labelledby="certification-title">
          <p className="panel-eyebrow">TU PRÓXIMA CERTIFICACIÓN</p>
          <label className="field-label" htmlFor="certification-select">Certificación</label>
          <select
            id="certification-select"
            className="certification-select"
            value={selectedId}
            onChange={(event) => onSelect(event.currentTarget.value)}
          >
            {certifications.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <h2 id="certification-title">{certification.name.replace('Google Cloud ', '')}</h2>
          <div className="panel-stats">
            <div><strong>{certification.questions.length}</strong><span>preguntas</span></div>
            <div><strong>{certification.topics.length}</strong><span>dominios</span></div>
            <div><strong>ES</strong><span>idioma</span></div>
          </div>
          <label className="simulation-mode-control">
            <input
              type="checkbox"
              checked={simulationMode === 'real'}
              onChange={(event) => onSimulationModeChange(event.currentTarget.checked ? 'real' : 'practice')}
            />
            <span>
              <strong>Simulación Real</strong>
              <small>Un intento por pregunta, sin pistas hasta el resultado.</small>
            </span>
          </label>
          <button className="button button-inverse" type="button" onClick={onStart}>
            Iniciar simulación <span aria-hidden="true">→</span>
          </button>
          <p className="panel-note">
            {simulationMode === 'real'
              ? 'Un solo intento por pregunta · resultado al final'
              : 'Una pregunta a la vez · puedes reintentar'}
          </p>
        </section>
      </section>

      <section className="topics-section" aria-labelledby="topics-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MAPA DEL EXAMEN</p>
            <h2 id="topics-title">Cuatro dominios, una ruta clara.</h2>
          </div>
          <a className="text-link" href={certification.source} target="_blank" rel="noreferrer">
            Ver guía oficial <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="topic-grid">
          {certification.topics.map((topic, index) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              questionCount={questionCounts.get(topic.id) ?? 0}
              accent={topicColors[index % topicColors.length] ?? topicColors[0]}
            />
          ))}
        </div>
        <p className="section-footnote">
          La distribución de preguntas aproxima el peso de cada dominio en la guía oficial.
        </p>
      </section>

      <footer className="page-footer">
        <span>Preguntas originales para práctica personal.</span>
        <span>Este simulador no está afiliado a Google Cloud.</span>
      </footer>
    </main>
  )
}

function TopicCard({
  topic,
  questionCount,
  accent,
}: {
  topic: CertificationTopic
  questionCount: number
  accent: string
}) {
  return (
    <article className="topic-card">
      <div className="topic-card-top">
        <span className="topic-weight">{topic.weight}%</span>
        <span className="topic-count">{questionCount} preguntas</span>
      </div>
      <h3>{topic.name}</h3>
      <div className="topic-meter" aria-hidden="true">
        <span style={{ width: `${topic.weight}%`, backgroundColor: accent }} />
      </div>
      <p>del examen, aproximadamente</p>
    </article>
  )
}

function QuizScreen({
  certification,
  questionIndex,
  simulationMode,
  onResolve,
  onNext,
  onExit,
}: {
  certification: Certification
  questionIndex: number
  simulationMode: SimulationMode
  onResolve: (questionId: string, result: SavedResponse) => void
  onNext: () => void
  onExit: () => void
}) {
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
            {simulationMode === 'real' ? 'SIMULACIÓN REAL' : 'PROFESSIONAL CLOUD DEVELOPER'}
          </p>
          <h1>{simulationMode === 'real' ? 'Simulación de examen' : 'Simulación de práctica'}</h1>
        </div>
        <div className="quiz-heading-actions">
          <span className="question-counter">Pregunta <strong>{questionNumber}</strong> de {certification.questions.length}</span>
          <button
            className="button button-secondary quiz-exit-button"
            type="button"
            onClick={onExit}
            aria-label="Salir de la simulación y volver al inicio"
          >
            <span aria-hidden="true">←</span> Salir
          </button>
        </div>
      </div>
      <div
        className="session-progress"
        role="progressbar"
        aria-label="Progreso de la simulación"
        aria-valuemin={0}
        aria-valuemax={certification.questions.length}
        aria-valuenow={questionNumber}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className={`quiz-grid ${simulationMode === 'real' ? 'quiz-grid-real' : ''}`}>
        <QuestionCard
          key={question.id}
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
            <p className="eyebrow">ENFOQUE DE ESTUDIO</p>
            <h2>Lee el escenario completo.</h2>
            <p>
              Identifica primero el requisito que no se puede negociar: seguridad, escala,
              disponibilidad, costo o velocidad de entrega.
            </p>
            <div className="rail-divider" />
            <div className="rail-progress-label">
              <span>Sesión</span>
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
  question,
  topic,
  simulationMode,
  questionNumber,
  totalQuestions,
  onResolve,
  onNext,
}: {
  question: CertificationQuestion
  topic: CertificationTopic
  simulationMode: SimulationMode
  questionNumber: number
  totalQuestions: number
  onResolve: (questionId: string, result: SavedResponse) => void
  onNext: () => void
}) {
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
        <p className="eyebrow">PREGUNTA {questionNumber.toString().padStart(2, '0')}</p>
        <span className="single-answer-label">Selección única</span>
      </div>
      <h2 id={`question-${question.id}`}>{question.question}</h2>

      <fieldset className="answer-fieldset">
        <legend className="sr-only">Selecciona una respuesta</legend>
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
                {showCorrect && <span className="answer-result">Correcta</span>}
                {showIncorrect && <span className="answer-result">Elegida</span>}
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
              {status === 'incorrect' && 'Esa opción no es correcta todavía.'}
              {status === 'correct' && (wrongAttempts === 0 ? '¡Correcto al primer intento!' : '¡Correcto tras reintentar!')}
              {status === 'revealed' && 'Respuesta correcta revelada.'}
            </h3>
          </div>
          {status !== 'incorrect' && (
            <>
              <p className="answer-explanation">{question.explanation}</p>
              <div className="question-context">
                <div><span>Dominio</span><strong>{topic.name}</strong></div>
                <div><span>Tema</span><strong>{question.focus}</strong></div>
                <div><span>Servicio / concepto</span><strong>{question.service}</strong></div>
              </div>
            </>
          )}
          {status === 'incorrect' && (
            <p className="answer-explanation">
              Puedes cambiar tu respuesta antes de continuar. Si lo prefieres, revela la correcta
              y revisa su explicación.
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
              ? isLastQuestion ? 'Ver resultado' : 'Siguiente pregunta'
              : 'Enviar respuesta'}
            <span aria-hidden="true">→</span>
          </button>
        )}
        {status === 'incorrect' && (
          <>
            <button className="button button-primary" type="button" onClick={retryAnswer}>
              Volver a intentar
            </button>
            <button className="button button-text" type="button" onClick={revealAnswer}>
              Cuál es la correcta
            </button>
          </>
        )}
        {isResolved && (
          <button className="button button-primary" type="button" onClick={onNext}>
            {isLastQuestion ? 'Ver resultado' : 'Siguiente pregunta'} <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </article>
  )
}

function ResultsScreen({
  certification,
  responses,
  simulationMode,
  onHome,
  onRestart,
}: {
  certification: Certification
  responses: Record<string, SavedResponse>
  simulationMode: SimulationMode
  onHome: () => void
  onRestart: () => void
}) {
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
      ? 'Buen resultado. Mantén el repaso de los temas marcados.'
      : 'Usa el desglose para enfocar tu siguiente bloque de estudio.'
    : score >= 80
      ? 'Buen dominio en el primer intento. Mantén el repaso de los temas marcados.'
      : 'Usa el desglose para enfocar tu siguiente bloque de estudio.'

  return (
    <main className="content-width page-content results-page">
      <p className="eyebrow">SESIÓN COMPLETADA</p>
      <h1>{simulationMode === 'real' ? 'Resultado de la simulación.' : 'Tu siguiente paso empieza aquí.'}</h1>

      <section className="results-summary" aria-label="Resumen de resultados">
        <div className="score-panel">
          <span className="score-label">{simulationMode === 'real' ? 'Nota final' : 'Aciertos al primer intento'}</span>
          <div className="score-number">{score}<span>%</span></div>
          <p>{firstTryCorrect} de {certification.questions.length} respuestas correctas</p>
          <div className="score-track" aria-hidden="true"><span style={{ width: `${score}%` }} /></div>
        </div>
        <div className="result-breakdown">
          <h2>{overallMessage}</h2>
          <div className="result-stat-grid">
            {simulationMode === 'real' ? (
              <>
                <div><strong>{firstTryCorrect}</strong><span>Respuestas correctas</span></div>
                <div><strong>{incorrect}</strong><span>Respuestas incorrectas</span></div>
                <div><strong>{certification.questions.length}</strong><span>Preguntas de la simulación</span></div>
              </>
            ) : (
              <>
                <div><strong>{firstTryCorrect}</strong><span>Correctas al primer intento</span></div>
                <div><strong>{retriedCorrect}</strong><span>Correctas después de reintentar</span></div>
                <div><strong>{revealed}</strong><span>Respuestas reveladas</span></div>
              </>
            )}
          </div>
          <p className="result-note">Este porcentaje es una guía de estudio, no una predicción de aprobación del examen oficial.</p>
        </div>
      </section>

      <section className="results-topics" aria-labelledby="results-topics-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DESEMPEÑO POR DOMINIO</p>
            <h2 id="results-topics-title">Temas para repasar</h2>
          </div>
        </div>
        <div className="results-topic-list">
          {domainResults.map(({ topic, questions, correct, needsReview }, index) => (
            <article className="results-topic" key={topic.id}>
              <div className="results-topic-heading">
                <div className="results-topic-index" style={{ borderColor: topicColors[index % topicColors.length] }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="results-topic-name"><h3>{topic.name}</h3><span>{questions.length} preguntas</span></div>
                <strong className="results-topic-score">{correct} / {questions.length}</strong>
              </div>
              <div className="topic-meter result-meter" aria-hidden="true">
                <span style={{ width: `${questions.length ? (correct / questions.length) * 100 : 0}%` }} />
              </div>
              {needsReview.length > 0 ? (
                <div className="review-list">
                  <span className="review-label">REPASAR</span>
                  <div className="review-chips">
                    {uniqueStrings(needsReview.map((question) => question.focus)).map((focus) => (
                      <span className="review-chip" key={focus}>{focus}</span>
                    ))}
                  </div>
                  <p className="review-services">
                    Servicios / conceptos: {uniqueStrings(needsReview.map((question) => question.service)).join(', ')}
                  </p>
                </div>
              ) : (
                <p className="all-correct-note">Todas las preguntas de este dominio fueron correctas al primer intento.</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <div className="results-actions">
        <button className="button button-primary" type="button" onClick={onRestart}>
          {simulationMode === 'real' ? 'Repetir simulación' : 'Practicar de nuevo'}
        </button>
        <button className="button button-secondary" type="button" onClick={onHome}>Volver al inicio</button>
      </div>
      <p className="results-disclaimer">Preguntas de práctica originales. No son preguntas oficiales del examen.</p>
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

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)]
}
