import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ComponentProps } from 'react'
import type { CertificationCatalogItem } from '@cert-prep/contracts/certification-contracts'
import type { SimulationHistoryItem, SimulationSnapshot } from '@cert-prep/contracts/simulation-contracts'
import { SimulationHistory } from './SimulationHistory'

const certification: CertificationCatalogItem = { id: 'cert-one', provider: 'google-cloud', name: { en: 'Cloud One', es: 'Nube Uno' }, examCode: null, sources: [] }
const active: SimulationSnapshot = {
  sessionId: 'active-1', certificationId: 'cert-one', createdAt: '2026-01-01T12:00:00.000Z', mode: 'real', language: 'en',
  status: 'active', questionCount: 20, currentIndex: 4, expiresAt: null, currentQuestion: null, practiceProgress: null, result: null,
}
const completed: SimulationHistoryItem = {
  id: 'complete-1', certificationId: 'cert-one', guideVersion: 1, mode: 'practice', language: 'es', completedAt: '2026-01-02T12:00:00.000Z',
  score: 80, totalQuestions: 20, correctAnswers: 16, correctAfterRetry: 2, answersRevealed: 0, incorrectAnswers: 2,
  domainBreakdown: [], topicBreakdown: [], focusBreakdown: [],
}
const defaults: ComponentProps<typeof SimulationHistory> = {
  locale: 'en', certification, certifications: [certification], currentGuide: undefined, history: [], loading: false, error: null,
  clearing: false, pendingSession: null, pendingLoading: false, pendingError: null, onRetry: () => {}, onRetryPending: () => {},
  onResume: async () => {}, onClear: () => {}, onDashboard: () => {},
  completedSessionAvailable: false, completedPrintableQuestions: [], onViewCompletedSession: () => {}, onDiscard: () => {}, discarding: false, discardError: null,
}
function render(overrides: Partial<ComponentProps<typeof SimulationHistory>>) {
  return renderToStaticMarkup(<SimulationHistory {...defaults} {...overrides} />)
}

describe('recent simulations', () => {
  test('shows an in-progress card alongside completed results without a fabricated score', () => {
    const html = render({ pendingSession: active, history: [completed] })
    expect(html).toContain('In progress')
    expect(html).toContain('Question 5 of 20')
    expect(html).toContain('Continue')
    expect(html).toContain('Discard')
    expect(html).toContain('80%')
    expect(html).toContain('Completed')
    expect(html).toContain('Score')
    expect(html).toContain('aria-label="Score"')
    expect(html).toContain('aria-label="Simulation progress"')
    expect((html.match(/history-score\"/g) ?? []).length).toBe(1)
  })
  test('shows completion and score labels in Spanish', () => {
    const html = render({ history: [completed], locale: 'es' })
    expect(html).toContain('Completada')
    expect(html).toContain('Calificación')
    expect(html).toContain('80%')
  })
  test('shows an active session with an explanation when no results exist', () => {
    const html = render({ pendingSession: active, locale: 'es' })
    expect(html).toContain('En progreso')
    expect(html).toContain('Pregunta 5 de 20')
    expect(html).toContain('Aún no hay simulaciones completadas')
    expect(html).toContain('Continuar')
  })
  test('keeps the empty state when there is no matching active session', () => {
    const html = render({ pendingSession: { ...active, certificationId: 'other-cert' } })
    expect(html).toContain('No results for this certification yet')
    expect(html).not.toContain('In progress')
    expect(html).not.toContain('Discard')
    expect(html).toContain('Go to the home page')
  })
  test('shows data from one query when the other query fails or is loading', () => {
    const pendingFailure = render({ history: [completed], pendingError: new Error('offline') })
    expect(pendingFailure).toContain('Your pending simulation could not be loaded')
    expect(pendingFailure).toContain('80%')
    const historyFailure = render({ pendingSession: active, error: new Error('offline') })
    expect(historyFailure).toContain('Your history could not be loaded')
    expect(historyFailure).toContain('In progress')
    const pendingLoading = render({ pendingLoading: true })
    expect(pendingLoading).toContain('Checking for a pending simulation')
    expect(pendingLoading).not.toContain('No results for this certification yet')
  })
  test('does not duplicate a result while the active-session cache is stale', () => {
    const html = render({ pendingSession: active, history: [{ ...completed, id: active.sessionId }] })
    expect(html).not.toContain('In progress')
    expect(html).toContain('80%')
  })
  test('offers the result even when history is unavailable or empty', () => {
    const html = render({ completedSessionAvailable: true, error: new Error('offline') })
    expect(html).toContain('View result')
    expect(html).toContain('available during this visit')
    expect(html).toContain('Your history could not be loaded')
    expect(render({ completedSessionAvailable: true, locale: 'es' })).toContain('Ver resultado')
  })
  test('offers printing only when the completed questions are available', () => {
    const questions = Array.from({ length: 20 }, (_, index) => ({ question: `Question ${index}`, answer: `Answer ${index}` }))
    const html = render({ completedSessionAvailable: true, completedPrintableQuestions: questions })
    expect(html).toContain('Print questions')
    expect(html).toContain('printable-answer-sheet')
    expect(html).toContain('Answer 19')
    const unavailable = render({ history: [completed] })
    expect(unavailable).toContain('Questions are not saved in your history')
    expect(unavailable).not.toContain('Print questions')
  })
  test('disables active-session actions while discarding and shows errors', () => {
    const html = render({ pendingSession: active, discarding: true, discardError: new Error('offline'), locale: 'es' })
    expect(html).toContain('Descartando…')
    expect((html.match(/disabled=""/g) ?? []).length).toBe(2)
    expect(html).toContain('role="alert"')
  })
})
