import { createHash } from 'node:crypto'
import type { CertificationCatalogItem } from '../../src/api/certification-contracts'
import { ApiException } from '../errors'
import type { CachedOfficialSources, SourcePageValidators, SourceSection } from './source-types'

const MAX_SOURCE_LENGTH = 1_000_000
const MAX_NORMALIZED_SOURCE_LENGTH = 40_000

type SourcePage = 'examGuide' | 'learningPath'
type SourceResult = {
  snapshot: CachedOfficialSources
  hash: string
}

type PageReadResult = {
  body: CachedOfficialSources['examGuide'] | CachedOfficialSources['learningPath']
  validators: SourcePageValidators
}

export type OfficialSourceReader = (
  certification: CertificationCatalogItem,
  previous?: CachedOfficialSources | null,
) => Promise<SourceResult>

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

function sourceUrl(certification: CertificationCatalogItem, page: SourcePage) {
  const kind = page === 'examGuide' ? 'exam-guide' : 'learning-path'
  const source = certification.sources.find((entry) => entry.kind === kind)
  if (!source) throw new ApiException(503, 'GUIDE_SOURCE_MISSING', 'Falta una fuente oficial para esta certificación.')

  const url = new URL(source.url)
  const allowed = page === 'examGuide'
    ? url.hostname === 'cloud.google.com' && url.pathname === '/learn/certification/guides/cloud-developer'
    : url.hostname === 'www.skills.google' && url.pathname === '/paths/19'
  if (!allowed) throw new ApiException(503, 'GUIDE_SOURCE_NOT_ALLOWED', 'La fuente configurada no está permitida.')
  return url.toString()
}

function cleanLine(value: string) {
  return value.replace(/\u00a0/g, ' ').replace(/[\t ]+/g, ' ').trim()
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_match, decimal: string) => String.fromCodePoint(Number(decimal)))
    .replace(/&#x([\da-f]+);/gi, (_match, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
}

function htmlLines(html: string) {
  return decodeEntities(html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|nav|footer)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<li\b[^>]*>/gi, '\n• ')
    .replace(/<br\b[^>]*>/gi, '\n')
    .replace(/<\/(?:h[1-6]|p|div|section|article|ul|ol|li|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, ' '))
    .split(/\r?\n/)
    .map(cleanLine)
    .filter(Boolean)
}

function parseGuideSections(html: string): SourceSection[] {
  const lines = htmlLines(html)
  const headers = lines.flatMap((line, index) => {
    const match = line.match(/^Section\s+(\d+):\s*(.*?)\s*\(~\s*(\d+)\s*%\s*of the exam\s*\)$/i)
    return match ? [{ index, number: Number(match[1]), title: cleanLine(match[2]), weight: Number(match[3]) }] : []
  })
  if (headers.length > 12) {
    throw new ApiException(502, 'GUIDE_SOURCE_TOO_LARGE', 'La guía oficial contiene demasiados dominios para procesar.')
  }

  return headers.map((header, headerIndex) => {
    const end = headers[headerIndex + 1]?.index ?? lines.length
    const sectionLines = lines.slice(header.index + 1, end)
    const subsectionHeaders = sectionLines.flatMap((line, index) => {
      const match = line.match(/^(\d+)\.(\d+)\s+(.+?)\.?$/)
      return match ? [{ index, number: `${match[1]}.${match[2]}`, title: cleanLine(match[3]) }] : []
    })

    const topics = subsectionHeaders.slice(0, 40).map((subsection, index) => {
      const subsectionEnd = subsectionHeaders[index + 1]?.index ?? sectionLines.length
      const details = sectionLines
        .slice(subsection.index + 1, subsectionEnd)
        .filter((line) => line.startsWith('• '))
        .map((line) => line.slice(2))
        .join(' ')
        .slice(0, 1_000)

      return {
        id: `topic-${header.number}-${subsection.number.replace('.', '-')}`,
        title: subsection.title.slice(0, 240),
        details,
      }
    })
    const fallbackTopics = sectionLines
      .filter((line) => line.startsWith('• '))
      .slice(0, 12)
      .map((line, index) => ({
        id: `topic-${header.number}-${index + 1}`,
        title: cleanLine(line.slice(2)).slice(0, 240),
        details: '',
      }))

    return {
      number: header.number,
      title: header.title,
      weight: header.weight,
      topics: topics.length ? topics : fallbackTopics.length ? fallbackTopics : [{
        id: `topic-${header.number}-1`,
        title: header.title.slice(0, 240),
        details: '',
      }],
    }
  })
}

function parseLearningPathActivities(html: string) {
  const lines = htmlLines(html)
  const activities: string[] = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].replace(/^•\s*/, '')
    const inline = line.match(/^\d{1,2}[.)]?\s+(.+)$/)
    if (inline) activities.push(cleanLine(inline[1]).slice(0, 240))
    else if (/^\d{1,2}[.)]?$/.test(line) && lines[index + 1]) {
      activities.push(cleanLine(lines[index + 1].replace(/^•\s*/, '')).slice(0, 240))
      index += 1
    }
  }

  return [...new Set(activities)].slice(0, 20)
}

