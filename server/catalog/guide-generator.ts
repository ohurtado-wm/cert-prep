import { generateText, Output } from 'ai'
import { createHash } from 'node:crypto'
import { z } from 'zod'
import type { AiTokenUsage } from '../../src/api/ai-usage-contracts'
import {
  GuideResearchSourceSchema,
  type CertificationCatalogItem,
  type GuideResearchSource,
} from '../../src/api/certification-contracts'
import { ApiException } from '../errors'
import { createAiProvider } from '../ai/model-provider'

const LocalizedText = z.object({ en: z.string().min(1), es: z.string().min(1) })

export const GuideDraftSchema = z.object({
  domains: z.array(z.object({
    sectionNumber: z.number().int().positive(),
    weight: z.number().positive().max(100),
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

const ALLOWED_GOOGLE_DOMAINS = ['cloud.google.com', 'services.google.com', 'skills.google', 'cloudskillsboost.google']

function canonicalUrl(value: string) {
  const url = new URL(value)
  const hostname = url.hostname.toLowerCase().replace(/^www\./, '')
  const pathname = url.pathname.replace(/\/$/, '') || '/'
  return `${hostname}${pathname}`
}

export function isAllowedGuideResearchUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && ALLOWED_GOOGLE_DOMAINS.some((domain) => (
      url.hostname === domain || url.hostname.endsWith(`.${domain}`)
    ))
  } catch {
    return false
  }
}

function expectedExamGuideWasCited(sources: GuideResearchSource[], certification: CertificationCatalogItem) {
  const examGuide = certification.sources.find((source) => source.kind === 'exam-guide')
  const certificationPage = certification.sources.find((source) => source.kind === 'certification')
  if (!examGuide || !certificationPage) return false
  const expected = new Set([canonicalUrl(examGuide.url), canonicalUrl(certificationPage.url)])
  return sources.some((source) => expected.has(canonicalUrl(source.url)))
}

function sourceTitle(url: string, certification: CertificationCatalogItem) {
  const canonical = canonicalUrl(url)
  return certification.sources.find((source) => canonicalUrl(source.url) === canonical)?.title
    ?? new URL(url).hostname
}

export function collectGuideResearchSources(toolResults: unknown, certification: CertificationCatalogItem): GuideResearchSource[] {
  const resultSchema = z.array(z.object({ output: z.unknown() })).safeParse(toolResults)
  if (!resultSchema.success) return []

  const citations: GuideResearchSource[] = []
  const seen = new Set<string>()
  for (const toolResult of resultSchema.data) {
    const outputSchema = z.object({
      sources: z.array(z.object({ type: z.string(), url: z.string().optional() })).optional(),
    }).safeParse(toolResult.output)
    if (!outputSchema.success) continue
    for (const citation of outputSchema.data.sources ?? []) {
      if (citation.type !== 'url' || !citation.url || !isAllowedGuideResearchUrl(citation.url)) continue
      const key = canonicalUrl(citation.url)
      if (seen.has(key)) continue
      seen.add(key)
      citations.push(GuideResearchSourceSchema.parse({ title: sourceTitle(citation.url, certification), url: citation.url }))
      if (citations.length === 20) return citations
    }
  }
  return citations
}

export function buildGuidePrompt(certification: CertificationCatalogItem) {
  const sources = Object.fromEntries(certification.sources.map((source) => [source.kind, source.url]))
  return [
    `Prepare the bilingual study guide for ${certification.name.en}.`,
    'Use the required web search to open and read the exact official exam guide and certification page below. The exam guide is authoritative for domain names, top-level section numbers, and weights. Do not rely on memory or unrelated Google Cloud material.',
    `Official exam guide: ${sources['exam-guide']}`,
    `Certification page: ${sources.certification}`,
    `Official learning path: ${sources['learning-path']}`,
    'Return every top-level exam domain exactly once. Preserve the official section number and percentage, including fractional percentages. Domain weights must total exactly 100%. Never invent, round, or redistribute a weight to make the total fit; if the source is inaccessible or ambiguous, fail instead of guessing.',
    'Write domain and topic names and descriptions in both English and Spanish. Include 1 to 40 practical topics in each domain.',
    'Use stable section-N IDs for domain references. Create 3 to 6 ordered study steps and use only those domain IDs. Do not include URLs in the generated study path.',
  ].join('\n\n')
}

export function createAiGuideGenerator(modelName = process.env.AI_MODEL): GuideGenerator {
  return async ({ certification }) => {
    try {
      const configuredModel = modelName?.trim()
      if (!configuredModel) {
        throw new ApiException(503, 'AI_NOT_CONFIGURED', 'Configure AI_MODEL and OPENAI_API_KEY to enable AI generation.')
      }
      const provider = createAiProvider({ ...process.env, AI_MODEL: configuredModel })
      const webSearch = provider.tools.webSearch({
        filters: { allowedDomains: ALLOWED_GOOGLE_DOMAINS },
        searchContextSize: 'medium',
      })
      const result = await generateText({
        model: provider.responses(configuredModel),
        tools: {
          // The installed AI SDK types omit this provider-executed tool from its Tools union.
          web_search: webSearch as never,
        },
        toolChoice: 'required',
        output: Output.object({ schema: GuideDraftSchema }),
        prompt: buildGuidePrompt(certification),
        maxOutputTokens: 6_000,
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(60_000),
        providerOptions: {
          openai: {
            include: ['web_search_call.results'],
            includeWebSearchSources: true,
            maxToolCalls: 3,
          },
        },
      })
      if (!result.output) throw new Error('The model returned no structured guide.')
      const researchSources = collectGuideResearchSources(result.toolResults, certification)
      if (!expectedExamGuideWasCited(researchSources, certification)) {
        throw new Error('The model did not cite the official exam guide or certification page.')
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
  return sources.every((source) => isAllowedGuideResearchUrl(source.url))
    && expectedExamGuideWasCited(sources, certification)
}
