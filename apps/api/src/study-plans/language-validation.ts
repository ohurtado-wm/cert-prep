import type { Locale } from '@cert-prep/contracts/certification-contracts'

type Narrative = { summary: string; recommendations: Array<{ title: string; rationale: string; actions: string[] }> }

// Common function words and study verbs, excluding cloud-product names and acronyms.
// This is deliberately conservative: insufficient evidence never causes rejection.
const markers: Record<Locale, ReadonlySet<string>> = {
  en: new Set(['the', 'and', 'your', 'with', 'this', 'these', 'those', 'that', 'for', 'from', 'how', 'you', 'each', 'their', 'through', 'while', 'review', 'practice', 'understand', 'complete', 'learn', 'using', 'should', 'before', 'after']),
  es: new Set(['el', 'la', 'los', 'las', 'del', 'para', 'con', 'una', 'unos', 'unas', 'sus', 'tus', 'que', 'como', 'antes', 'despues', 'mediante', 'revisa', 'repasa', 'practica', 'aprende', 'completa', 'utiliza', 'debes', 'refuerza']),
}

export function hasClearlyDifferentLanguage(draft: Narrative, requested: Locale): boolean {
  // Titles often consist entirely of official product names. Assess the prose
  // across fields, requiring varied words rather than repetitions of one term.
  const fields = [draft.summary, ...draft.recommendations.flatMap(({ rationale, actions }) => [rationale, ...actions])]
  const wordGroups = fields.map((field) => field.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().match(/\p{L}+/gu) ?? [])
  const count = (language: Locale) => wordGroups.flat().reduce((total, word) => total + Number(markers[language].has(word)), 0)
  const expected = count(requested)
  const other = requested === 'es' ? 'en' : 'es'
  const otherWords = wordGroups.flat().filter((word) => markers[other].has(word))
  const fieldsWithEvidence = wordGroups.filter((words) => words.some((word) => markers[other].has(word))).length
  return new Set(otherWords).size >= 5 && fieldsWithEvidence >= 2 && otherWords.length >= expected * 3 + 3
}
