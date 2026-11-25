import { ErrorAlert } from './ErrorAlert'
import type { Locale } from '@cert-prep/contracts/certification-contracts'
import { translate } from '../i18n/messages'
import { useState } from 'react'
import type { GuideDomain } from '@cert-prep/contracts/certification-contracts'
import type { SimulationAnswerResponse, SimulationMode, SimulationQuestion, SimulationSnapshot, PracticeQuestionProgress } from '@cert-prep/contracts/simulation-contracts'
import { simulationErrorMessage } from '../i18n/error-messages'

export function QuestionCard({
  locale,
  questionLanguage,
  question,
  domain,
  simulationMode,
  questionNumber,
  totalQuestions,
  practiceProgress,
  submitting,
  revealing,
  advancing,
  apiError,
  onAnswer,
  onReveal,
  onNext,
}: {
  locale: Locale
  questionLanguage: Locale
  question: SimulationQuestion
  domain: GuideDomain | undefined
  simulationMode: SimulationMode
  questionNumber: number
  totalQuestions: number
  practiceProgress: PracticeQuestionProgress | null
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
  const [attempts, setAttempts] = useState(practiceProgress?.attempts ?? 0)
  const [status, setStatus] = useState<'answering' | 'incorrect' | 'correct' | 'revealed'>(practiceProgress?.status ?? 'answering')
  const [canRetry, setCanRetry] = useState(practiceProgress?.canRetry ?? false)
  const [canReveal, setCanReveal] = useState(practiceProgress?.canReveal ?? false)
  const [canContinue, setCanContinue] = useState(practiceProgress?.canContinue ?? false)
  const [correctAnswerId, setCorrectAnswerId] = useState<string | null>(practiceProgress?.correctAnswerId ?? null)
  const [explanation, setExplanation] = useState<string | null>(practiceProgress?.explanation ?? null)
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
      <h2 id={`question-${question.id}`} lang={questionLanguage}>{question.question}</h2>

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
                <span className="answer-text" lang={questionLanguage}>{answer.text}</span>
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
                {topic && <div><span>{text('topicLabel')}</span><strong>{topic.name[locale]}</strong></div>}
                {question.focus && <div><span>{text('focusLabel')}</span><strong>{question.focus}</strong></div>}
                {question.service && <div><span>{text('serviceLabel')}</span><strong>{question.service}</strong></div>}
              </div>
            </>
          ) : (
            <p className="answer-explanation">{text('incorrectHelp')}</p>
          )}
        </div>
      )}

      {Boolean(apiError) && <ErrorAlert className="panel-note has-error">{simulationErrorMessage(locale, apiError)}</ErrorAlert>}

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

