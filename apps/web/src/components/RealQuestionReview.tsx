import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@cert-prep/contracts/certification-contracts'
import type { PrintableSimulationQuestion, QuestionSource, SimulationMode } from '@cert-prep/contracts/simulation-contracts'
import { closeSimulationReview, generateQuestionExplanation } from '../api/simulations'
import { translate } from '../i18n/messages'

type ExplanationState = { text?: string; loading?: boolean; failed?: boolean }

export function RealQuestionReview({ locale, questionLanguage, questions, source, sessionId, mode }: {
  locale: Locale; questionLanguage: Locale; questions: PrintableSimulationQuestion[]; source: QuestionSource; sessionId?: string; mode: SimulationMode
}) {
  const [states, setStates] = useState<Record<string, ExplanationState>>({})
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)

  useEffect(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    if (source !== 'advanced' || !sessionId) return
    const abort = new AbortController()
    let active = true
    const pending = questions.filter((item) => item.id && !item.explanation)
    async function worker() {
      while (active && pending.length) {
        const item = pending.shift()!
        const id = item.id!
        setStates((current) => ({ ...current, [id]: { loading: true } }))
        try {
          const result = await generateQuestionExplanation(sessionId!, id, abort.signal)
          if (active) setStates((current) => ({ ...current, [id]: { text: result.explanation } }))
        } catch {
          if (active) setStates((current) => ({ ...current, [id]: { failed: true } }))
        }
      }
    }
    void Promise.all([worker(), worker()])
    return () => {
      active = false
      abort.abort()
      closeTimer.current = setTimeout(() => void closeSimulationReview(sessionId), 0)
    }
  }, [source, sessionId, questions])

  async function retry(id: string) {
    if (!sessionId || states[id]?.loading) return
    setStates((current) => ({ ...current, [id]: { loading: true } }))
    try {
      const result = await generateQuestionExplanation(sessionId, id)
      setStates((current) => ({ ...current, [id]: { text: result.explanation } }))
    } catch {
      setStates((current) => ({ ...current, [id]: { failed: true } }))
    }
  }

  return <section className="real-review" aria-labelledby="real-review-title">
    <h2 id="real-review-title">{text('reviewQuestionsTitle')}</h2>
    {source === 'advanced' && <p className="real-review-notice" role="note">{text('reviewQuestionsNotice')}</p>}
    <ol className="real-review-list">{questions.map((item, index) => {
      const state = item.id ? states[item.id] : undefined
      const explanation = item.explanation ?? state?.text
      const review = item.review
      const outcomeKey = review?.outcome === 'first_try' ? 'reviewOutcomeCorrect'
        : review?.outcome === 'retry' ? 'reviewOutcomeRetry'
          : review?.outcome === 'revealed' ? 'reviewOutcomeRevealed' : 'reviewOutcomeIncorrect'
      return <li className="real-review-item" key={item.id ?? index}>
        <div className="review-question-heading">
          <p className="review-question-text" lang={questionLanguage}>{item.question}</p>
          {review && <span className={`review-outcome review-outcome-${review.outcome}`}>{text(outcomeKey)}</span>}
        </div>
        <div className="review-answer-details">
          {!review ? <p>{text('reviewSelectionUnavailable')}</p> : <>
            {review.missingAttempts > 0 && <p>{text('reviewSomeSelectionsUnavailable')}</p>}
            {review.attempts.length > 0 && <ol className="review-attempts">{review.attempts.map((attempt) => <li key={attempt.number} className="review-attempt">
              <span className="review-attempt-label">{mode === 'real' ? text('reviewYourAnswer') : text('reviewAttempt', { number: attempt.number })}</span>
              <span className="review-attempt-answer" lang={questionLanguage}>{attempt.answer}</span>
              <span className={`review-attempt-status ${attempt.correct ? 'is-correct' : 'is-incorrect'}`}>{text(attempt.correct ? 'reviewOutcomeCorrect' : 'reviewOutcomeIncorrect')}</span>
            </li>)}</ol>}
            {review.attempts.length === 0 && review.missingAttempts === 0 && review.outcome === 'revealed' && <p>{text('reviewRevealedWithoutSelection')}</p>}
          </>}
          <p className="review-correct-answer"><strong>{text('reviewCorrectAnswer')}:</strong> <span lang={questionLanguage}>{item.answer}</span></p>
        </div>
        {explanation && <p className="review-explanation"><strong>{text('reviewExplanation')}:</strong> <span lang={questionLanguage}>{explanation}</span></p>}
        {!explanation && source === 'advanced' && <div>
          {state?.loading || !state ? <p role="status">{text('reviewExplanationLoading')}</p> : <><p role="alert">{text('reviewExplanationUnavailable')}</p>{item.id && <button className="button button-secondary" type="button" onClick={() => void retry(item.id!)}>{text('reviewExplanationRetry')}</button>}</>}
        </div>}
      </li>
    })}</ol>
  </section>
}
