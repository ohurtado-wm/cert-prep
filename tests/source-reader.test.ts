import { readFile } from 'node:fs/promises'
import { describe, expect, test } from 'bun:test'
import { certificationCatalog } from '../server/catalog/certifications'
import { createOfficialSourceReader } from '../server/catalog/source-reader'

const examGuideFixture = await readFile(new URL('./fixtures/cloud-developer-guide.html', import.meta.url), 'utf8')
const learningPathFixture = await readFile(new URL('./fixtures/cloud-developer-learning-path.html', import.meta.url), 'utf8')

describe('official certification sources', () => {
  test('extracts weighted domains, numbered topics, and learning-path activities', async () => {
    const reader = createOfficialSourceReader(async (input) => {
      const isGuide = String(input).includes('/guides/')
      return new Response(isGuide ? examGuideFixture : learningPathFixture, {
        headers: { etag: isGuide ? 'guide-v1' : 'path-v1' },
      })
    })

    const result = await reader(certificationCatalog[0])
    expect(result.snapshot.examGuide.sections.map((section) => section.weight)).toEqual([33, 26, 19, 22])
    expect(result.snapshot.examGuide.sections[0]?.topics.map((topic) => topic.id)).toEqual([
      'topic-1-1-1',
      'topic-1-1-2',
    ])
    expect(result.snapshot.learningPath.activities).toEqual([
      'Fundamentals Course',
      'Development Course',
      'Deployment Course',
    ])
    expect(result.snapshot.examGuide.validators.etag).toBe('guide-v1')
  })

  test('reuses cached source snapshots on HTTP 304 and sends validators', async () => {
    const firstReader = createOfficialSourceReader(async (input) => new Response(
      String(input).includes('/guides/') ? examGuideFixture : learningPathFixture,
      { headers: { etag: String(input).includes('/guides/') ? 'guide-v1' : 'path-v1' } },
    ))
    const initial = await firstReader(certificationCatalog[0])
    const sentHeaders: Headers[] = []
    const conditionalReader = createOfficialSourceReader(async (_input, init) => {
      sentHeaders.push(new Headers(init?.headers))
      return new Response(null, { status: 304 })
    })

    const refreshed = await conditionalReader(certificationCatalog[0], initial.snapshot)
    expect(refreshed.hash).toBe(initial.hash)
    expect(sentHeaders.map((headers) => headers.get('if-none-match'))).toEqual(['guide-v1', 'path-v1'])
    expect(refreshed.snapshot.examGuide.sections).toEqual(initial.snapshot.examGuide.sections)
  })

  test('rejects an official page when no exam domains can be parsed', async () => {
    const reader = createOfficialSourceReader(async () => new Response('<html><body>maintenance</body></html>'))
    await expect(reader(certificationCatalog[0])).rejects.toMatchObject({
      code: 'GUIDE_SOURCE_INVALID',
      status: 502,
    })
  })

  test('rejects a 304 response when there is no cached source to reuse', async () => {
    const reader = createOfficialSourceReader(async () => new Response(null, { status: 304 }))
    await expect(reader(certificationCatalog[0])).rejects.toMatchObject({
      code: 'GUIDE_SOURCE_INVALID',
      status: 502,
    })
  })

  test('blocks redirects outside the registered official host', async () => {
    const reader = createOfficialSourceReader(async (input) => {
      const response = new Response(String(input).includes('/guides/') ? examGuideFixture : learningPathFixture)
      if (String(input).includes('/guides/')) {
        Object.defineProperty(response, 'url', { value: 'https://attacker.example/guide' })
      }
      return response
    })
    await expect(reader(certificationCatalog[0])).rejects.toMatchObject({
      code: 'GUIDE_SOURCE_REDIRECT_BLOCKED',
      status: 502,
    })
  })

  test('accepts Google Skills canonical redirects', async () => {
    const reader = createOfficialSourceReader(async (input) => {
      const response = new Response(String(input).includes('/guides/') ? examGuideFixture : learningPathFixture)
      if (String(input).includes('/paths/')) {
        Object.defineProperty(response, 'url', { value: 'https://www.skills.google/paths/19?locale=en' })
      }
      return response
    })

    const result = await reader(certificationCatalog[0])
    expect(result.snapshot.examGuide.sections).toHaveLength(4)
  })
})
