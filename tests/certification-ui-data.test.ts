import { readFile } from 'node:fs/promises'
import { describe, expect, test } from 'bun:test'
import { certificationCatalog } from '../server/catalog/certifications'
import { loadCertificationCatalog, loadCertificationGuide, CertificationApiError } from '../src/api/certifications'
import { loadCertifications, QuestionBankLoadError } from '../src/data/load-certification'
import { getTranslationKeys, translate } from '../src/i18n/messages'
import { readLocalePreference, writeLocalePreference } from '../src/i18n/preferences'

const spanishBank = await readFile(new URL('./fixtures/certifications-es.json', import.meta.url), 'utf8')
const englishBank = await readFile(new URL('./fixtures/certifications-en.json', import.meta.url), 'utf8')

function staticBankFetcher(english = englishBank): (input: RequestInfo | URL) => Promise<Response> {
  return async (input) => String(input).endsWith('.en.json')
    ? new Response(english)
    : new Response(spanishBank)
}

describe('localized certification UI data', () => {
  test('persists a valid locale independently through its own preference key', () => {
    const values = new Map<string, string>()
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    }

    writeLocalePreference(storage, 'en')
    expect(readLocalePreference(storage)).toBe('en')
    expect(values.get('cert-helper-locale')).toBe('en')
    expect(values.has('cert-helper-theme')).toBe(false)
  })

  test('both locales preserve certification, domain, question, and answer IDs and correctness', async () => {
    const [es, en] = await Promise.all([
      loadCertifications('es', staticBankFetcher()),
      loadCertifications('en', staticBankFetcher()),
    ])
    const spanish = es[0]!
    const english = en[0]!

    expect(english.id).toBe(spanish.id)
    expect(english.language).toBe('en')
    expect(english.topics.map(({ id }) => id)).toEqual(spanish.topics.map(({ id }) => id))
    expect(english.questions.map(({ id }) => id)).toEqual(spanish.questions.map(({ id }) => id))
    expect(english.questions[0]?.question).not.toBe(spanish.questions[0]?.question)
    expect(english.questions.map((question) => question.answers.map(({ id, isCorrect }) => ({ id, isCorrect }))))
      .toEqual(spanish.questions.map((question) => question.answers.map(({ id, isCorrect }) => ({ id, isCorrect }))))
    expect(english.questions).toHaveLength(20)
  })

  test('rejects an incomplete translation overlay rather than displaying mixed-language content', async () => {
    const incomplete = JSON.parse(englishBank) as {
      certifications: Array<{ questions: Array<{ answers: unknown[] }> }>
    }
    incomplete.certifications[0]!.questions[0]!.answers.pop()

    await expect(loadCertifications('en', staticBankFetcher(JSON.stringify(incomplete))))
      .rejects.toMatchObject({ code: 'QUESTION_TRANSLATION_MISSING' })
  })

  test('locale dictionaries cover the same UI keys and support interpolation', () => {
    expect(getTranslationKeys('es').sort()).toEqual(getTranslationKeys('en').sort())
    expect(translate('en', 'questionCounter', { current: 3, total: 20 })).toBe('Question 3 of 20')
    expect(translate('es', 'questionCounter', { current: 3, total: 20 })).toBe('Pregunta 3 de 20')
  })
})

describe('certification API client', () => {
  test('loads and validates the localized catalog response', async () => {
    let requestedPath = ''
    const catalog = await loadCertificationCatalog(async (input) => {
      requestedPath = String(input)
      return Response.json({ certifications: certificationCatalog })
    })

    expect(requestedPath).toBe('/api/v1/certifications')
    expect(catalog[0]?.name.es).toBeTruthy()
  })

  test('returns a validated guide and reports stable API error codes', async () => {
    const item = certificationCatalog[0]!
    const payload = {
      guide: {
        certification: item,
        version: 1,
        domains: [{
          id: 'section-1',
          sourceSectionNumber: 1,
          name: { en: 'Design', es: 'Diseño' },
          description: { en: 'Build for scale.', es: 'Diseña para escalar.' },
          weight: 100,
          topics: [{ id: 'topic-1-1', name: { en: 'APIs', es: 'APIs' }, description: { en: 'API design.', es: 'Diseño de API.' } }],
        }],
        studyPath: [{
          id: 'step-1',
          title: { en: 'Review design', es: 'Revisar diseño' },
          description: { en: 'Start here.', es: 'Empieza aquí.' },
          domainIds: ['section-1'],
          url: item.sources[0]!.url,
        }],
        sources: item.sources,
        freshness: { sourceCheckedAt: '2026-09-30T12:00:00.000Z', aiRefreshedAt: '2026-09-30T12:00:00.000Z' },
      },
    }
    let requestedPath = ''
    const guide = await loadCertificationGuide(item.id, async (input) => {
      requestedPath = String(input)
      return Response.json(payload)
    })
    expect(requestedPath).toBe(`/api/v1/certifications/${item.id}/guide`)
    expect(guide.domains[0]?.id).toBe('section-1')

    const unavailable = loadCertificationGuide(item.id, async () => Response.json(
      { error: { code: 'GUIDE_AI_UNAVAILABLE', message: 'internal provider details' } },
      { status: 503 },
    ))
    await expect(unavailable).rejects.toBeInstanceOf(CertificationApiError)
    await expect(unavailable).rejects.toMatchObject({ code: 'GUIDE_AI_UNAVAILABLE' })
  })

  test('rejects malformed successful responses with a stable error', async () => {
    await expect(loadCertificationCatalog(async () => Response.json({ certifications: [{ id: 'bad' }] })))
      .rejects.toMatchObject({ code: 'INVALID_API_RESPONSE' })
  })
})

test('invalid locale bank data remains a recoverable load error', async () => {
  await expect(loadCertifications('en', async (input) => String(input).endsWith('.en.json')
    ? new Response('{invalid json')
    : new Response(spanishBank))).rejects.toBeInstanceOf(QuestionBankLoadError)
})
