import { generateText, Output } from 'ai'
import { createHash } from 'node:crypto'
import { z } from 'zod'
import type { AiTokenUsage } from '../../src/api/ai-usage-contracts'
import {
  GuideResearchSourceSchema,
  GuideWeightRangeSchema,
  type CertificationProvider,
  type CertificationCatalogItem,
  type GuideResearchSource,
} from '../../src/api/certification-contracts'
import { ApiException } from '../errors'
import { createAiProvider } from '../ai/model-provider'
import { readAiMaxOutputTokens } from '../ai/output-token-limits'
import { AI_REQUEST_TIMEOUT_MS } from '../ai/request-timeout'
import { errorLogDetails, logServerEvent } from '../logger'

const LocalizedText = z.object({ en: z.string().min(1), es: z.string().min(1) })

export const GuideDraftSchema = z.object({
  domains: z.array(z.object({
    sectionNumber: z.number().int().positive(),
    weight: z.number().positive().max(100),
    weightRange: GuideWeightRangeSchema,
    name: LocalizedText,
    description: LocalizedText,
    topics: z.array(z.object({
      name: LocalizedText,
      description: LocalizedText,
    })).min(1).max(40),
  })).min(1).max(12),
  studyPath: z.array(z.object({
    title: LocalizedText,
    description: LocalizedText,
    domainIds: z.array(z.string().min(1)).min(1).max(12),
  })).min(3).max(6),
})

export type GuideDraft = z.infer<typeof GuideDraftSchema>
export type GuideGeneration = {
  output: GuideDraft
  usage?: AiTokenUsage
  researchSources: GuideResearchSource[]
}
export type GuideGenerator = (input: { certification: CertificationCatalogItem }) => Promise<GuideDraft | GuideGeneration>

const ALLOWED_RESEARCH_DOMAINS: Record<CertificationProvider, string[]> = {
  'google-cloud': ['cloud.google.com', 'services.google.com', 'skills.google', 'cloudskillsboost.google'],
  'microsoft-azure': ['learn.microsoft.com'],
}

function allowedResearchDomains(provider: CertificationProvider) {
  return ALLOWED_RESEARCH_DOMAINS[provider]
}

function providerName(provider: CertificationProvider) {
  return provider === 'google-cloud' ? 'Google Cloud' : 'Microsoft Azure'
}

function canonicalUrl(value: string) {
  const url = new URL(value)
  const hostname = url.hostname.toLowerCase().replace(/^www\./, '')
  let pathname = url.pathname.replace(/\/+$/, '') || '/'
  if (hostname === 'learn.microsoft.com') {
    pathname = pathname.replace(/^\/[a-z]{2,3}(?:-[a-z0-9]{2,8})*(?=\/)/i, '').toLowerCase() || '/'
  }
  return `${hostname}${pathname}`
}

export function isAllowedGuideResearchUrl(value: string, provider: CertificationProvider = 'google-cloud') {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && allowedResearchDomains(provider).some((domain) => (
      url.hostname === domain || url.hostname.endsWith(`.${domain}`)
    ))
  } catch {
    return false
  }
}

function expectedOfficialExamSourceWasCited(sources: GuideResearchSource[], certification: CertificationCatalogItem) {
  const expected = new Set(certification.sources
    .filter((source) => ['exam-guide', 'exam-details', 'certification'].includes(source.kind))
    .map((source) => canonicalUrl(source.url)))
  if (expected.size === 0) return false
  return sources.some((source) => expected.has(canonicalUrl(source.url)))
}

function sourceTitle(url: string, certification: CertificationCatalogItem) {
  const canonical = canonicalUrl(url)
  return certification.sources.find((source) => canonicalUrl(source.url) === canonical)?.title
    ?? new URL(url).hostname
}

export function collectGuideResearchSources(
  toolResults: unknown,
  certification: CertificationCatalogItem,
  responseSources?: unknown,
): GuideResearchSource[] {
  const citations = collectWebSearchCitations(toolResults, responseSources)
  const researchSources: GuideResearchSource[] = []
  const seen = new Set<string>()
  for (const citation of citations) {
    if (citation.type !== 'url' || !citation.url || !isAllowedGuideResearchUrl(citation.url, certification.provider)) continue
    const key = canonicalUrl(citation.url)
    if (seen.has(key)) continue
    seen.add(key)
    researchSources.push(GuideResearchSourceSchema.parse({
      title: citation.title ?? sourceTitle(citation.url, certification),
      url: citation.url,
    }))
    if (researchSources.length === 20) return researchSources
  }
  return researchSources
}

