import { describe, expect, test } from 'bun:test'
import { hasClearlyDifferentLanguage } from '../apps/api/src/study-plans/language-validation'

const narrative = (summary: string, title: string, rationale: string, ...actions: string[]) => ({
  summary, recommendations: [{ title, rationale, actions }],
})

const english = narrative('Review the topics from your recent simulations.', 'Review your access policies', 'Practice with the official guide and understand how the policies work.', 'Complete the module and review each example.')
const spanish = narrative('Repasa los temas prioritarios de tus simulaciones.', 'Revisa las políticas de acceso', 'Practica con la guía oficial para entender cómo funcionan los permisos.', 'Completa los módulos y repasa cada ejemplo.')

describe('study plan language validation', () => {
  test('accepts narrative in its requested language and detects clearly opposite prose', () => {
    expect(hasClearlyDifferentLanguage(english, 'en')).toBe(false)
    expect(hasClearlyDifferentLanguage(english, 'es')).toBe(true)
    expect(hasClearlyDifferentLanguage(spanish, 'es')).toBe(false)
    expect(hasClearlyDifferentLanguage(spanish, 'en')).toBe(true)
  })
  test('allows product names and technical terms alongside Spanish or English prose', () => {
    expect(hasClearlyDifferentLanguage(narrative('Repasa las políticas de IAM para tus aplicaciones en Google Cloud.', 'Cloud Run IAM', 'Practica con la guía oficial para reforzar los permisos.', 'Revisa los roles en BigQuery y completa los módulos.'), 'es')).toBe(false)
    expect(hasClearlyDifferentLanguage(narrative('Review the policies for your Google Cloud applications.', 'Cloud Run IAM', 'Practice with the official guide to understand the roles.', 'Complete the module and review the examples.'), 'en')).toBe(false)
    expect(hasClearlyDifferentLanguage(narrative('Configura Cloud Run for Anthos.', 'Cloud Run for Anthos', 'Configura Cloud Run for Anthos.', 'Configura Cloud Run for Anthos.', 'Configura Cloud Run for Anthos.', 'Configura Cloud Run for Anthos.'), 'es')).toBe(false)
    expect(hasClearlyDifferentLanguage(narrative('Configura The Guide for Cloud and IAM.', 'The Guide for Cloud and IAM', 'Configura The Guide for Cloud and IAM.', 'Configura The Guide for Cloud and IAM.'), 'es')).toBe(false)
  })
  test('does not reject short or mixed text without strong evidence', () => {
    expect(hasClearlyDifferentLanguage(narrative('IAM', 'BigQuery', 'Cloud Run', 'Review'), 'es')).toBe(false)
    expect(hasClearlyDifferentLanguage(narrative('Review the guide and repasa la guía para tus prácticas.', 'IAM', 'Practice with la guía.', 'Completa los módulos.'), 'es')).toBe(false)
  })
})
