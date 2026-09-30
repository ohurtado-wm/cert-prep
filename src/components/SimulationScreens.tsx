import { useState } from 'react'
import type { AiTokenUsage as AiTokenUsageData } from '../api/ai-usage-contracts'
import type { CertificationGuideResponse, GuideDomain, Locale } from '../api/certification-contracts'
import { AiTokenUsage } from './AiTokenUsage'
import {
  SimulationApiError,
} from '../api/simulations'
import type {
  SimulationAnswerResponse,
  SimulationMode,
  SimulationQuestion,
  SimulationResult,
  SimulationSnapshot,
} from '../api/simulation-contracts'
import { translate } from '../i18n/messages'

const topicColors = ['#F900D3', '#00E8FA', '#1DD566', '#FFC700']

export function QuizScreen({
  locale,
  certificationName,
  domains,
  questions,
  questionIndex,
  simulationMode,
  aiUsage,
  submitting,
  revealing,
  advancing,
  apiError,
  onAnswer,
  onReveal,
  onNext,
  onExit,
}: {
  locale: Locale
  certificationName: string
  domains: GuideDomain[]
  questions: SimulationQuestion[]
  questionIndex: number
  simulationMode: SimulationMode
  aiUsage: AiTokenUsageData | null
  submitting: boolean
  revealing: boolean
  advancing: boolean
  apiError: unknown | null
  onAnswer: (questionId: string, answerId: string) => Promise<SimulationAnswerResponse>
  onReveal: () => Promise<{ correctAnswerId: string; explanation: string }>
  onNext: () => Promise<SimulationSnapshot | void>
  onExit: () => void
}) {
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)
  const question = questions[questionIndex]
  const questionNumber = questionIndex + 1
  const totalQuestions = 20
  const progress = (questionNumber / totalQuestions) * 100

  if (!question) {
    return <main className="content-width state-page" role="status"><h1>{text('loadingQuestionsTitle')}</h1></main>
  }

  return (
    <main className="content-width page-content quiz-page">
      <div className="quiz-heading-row">
        <div>
          <p className="eyebrow">{simulationMode === 'real' ? text('simulationRealEyebrow') : text('simulationPracticeEyebrow')}</p>
          <h1>{simulationMode === 'real' ? text('examSessionTitle') : text('practiceSessionTitle')}</h1>
          <p className="quiz-certification-name">{certificationName}</p>
        </div>
        <div className="quiz-heading-actions">
          <span className="question-counter">{text('questionCounter', { current: questionNumber, total: totalQuestions })}</span>
          <button className="button button-secondary quiz-exit-button" type="button" onClick={onExit} aria-label={text('exitQuizLabel')}>
            <span aria-hidden="true">←</span> {text('exitQuiz')}
          </button>
        </div>
      </div>
      <div
        className="session-progress"
        role="progressbar"
        aria-label={text('progressLabel')}
        aria-valuemin={0}
        aria-valuemax={totalQuestions}
        aria-valuenow={questionNumber}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
      <AiTokenUsage locale={locale} usage={aiUsage} compact />

      <div className={`quiz-grid ${simulationMode === 'real' ? 'quiz-grid-real' : ''}`}>
        <QuestionCard
          key={question.id}
          locale={locale}
          question={question}
          domain={domains.find(({ id }) => id === question.domainId)}
          simulationMode={simulationMode}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          submitting={submitting}
          revealing={revealing}
          advancing={advancing}
          apiError={apiError}
          onAnswer={onAnswer}
          onReveal={onReveal}
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
              <strong>{questionNumber.toString().padStart(2, '0')} / {totalQuestions}</strong>
            </div>
            <div className="rail-dots" aria-hidden="true">
              {Array.from({ length: totalQuestions }, (_, index) => (
                <span key={index} className={index < questionIndex ? 'is-complete' : index === questionIndex ? 'is-current' : ''} />
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
  domain,
  simulationMode,
  questionNumber,
  totalQuestions,
  submitting,
  revealing,
  advancing,
  apiError,
  onAnswer,
  onReveal,
  onNext,
}: {
  locale: Locale
  question: SimulationQuestion
  domain: GuideDomain | undefined
  simulationMode: SimulationMode
  questionNumber: number
  totalQuestions: number
  submitting: boolean
  revealing: boolean
  advancing: boolean
  apiError: unknown | null
  onAnswer: (questionId: string, answerId: string) => Promise<SimulationAnswerResponse>
  onReveal: () => Promise<{ correctAnswerId: string; explanation: string }>
  onNext: () => Promise<SimulationSnapshot | void>
}) {
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [status, setStatus] = useState<'answering' | 'incorrect' | 'correct' | 'revealed'>('answering')
  const [canRetry, setCanRetry] = useState(false)
  const [canReveal, setCanReveal] = useState(false)
  const [canContinue, setCanContinue] = useState(false)
  const [correctAnswerId, setCorrectAnswerId] = useState<string | null>(null)
  const [explanation, setExplanation] = useState<string | null>(null)
  const selectedAnswer = question.answers.find((answer) => answer.id === selectedAnswerId)
  const topic = domain?.topics.find(({ id }) => id === question.topicId)
  const isResolved = status === 'correct' || status === 'revealed'
  const isLastQuestion = questionNumber === totalQuestions
  const waiting = submitting || revealing || advancing

  async function submitAnswer() {
    if (!selectedAnswer || status !== 'answering' || waiting) return
    try {
      const response = await onAnswer(question.id, selectedAnswer.id)
      if (response.mode !== 'practice') return
      setAttempts(response.attempts)
      setCanRetry(response.canRetry)
      setCanReveal(response.canReveal)
      setCanContinue(response.canContinue)
      if (response.status === 'correct') {
        setStatus('correct')
        setCorrectAnswerId(response.correctAnswerId ?? null)
        setExplanation(response.explanation ?? null)
      } else {
        setStatus('incorrect')
      }
    } catch {
      // The page-level API error stays visible and the learner can submit again.
    }
  }

  function retryAnswer() {
    setSelectedAnswerId(null)
    setStatus('answering')
  }

  async function revealAnswer() {
    if (waiting) return
    try {
      const response = await onReveal()
      setCorrectAnswerId(response.correctAnswerId)
      setExplanation(response.explanation)
      setCanContinue(true)
      setCanRetry(false)
      setCanReveal(false)
      setStatus('revealed')
    } catch {
      // Keep the current practice state when the API is temporarily unavailable.
    }
  }

  async function nextQuestion() {
    if (waiting) return
    try {
      await onNext()
    } catch {
      // Keep the resolved answer visible so the learner can retry the request.
    }
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
            const showCorrect = isResolved && answer.id === correctAnswerId
            const showIncorrect = (status === 'incorrect' || status === 'revealed')
              && isSelected && answer.id !== correctAnswerId
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
                  disabled={status !== 'answering' || waiting}
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
            <span className="feedback-symbol" aria-hidden="true">{status === 'incorrect' ? '×' : '✓'}</span>
            <h3>
              {status === 'incorrect' && text('incorrectFeedback')}
              {status === 'correct' && (attempts === 1 ? text('correctFirstTry') : text('correctAfterRetry'))}
              {status === 'revealed' && text('answerRevealed')}
            </h3>
          </div>
          {isResolved ? (
            <>
              {explanation && <p className="answer-explanation">{explanation}</p>}
              <div className="question-context">
                <div><span>{text('domainLabel')}</span><strong>{domain?.name[locale] ?? question.domainId}</strong></div>
                <div><span>{text('topicLabel')}</span><strong>{topic?.name[locale] ?? question.focus}</strong></div>
                <div><span>{text('focusLabel')}</span><strong>{question.focus}</strong></div>
                <div><span>{text('serviceLabel')}</span><strong>{question.service}</strong></div>
              </div>
            </>
          ) : (
            <p className="answer-explanation">{text('incorrectHelp')}</p>
          )}
        </div>
      )}

      {Boolean(apiError) && <p className="panel-note has-error" role="alert">{simulationErrorMessage(locale, apiError)}</p>}

      <div className="question-actions">
        {status === 'answering' && (
          <button className="button button-primary" type="button" onClick={() => void submitAnswer()} disabled={!selectedAnswer || waiting}>
            {simulationMode === 'real'
              ? isLastQuestion ? text('showResult') : text('nextQuestion')
              : text('submitAnswer')}
            <span aria-hidden="true">→</span>
          </button>
        )}
        {status === 'incorrect' && canRetry && (
          <button className="button button-primary" type="button" onClick={retryAnswer} disabled={waiting}>{text('tryAgain')}</button>
        )}
        {status === 'incorrect' && canReveal && (
          <button className="button button-text" type="button" onClick={() => void revealAnswer()} disabled={waiting}>
            {revealing ? text('loadingAnswer') : text('revealCorrect')}
          </button>
        )}
        {((status === 'incorrect' && canContinue) || isResolved) && (
          <button className="button button-primary" type="button" onClick={() => void nextQuestion()} disabled={waiting}>
            {advancing ? text('loadingNextQuestion') : isLastQuestion ? text('showResult') : text('nextQuestion')} <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </article>
  )
}

export function ResultsScreen({
  locale,
  certificationName,
  guide,
  result,
  simulationMode,
  aiUsage,
  restarting,
  startError,
  onHome,
  onRestart,
}: {
  locale: Locale
  certificationName: string
  guide: CertificationGuideResponse | undefined
  result: SimulationResult
  simulationMode: SimulationMode
  aiUsage: AiTokenUsageData | null
  restarting: boolean
  startError: unknown | null
  onHome: () => void
  onRestart: () => void
}) {
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)
  const score = result.score
  const overallMessage = simulationMode === 'real'
    ? score >= 80 ? text('resultStrongReal') : text('resultNeedsWork')
    : score >= 80 ? text('resultStrongPractice') : text('resultNeedsWork')
  const domainName = (id: string) => guide?.domains.find((domain) => domain.id === id)?.name[locale] ?? id
  const topicName = (id: string) => {
    for (const domain of guide?.domains ?? []) {
      const topic = domain.topics.find((candidate) => candidate.id === id)
      if (topic) return topic.name[locale]
    }
    return id
  }
  const domainResults = result.domainBreakdown.map((item) => ({ ...item, name: domainName(item.id) }))
  const topicResults = result.topicBreakdown.map((item) => ({ ...item, name: topicName(item.id) }))
  const weakFocuses = result.focusBreakdown.filter(({ correct, total }) => correct < total)

  return (
    <main className="content-width page-content results-page">
      <p className="eyebrow">{text('sessionComplete')}</p>
      <h1>{simulationMode === 'real' ? text('realResultTitle') : text('practiceResultTitle')}</h1>
      <p className="results-certification-name">{certificationName}</p>
      <AiTokenUsage locale={locale} usage={aiUsage} compact />

      <section className="results-summary" aria-label={text('resultsSummary')}>
        <div className="score-panel">
          <span className="score-label">{simulationMode === 'real' ? text('finalScore') : text('firstTryScore')}</span>
          <div className="score-number">{score}<span>%</span></div>
          <p>{text('correctOfTotal', { correct: result.correctAnswers, total: result.totalQuestions })}</p>
          <div className="score-track" aria-hidden="true"><span style={{ width: `${score}%` }} /></div>
        </div>
        <div className="result-breakdown">
          <h2>{overallMessage}</h2>
          <div className="result-stat-grid">
            {simulationMode === 'real' ? (
              <>
                <div><strong>{result.correctAnswers}</strong><span>{text('correctAnswers')}</span></div>
                <div><strong>{result.incorrectAnswers}</strong><span>{text('incorrectAnswers')}</span></div>
                <div><strong>{result.totalQuestions}</strong><span>{text('simulationQuestions')}</span></div>
              </>
            ) : (
              <>
                <div><strong>{result.correctAnswers}</strong><span>{text('correctFirstCount')}</span></div>
                <div><strong>{result.correctAfterRetry}</strong><span>{text('correctRetriedCount')}</span></div>
                <div><strong>{result.answersRevealed}</strong><span>{text('revealedCount')}</span></div>
              </>
            )}
          </div>
          <p className="result-note">{text('scoreDisclaimer')}</p>
        </div>
      </section>

      <section className="results-topics" aria-labelledby="results-domains-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{text('performanceByDomain')}</p>
            <h2 id="results-domains-title">{text('domainPerformance')}</h2>
          </div>
        </div>
        <div className="results-topic-list">
          {domainResults.map((item, index) => (
            <article className="results-topic" key={item.id}>
              <div className="results-topic-heading">
                <div className="results-topic-index" style={{ borderColor: topicColors[index % topicColors.length] }}>{String(index + 1).padStart(2, '0')}</div>
                <div className="results-topic-name"><h3>{item.name}</h3><span>{item.total} {text('questionsLabel')}</span></div>
                <strong className="results-topic-score">{item.correct} / {item.total}</strong>
              </div>
              <div className="topic-meter result-meter" aria-hidden="true">
                <span style={{ width: `${Math.round(item.correct / item.total * 100)}%` }} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="results-topics" aria-labelledby="results-topics-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{text('topicsToReview')}</p>
            <h2 id="results-topics-title">{text('topicPerformance')}</h2>
          </div>
        </div>
        <div className="results-topic-list">
          {topicResults.map((item, index) => (
            <article className="results-topic" key={item.id}>
              <div className="results-topic-heading">
                <div className="results-topic-index" style={{ borderColor: topicColors[index % topicColors.length] }}>{String(index + 1).padStart(2, '0')}</div>
                <div className="results-topic-name"><h3>{item.name}</h3><span>{item.total} {text('questionsLabel')}</span></div>
                <strong className="results-topic-score">{item.correct} / {item.total}</strong>
              </div>
              <div className="topic-meter result-meter" aria-hidden="true">
                <span style={{ width: `${Math.round(item.correct / item.total * 100)}%` }} />
              </div>
              {item.correct < item.total ? (
                <p className="review-services">{text('reviewThisTopic')}</p>
              ) : <p className="all-correct-note">{text('allCorrect')}</p>}
            </article>
          ))}
        </div>
      </section>

      {weakFocuses.length > 0 && <section className="focus-results" aria-labelledby="focus-results-title">
        <p className="eyebrow">{text('focusLabel')}</p>
        <h2 id="focus-results-title">{text('focusesToReview')}</h2>
        <div className="review-chips">
          {weakFocuses.map((focus) => <span className="review-chip" key={focus.id}>{focus.id} · {focus.correct}/{focus.total}</span>)}
        </div>
      </section>}

      <div className="results-actions">
        <button className="button button-primary" type="button" onClick={onRestart} disabled={restarting}>
          {restarting ? text('startingSimulation') : simulationMode === 'real' ? text('restartReal') : text('practiceAgain')}
        </button>
        <button className="button button-secondary" type="button" onClick={onHome} disabled={restarting}>{text('backHome')}</button>
      </div>
      {Boolean(startError) && <p className="results-api-error" role="alert">{simulationErrorMessage(locale, startError)}</p>}
      <p className="results-disclaimer">{text('practiceDisclaimer')}</p>
    </main>
  )
}

export function simulationErrorMessage(locale: Locale, error: unknown) {
  if (error instanceof SimulationApiError && error.code === 'UNAUTHENTICATED') return translate(locale, 'authRequired')
  if (error instanceof SimulationApiError && error.code === 'SIMULATION_GENERATION_IN_PROGRESS') return translate(locale, 'simulationPreparing')
  return translate(locale, 'simulationError')
}
