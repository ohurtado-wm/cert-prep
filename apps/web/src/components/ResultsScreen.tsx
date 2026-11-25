import { ErrorAlert } from './ErrorAlert'
import type { Locale } from '@cert-prep/contracts/certification-contracts'
import { translate } from '../i18n/messages'
import type { CertificationGuideResponse } from '@cert-prep/contracts/certification-contracts'
import type { AiTokenUsage as AiTokenUsageData } from '@cert-prep/contracts/ai-usage-contracts'
import type { SimulationMode, PrintableSimulationQuestion, SimulationResult } from '@cert-prep/contracts/simulation-contracts'
import { AiTokenUsage } from './AiTokenUsage'
import { RealQuestionReview } from './RealQuestionReview'
import { simulationErrorMessage } from '../i18n/error-messages'

const topicColors = ['#F900D3', '#00E8FA', '#1DD566', '#FFC700']

export function ResultsScreen({
  locale,
  certificationName,
  guide,
  result,
  printableQuestions,
  simulationMode,
  questionSource,
  sessionId,
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
  printableQuestions: PrintableSimulationQuestion[]
  simulationMode: SimulationMode
  questionSource: 'ai' | 'advanced'
  sessionId?: string
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
                <div className="results-topic-name"><h3>{item.name}</h3><span>{item.total} {text('questionsLabel', { count: item.total })}</span></div>
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
                <div className="results-topic-name"><h3>{item.name}</h3><span>{item.total} {text('questionsLabel', { count: item.total })}</span></div>
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

      {printableQuestions.length === 20 && <RealQuestionReview locale={locale} questionLanguage={questionSource === 'advanced' ? 'en' : locale} questions={printableQuestions} source={questionSource} sessionId={sessionId} mode={simulationMode} />}
      <div className="results-actions">
        {printableQuestions.length === 20 && (
          <button className="button button-secondary" type="button" onClick={() => window.print()}>
            {text('printQuestions')}
          </button>
        )}
        <button className="button button-primary" type="button" onClick={onRestart} disabled={restarting}>
          {restarting ? text('startingSimulation') : simulationMode === 'real' ? text('restartReal') : text('practiceAgain')}
        </button>
        <button className="button button-secondary" type="button" onClick={onHome} disabled={restarting}>{text('backHome')}</button>
      </div>
      {Boolean(startError) && <ErrorAlert className="results-api-error">{simulationErrorMessage(locale, startError)}</ErrorAlert>}
      <p className="results-disclaimer">{text('practiceDisclaimer')}</p>
      <ol className="printable-answer-sheet" aria-hidden="true">
        {printableQuestions.map((item, index) => (
          <li key={`${index}-${item.question}`}>
            <span>{item.question}</span>
            <p>- {item.answer}</p>
          </li>
        ))}
      </ol>
    </main>
  )
}