function collectWebSearchCitations(toolResults: unknown, responseSources?: unknown) {
  const resultSchema = z.array(z.object({ output: z.unknown() })).safeParse(toolResults)
  const citations: Array<{ type: string; url?: string; title?: string }> = []

  for (const toolResult of resultSchema.success ? resultSchema.data : []) {
    const outputSchema = z.object({
      action: z.object({ type: z.string(), url: z.string().nullish() }).nullish(),
      sources: z.array(z.object({ type: z.string(), url: z.string().optional(), title: z.string().optional() })).optional(),
    }).safeParse(toolResult.output)
    if (!outputSchema.success) continue
    citations.push(...(outputSchema.data.sources ?? []))
    const action = outputSchema.data.action
    if ((action?.type === 'openPage' || action?.type === 'findInPage') && action.url) {
      citations.push({ type: 'url', url: action.url })
    }
  }

  const responseSourcesSchema = z.array(z.unknown()).safeParse(responseSources)
  if (responseSourcesSchema.success) {
    const urlSourceSchema = z.object({
      sourceType: z.literal('url'),
      url: z.string(),
      title: z.string().optional(),
    })
    for (const source of responseSourcesSchema.data) {
      const parsedSource = urlSourceSchema.safeParse(source)
      if (parsedSource.success) {
        citations.push({ type: 'url', url: parsedSource.data.url, title: parsedSource.data.title })
      }
    }
  }

  return citations
}

function citationDiagnostics(toolResults: unknown, responseSources: unknown) {
  const parsedResults = z.array(z.object({ output: z.unknown() })).safeParse(toolResults)
  const actionTypes = new Set<string>()
  let toolSourceCount = 0

  for (const { output } of parsedResults.success ? parsedResults.data : []) {
    if (typeof output !== 'object' || output === null) continue
    const record = output as Record<string, unknown>
    if (Array.isArray(record.sources)) toolSourceCount += record.sources.length
    if (typeof record.action === 'object' && record.action !== null) {
      const actionType = (record.action as Record<string, unknown>).type
      if (typeof actionType === 'string') actionTypes.add(actionType.slice(0, 80))
    }
  }

  return {
    citationToolResultCount: parsedResults.success ? parsedResults.data.length : null,
    citationToolSourceCount: toolSourceCount,
    citationToolActionTypes: [...actionTypes].join(',').slice(0, 240) || null,
    citationResponseSourceCount: Array.isArray(responseSources) ? responseSources.length : null,
  }
}

function collectCitationUrlsForLog(toolResults: unknown, responseSources?: unknown) {
  const urls = new Set<string>()
  for (const citation of collectWebSearchCitations(toolResults, responseSources)) {
    if (citation.type !== 'url' || !citation.url) continue
    try {
      const url = new URL(citation.url)
      urls.add(`${url.protocol}//${url.hostname.toLowerCase()}${url.pathname}`.slice(0, 500))
    } catch {
      continue
    }
    if (urls.size === 20) break
  }
  return [...urls]
}

export function buildGuidePrompt(certification: CertificationCatalogItem) {
  const provider = providerName(certification.provider)
  const examSources = certification.sources.filter((source) => (
    ['exam-guide', 'exam-details', 'certification'].includes(source.kind)
  ))
  const learningPaths = certification.sources
    .filter((source) => source.kind === 'learning-path')
    .map((source) => `- ${source.title}: ${source.url}`)
    .join('\n')
  return [
    `Prepare the bilingual study guide for ${certification.name.en}.`,
    `Use the required web search to open and read the exact official exam guide and certification page below. The exam guide is authoritative for domain names, top-level section numbers, and weights. Do not rely on memory or unrelated ${provider} material.`,
    ...examSources.map((source) => {
      const kindLabel = source.kind === 'exam-guide'
        ? 'Official exam guide'
        : source.kind === 'exam-details'
          ? 'Official exam details'
          : 'Certification page'
      return `${kindLabel}: ${source.title}: ${source.url}`
    }),
    `Official learning paths:\n${learningPaths}`,
    `The web search citations must include at least one official exam source above (${examSources.map((source) => source.url).join(', ')}); learning-path citations alone do not establish the exam objectives.`,
    'Return every top-level exam domain exactly once. Preserve the official section number and percentage. Always return both weight and weightRange. For an exact official percentage, set weightRange.min and weightRange.max to that exact value and set weight to the same value. For an official percentage range such as 40–45%, return its exact min and max and set weight to the midpoint; the application stores and displays the official range and uses weight for simulation allocation. Never present a range endpoint as the exact official percentage.',
    'The weight values must total exactly 100%. For ranged values, use the midpoint as weight. If the midpoints do not total 100%, or if weight does not match its exact value or range midpoint, fail instead of guessing or changing the source values.',
    'Write domain and topic names and descriptions in both English and Spanish. Include 1 to 40 practical topics in each domain.',
    'Use stable section-N IDs for domain references. Create 3 to 6 ordered study steps and use only those domain IDs. Do not include URLs in the generated study path.',
  ].join('\n\n')
}

