import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ComponentProps } from 'react'
import type { StudyPlan } from '@cert-prep/contracts/study-plan-contracts'
import { StudyPlanPanel } from './StudyPlanPanel'

const plan: StudyPlan = {
  id: 'plan-1', certificationId: 'cert-one', language: 'en', basedOnSessions: 2,
  createdAt: '2026-01-02T12:00:00.000Z', summary: 'Review the fundamentals.', aiUsage: null,
  recommendations: [{
    targetKind: 'topic', targetId: 'topic-1', domainId: 'domain-1', label: 'Security', priority: 1,
    evidence: { correct: 3, total: 4, incorrect: 1, accuracy: 75 },
    title: 'Review access controls', rationale: 'Practice applying least privilege.',
    actions: ['Review IAM roles', 'Practice with policies'],
    resource: { title: 'Official guide', url: 'https://example.com/guide' },
  }],
}
const defaults: ComponentProps<typeof StudyPlanPanel> = {
  locale: 'en', certificationName: 'Cloud One', available: true, historyCount: 2, historyLoading: false,
  historyError: null, onRetryHistory: () => {}, guideReady: true, guideLoading: false, guideError: null,
  onRetryGuide: () => {}, plan: null, planLoading: false, planError: null, generating: false,
  generationError: null, onRetry: () => {}, onGenerate: () => {},
}
function render(overrides: Partial<ComponentProps<typeof StudyPlanPanel>>) {
  return renderToStaticMarkup(<StudyPlanPanel {...defaults} {...overrides} />)
}

describe('suggested study plan', () => {
  test('shows the certification and next step when no plan has been generated', () => {
    const html = render({})
    expect(html).toContain('Cloud One')
    expect(html).toContain('Your study plan is ready to create')
    expect(html).toContain('Suggest a study plan')
  })
  test('shows the plan, evidence, actions and the original official resource', () => {
    const html = render({ plan })
    expect(html).toContain('Review the fundamentals.')
    expect(html).toContain('Priority 1')
    expect(html).toContain('75%')
    expect(html).toContain('3 of 4 correct on the first attempt')
    expect(html).toContain('Review IAM roles')
    expect(html).toContain('href="https://example.com/guide"')
    expect(html).toContain('Official guide')
    expect(html).toContain('Regenerate plan')
    expect(html).not.toContain('Warning: plan generated in another language')
  })
  test('explains a saved plan in the other language without hiding it', () => {
    const spanishUi = render({ locale: 'es', plan })
    expect(spanishUi).toContain('Aviso: plan generado en otro idioma')
    expect(spanishUi).toContain('Este plan se generó en inglés.')
    expect(spanishUi).toContain('para obtener un nuevo plan en español')
    expect(spanishUi).toContain('Regenerar plan')
    expect(spanishUi).toContain('lang="en">Review the fundamentals.')
    const englishUi = render({ plan: { ...plan, language: 'es', summary: 'Repasa los temas.' } })
    expect(englishUi).toContain('Warning: plan generated in another language')
    expect(englishUi).toContain('This plan was generated in Spanish.')
    expect(englishUi).toContain('to create a new plan in English')
    expect(englishUi).toContain('lang="es">Repasa los temas.')
    expect(render({ locale: 'es', plan: { ...plan, language: 'es' } })).not.toContain('Aviso: plan generado en otro idioma')
  })
  test('keeps the mismatch and existing plan visible while generating or after an error', () => {
    const generating = render({ locale: 'es', plan, generating: true })
    expect(generating).toContain('Aviso: plan generado en otro idioma')
    expect(generating).toContain('Preparando recomendaciones')
    const failed = render({ locale: 'es', plan, generationError: new Error('failed') })
    expect(failed).toContain('No se pudo generar el plan de estudio')
    expect(failed).toContain('Review the fundamentals.')
  })
  test('explains why generation is unavailable while the guide fails', () => {
    const html = render({ guideReady: false, guideError: new Error('failed') })
    expect(html).toContain('We could not prepare the study guide')
    expect(html).toContain('Prepare the guide again')
    expect(html).toContain('disabled=""')
    expect(html).not.toContain('Your study plan is ready to create')
  })
  test('shows history loading and errors without suggesting a plan is ready', () => {
    expect(render({ historyLoading: true })).toContain('Loading your history')
    expect(render({ historyError: new Error('failed') })).toContain('Your history could not be loaded')
  })
})
