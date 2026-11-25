import type { Locale } from '@cert-prep/contracts/certification-contracts'
import { translate } from '../i18n/messages'
import type { GuideDomain } from '@cert-prep/contracts/certification-contracts'
import type { AiTokenUsage as AiTokenUsageData } from '@cert-prep/contracts/ai-usage-contracts'
import type { SimulationAnswerResponse, SimulationMode, SimulationQuestion, SimulationSnapshot, PracticeQuestionProgress } from '@cert-prep/contracts/simulation-contracts'
import { AiTokenUsage } from './AiTokenUsage'
import { QuestionCard } from './QuestionCard'

export function QuizScreen({
  locale,
  questionLanguage,
  certificationName,
  domains,
  currentQuestion,
  questionIndex,
  practiceProgress,
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
  questionLanguage: Locale
  certificationName: string
  domains: GuideDomain[]
  currentQuestion: SimulationQuestion | null
  questionIndex: number
  practiceProgress: PracticeQuestionProgress | null
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
  const question = currentQuestion
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
          questionLanguage={questionLanguage}
          question={question}
          domain={domains.find(({ id }) => id === question.domainId)}
          simulationMode={simulationMode}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          practiceProgress={practiceProgress}
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