export function createAiGuideGenerator(
  modelName?: string,
  options: { environment?: Record<string, string | undefined>; generateText?: typeof generateText } = {},
): GuideGenerator {
  const environment = options.environment ?? process.env
  const runGenerateText = options.generateText ?? generateText

  return async ({ certification }) => {
    let citationUrls: string[] = []
    let maxOutputTokens: number | undefined
    let generationDetails: Record<string, string | number | null> = {}
    let citationDetails: ReturnType<typeof citationDiagnostics> = {
      citationToolResultCount: null,
      citationToolSourceCount: 0,
      citationToolActionTypes: null,
      citationResponseSourceCount: null,
    }
    try {
      const configuredModel = (modelName ?? environment.AI_MODEL)?.trim()
      if (!configuredModel) {
        throw new ApiException(503, 'AI_NOT_CONFIGURED', 'Configure AI_MODEL and OPENAI_API_KEY to enable AI generation.')
      }
      const provider = createAiProvider({ ...environment, AI_MODEL: configuredModel })
      maxOutputTokens = readAiMaxOutputTokens('guide', environment)
      const webSearch = provider.tools.webSearch({
        filters: { allowedDomains: allowedResearchDomains(certification.provider) },
        searchContextSize: 'medium',
      })
      const result = await runGenerateText({
        model: provider.responses(configuredModel),
        tools: {
          // The installed AI SDK types omit this provider-executed tool from its Tools union.
          web_search: webSearch as never,
        },
        toolChoice: 'required',
        output: Output.object({ schema: GuideDraftSchema }),
        prompt: buildGuidePrompt(certification),
        maxOutputTokens,
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS),
        providerOptions: {
          openai: {
            include: ['web_search_call.results'],
            includeWebSearchSources: true,
            maxToolCalls: 3,
          },
        },
      })
      generationDetails = {
        aiFinishReason: result.finishReason,
        aiInputTokens: result.usage.inputTokens ?? null,
        aiOutputTokens: result.usage.outputTokens ?? null,
        aiTotalTokens: result.usage.totalTokens ?? null,
        aiOutputCharacters: result.text.length,
      }
      citationDetails = citationDiagnostics(result.toolResults, result.sources)
      citationUrls = collectCitationUrlsForLog(result.toolResults, result.sources)
      if (!result.output) throw new Error('The model returned no structured guide.')
      const researchSources = collectGuideResearchSources(result.toolResults, certification, result.sources)
      if (!expectedOfficialExamSourceWasCited(researchSources, certification)) {
        throw new Error('No official exam guide, exam details, or certification source was cited.')
      }

      const inputTokens = result.usage.inputTokens ?? null
      const outputTokens = result.usage.outputTokens ?? null
      return {
        output: result.output,
        usage: {
          inputTokens,
          outputTokens,
          totalTokens: result.usage.totalTokens ?? (inputTokens !== null && outputTokens !== null ? inputTokens + outputTokens : null),
        },
        researchSources,
      }
    } catch (error) {
      logServerEvent('error', 'guide_ai_generation_failed', {
        certificationId: certification.id,
        provider: certification.provider,
        stage: 'ai_generation',
        maxOutputTokens,
        citationUrls: JSON.stringify(citationUrls),
        ...generationDetails,
        ...citationDetails,
        ...errorLogDetails(error),
      })
      if (error instanceof ApiException) throw error
      throw new ApiException(503, 'GUIDE_AI_UNAVAILABLE', 'No se pudo renovar la guía con IA. Intenta de nuevo.')
    }
  }
}

export function hashGuideResearchSources(sources: GuideResearchSource[]) {
  const normalizedUrls = sources.map((source) => canonicalUrl(source.url)).sort()
  return createHash('sha256').update(JSON.stringify(normalizedUrls)).digest('hex')
}

export function isExpectedGuideResearch(certification: CertificationCatalogItem, sources: GuideResearchSource[]) {
  return sources.every((source) => isAllowedGuideResearchUrl(source.url, certification.provider))
    && expectedOfficialExamSourceWasCited(sources, certification)
}
