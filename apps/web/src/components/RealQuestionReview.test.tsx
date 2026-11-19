import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { RealQuestionReview } from './RealQuestionReview'

describe('real question review', () => {
  test('shows the correct answer and existing AI explanation after completion', () => {
    const html = renderToStaticMarkup(<RealQuestionReview locale="en" questionLanguage="en" source="ai" mode="real" questions={[{ id: 'one', question: 'A fictional question', answer: 'The correct answer', explanation: 'A fictional explanation', review: { outcome: 'incorrect', attempts: [{ number: 1, answer: 'Wrong choice', correct: false }], missingAttempts: 0 } }]} />)
    expect(html).toContain('The correct answer')
    expect(html).toContain('Your answer')
    expect(html).toContain('Wrong choice')
    expect(html).toContain('Incorrect')
    expect(html).toContain('A fictional explanation')
    expect(html).not.toContain('Generating explanation')
  })
  test('shows an English question with a Spanish interface and a temporary-review notice', () => {
    const html = renderToStaticMarkup(<RealQuestionReview locale="es" questionLanguage="en" source="advanced" mode="real" sessionId="session" questions={[{ id: 'one', question: 'A fictional question', answer: 'The correct answer' }]} />)
    expect(html).toContain('Revisión de preguntas')
    expect(html).toContain('lang="en">A fictional question')
    expect(html).toContain('Generando explicación')
    expect(html).toContain('ya no podrás volver a consultar')
    expect(html).toContain('Tu selección no está disponible')
  })
  test('distinguishes guided practice retries, missing attempts, and a reveal without selection', () => {
    const html = renderToStaticMarkup(<RealQuestionReview locale="es" questionLanguage="es" source="ai" mode="practice" questions={[
      { question: 'Pregunta uno', answer: 'Correcta', review: { outcome: 'retry', attempts: [{ number: 2, answer: 'Correcta', correct: true }], missingAttempts: 1 } },
      { question: 'Pregunta dos', answer: 'Correcta', review: { outcome: 'revealed', attempts: [], missingAttempts: 0 } },
    ]} />)
    expect(html).toContain('Intento 2')
    expect(html).toContain('Correcta después de reintentar')
    expect(html).toContain('Algunas selecciones anteriores no están disponibles')
    expect(html).toContain('Revelaste la respuesta sin seleccionar una opción')
  })
})