function readPage(
  url: string,
  page: 'examGuide',
  previous: CachedOfficialSources | null | undefined,
  fetcher: Fetcher,
): Promise<{ body: CachedOfficialSources['examGuide']; validators: SourcePageValidators }>
function readPage(
  url: string,
  page: 'learningPath',
  previous: CachedOfficialSources | null | undefined,
  fetcher: Fetcher,
): Promise<{ body: CachedOfficialSources['learningPath']; validators: SourcePageValidators }>
function readPage(
  url: string,
  page: SourcePage,
  previous: CachedOfficialSources | null | undefined,
  fetcher: Fetcher,
): Promise<PageReadResult>
async function readPage(
  url: string,
  page: SourcePage,
  previous: CachedOfficialSources | null | undefined,
  fetcher: Fetcher,
): Promise<PageReadResult> {
  const cached = previous?.[page]
  const requestHeaders = new Headers({ accept: 'text/html' })
  if (cached?.validators.etag) requestHeaders.set('if-none-match', cached.validators.etag)
  if (cached?.validators.lastModified) requestHeaders.set('if-modified-since', cached.validators.lastModified)

  let response: Response
  try {
    response = await fetcher(url, { headers: requestHeaders, signal: AbortSignal.timeout(15_000) })
  } catch {
    throw new ApiException(503, 'GUIDE_SOURCE_UNAVAILABLE', 'No se pudo consultar la guía oficial. Intenta de nuevo.')
  }

  const finalUrl = response.url ? new URL(response.url) : new URL(url)
  const finalHostAllowed = page === 'examGuide'
    ? finalUrl.hostname === 'cloud.google.com'
    : finalUrl.hostname === 'www.skills.google' || finalUrl.hostname === 'skills.google'
  if (!finalHostAllowed) {
    throw new ApiException(502, 'GUIDE_SOURCE_REDIRECT_BLOCKED', 'La fuente oficial redirigió a un dominio no permitido.')
  }

  if (response.status === 304) {
    if (!cached) {
      throw new ApiException(502, 'GUIDE_SOURCE_INVALID', 'La fuente indicó que no hubo cambios sin una versión local para reutilizar.')
    }
    return {
      body: cached,
      validators: {
        etag: response.headers.get('etag') ?? cached.validators.etag,
        lastModified: response.headers.get('last-modified') ?? cached.validators.lastModified,
      },
    }
  }
  if (!response.ok) {
    throw new ApiException(503, 'GUIDE_SOURCE_UNAVAILABLE', 'No se pudo consultar la guía oficial. Intenta de nuevo.')
  }

  const contentLength = Number(response.headers.get('content-length'))
  if (contentLength > MAX_SOURCE_LENGTH) {
    throw new ApiException(502, 'GUIDE_SOURCE_TOO_LARGE', 'La fuente oficial devolvió demasiado contenido.')
  }
  const html = await response.text()
  if (html.length > MAX_SOURCE_LENGTH) {
    throw new ApiException(502, 'GUIDE_SOURCE_TOO_LARGE', 'La fuente oficial devolvió demasiado contenido.')
  }
  const validators = {
    etag: response.headers.get('etag'),
    lastModified: response.headers.get('last-modified'),
  }
  if (page === 'examGuide') {
    const sections = parseGuideSections(html)
    if (sections.length === 0) {
      throw new ApiException(502, 'GUIDE_SOURCE_INVALID', 'No se encontraron dominios en la guía oficial.')
    }
    return { body: { sections, validators }, validators }
  }
  return { body: { activities: parseLearningPathActivities(html), validators }, validators }
}

export function createOfficialSourceReader(fetcher: Fetcher = fetch): OfficialSourceReader {
  return async (certification, previous) => {
    const [examGuide, learningPath] = await Promise.all([
      readPage(sourceUrl(certification, 'examGuide'), 'examGuide', previous, fetcher),
      readPage(sourceUrl(certification, 'learningPath'), 'learningPath', previous, fetcher),
    ])

    const snapshot: CachedOfficialSources = {
      examGuide: { ...examGuide.body, validators: examGuide.validators },
      learningPath: { ...learningPath.body, validators: learningPath.validators },
    }
    const normalizedContent = JSON.stringify({
      sections: snapshot.examGuide.sections,
      activities: snapshot.learningPath.activities,
    })
    if (normalizedContent.length > MAX_NORMALIZED_SOURCE_LENGTH) {
      throw new ApiException(502, 'GUIDE_SOURCE_TOO_LARGE', 'La guía oficial excede el límite para procesar.')
    }
    return { snapshot, hash: createHash('sha256').update(normalizedContent).digest('hex') }
  }
}
