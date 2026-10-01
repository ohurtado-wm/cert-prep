import { randomUUID } from 'node:crypto'
import { and, desc, eq } from 'drizzle-orm'
import { AiTokenUsageSchema } from '../../src/api/ai-usage-contracts'
import {
  StudyPlanContentSchema,
  StudyPlanSchema,
  type StudyPlan,
  type StudyPlanContent,
  type StudyPlanRequest,
} from '../../src/api/study-plan-contracts'
import type { CertificationGuideResponse } from '../../src/api/certification-contracts'
import type { DatabaseHandle } from '../db/client'
import { simulationResults, studyPlans } from '../db/schema'
import { ApiException } from '../errors'
import type { createCertificationGuideService } from './certification-guide-service'
import { aggregateStudyResults } from '../study-plans/analytics'
import { createAiStudyPlanGenerator, StudyPlanDraftSchema, type StudyPlanGenerator } from '../study-plans/plan-generator'

const MAX_ANALYSIS_SESSIONS = 10
const MAX_RECOMMENDATIONS = 5

type GuideService = Pick<ReturnType<typeof createCertificationGuideService>, 'getGuide'>

type StudyPlanServiceOptions = {
  guideService: GuideService
  planGenerator?: StudyPlanGenerator
  now?: () => Date
  idFactory?: () => string
}

function unwrapGeneration(value: unknown): { output: unknown; usage: unknown } {
  if (typeof value !== 'object' || value === null || !('output' in value)) {
    return { output: value, usage: null }
  }
  const generated = value as { output: unknown; usage?: unknown }
  return { output: generated.output, usage: generated.usage ?? null }
}

function toStoredPlan(row: typeof studyPlans.$inferSelect): StudyPlan {
  const content = StudyPlanContentSchema.safeParse(row.content)
  if (!content.success) throw new ApiException(500, 'STUDY_PLAN_INVALID', 'No se pudo leer el plan guardado.')
  return StudyPlanSchema.parse({
    id: row.id,
    certificationId: row.certificationId,
    createdAt: row.createdAt.toISOString(),
    ...content.data,
  })
}

function hasUnsupportedPerformanceClaims(draft: { summary: string; recommendations: Array<{ title: string; rationale: string; actions: string[] }> }) {
  const generatedText = [draft.summary, ...draft.recommendations.flatMap(({ title, rationale, actions }) => [title, rationale, ...actions])]
  const performanceProse = [draft.summary, ...draft.recommendations.flatMap(({ rationale, actions }) => [rationale, ...actions])]
  const passClaim = /(^|[^\p{L}])(?:pass(?:ed|es|ing)?|approved?|aprobad[oa]s?|superad[oa]s?|ready for (?:the )?exam|list[oa]s? para el examen)(?=$|[^\p{L}])/iu
  return performanceProse.some((text) => /[\d%]/u.test(text)) || generatedText.some((text) => passClaim.test(text))
}

function normalizePlan(
  rawOutput: unknown,
  usageValue: unknown,
  request: StudyPlanRequest,
  stats: ReturnType<typeof aggregateStudyResults>,
  guide: CertificationGuideResponse,
  id: string,
  createdAt: Date,
): StudyPlan {
  const draft = StudyPlanDraftSchema.safeParse(rawOutput)
  if (!draft.success || draft.data.language !== request.language) {
    throw new ApiException(503, 'STUDY_PLAN_INVALID_OUTPUT', 'La IA devolvió un plan que no cumple el formato esperado.')
  }

  if (hasUnsupportedPerformanceClaims(draft.data)) {
    throw new ApiException(503, 'STUDY_PLAN_INVALID_OUTPUT', 'El plan contiene métricas o conclusiones que debe calcular el servidor.')
  }

  const byTargetId = new Map(stats.targets.map((target) => [target.id, target]))
  const byRecommendationId = new Map<string, typeof draft.data.recommendations[number]>()
  for (const recommendation of draft.data.recommendations) {
    if (byRecommendationId.has(recommendation.targetId) || !byTargetId.has(recommendation.targetId)) {
      throw new ApiException(503, 'STUDY_PLAN_INVALID_OUTPUT', 'La IA devolvió prioridades que no corresponden a tus resultados.')
    }
    byRecommendationId.set(recommendation.targetId, recommendation)
  }
  if (byRecommendationId.size !== stats.targets.length) {
    throw new ApiException(503, 'STUDY_PLAN_INVALID_OUTPUT', 'El plan no cubre todas las áreas prioritarias.')
  }

  const recommendations = stats.targets.slice(0, MAX_RECOMMENDATIONS).map((target) => {
    const generated = byRecommendationId.get(target.id)!
    const step = guide.studyPath.find(({ id: stepId }) => stepId === generated.resourceStepId)
    if (!step) throw new ApiException(503, 'STUDY_PLAN_INVALID_OUTPUT', 'El plan contiene una fuente no incluida en la ruta oficial.')
    return {
      targetKind: target.kind,
      targetId: target.id,
      domainId: target.domainId,
      label: target.label,
      priority: target.priority,
      evidence: {
        correct: target.correct,
        total: target.total,
        incorrect: target.incorrect,
        accuracy: target.accuracy,
      },
      title: generated.title,
      rationale: generated.rationale,
      actions: generated.actions,
      resource: {
        title: step.title[request.language],
        url: step.url,
      },
    }
  })

  const usage = AiTokenUsageSchema.safeParse(usageValue)
  const content: StudyPlanContent = StudyPlanContentSchema.parse({
    language: request.language,
    basedOnSessions: stats.sessionCount,
    summary: draft.data.summary,
    recommendations,
    aiUsage: usage.success ? usage.data : null,
  })
  return StudyPlanSchema.parse({
    id,
    certificationId: request.certificationId,
    createdAt: createdAt.toISOString(),
    ...content,
  })
}

export function createStudyPlanService(db: DatabaseHandle, options: StudyPlanServiceOptions) {
  const planGenerator = options.planGenerator ?? createAiStudyPlanGenerator()
  const now = options.now ?? (() => new Date())
  const idFactory = options.idFactory ?? randomUUID

  async function latest(userId: string, certificationId: string) {
    const row = await db.query.studyPlans.findFirst({
      where: and(
        eq(studyPlans.gatewayUserId, userId),
        eq(studyPlans.certificationId, certificationId),
      ),
      orderBy: [desc(studyPlans.createdAt), desc(studyPlans.id)],
    })
    return row ? toStoredPlan(row) : null
  }

  async function generate(userId: string, request: StudyPlanRequest) {
    const history = await db.select({
      domainBreakdown: simulationResults.domainBreakdown,
      topicBreakdown: simulationResults.topicBreakdown,
      focusBreakdown: simulationResults.focusBreakdown,
    }).from(simulationResults)
      .where(and(
        eq(simulationResults.gatewayUserId, userId),
        eq(simulationResults.certificationId, request.certificationId),
      ))
      .orderBy(desc(simulationResults.completedAt), desc(simulationResults.id))
      .limit(MAX_ANALYSIS_SESSIONS)

    if (history.length === 0) {
      throw new ApiException(409, 'STUDY_PLAN_HISTORY_EMPTY', 'Completa una simulación antes de pedir un plan de estudio.')
    }

    const guide = await options.guideService.getGuide(request.certificationId)
    const stats = aggregateStudyResults(history, guide, request.language)
    if (stats.targets.length === 0) {
      throw new ApiException(409, 'STUDY_PLAN_NO_REVIEW_AREAS', 'Tus resultados recientes no muestran áreas pendientes de repaso.')
    }

    const generation = unwrapGeneration(await planGenerator({
      language: request.language,
      certificationName: guide.certification.name[request.language],
      sessionCount: stats.sessionCount,
      domains: stats.domains,
      targets: stats.targets,
      failedFocuses: stats.failedFocuses,
      studyPath: guide.studyPath.map((step) => ({ id: step.id, title: step.title[request.language] })),
    }))
    const createdAt = now()
    const id = idFactory()
    const plan = normalizePlan(generation.output, generation.usage, request, stats, guide, id, createdAt)
    const { id: planId, certificationId, createdAt: planCreatedAt, ...content } = plan

    await db.insert(studyPlans).values({
      id: planId,
      gatewayUserId: userId,
      certificationId,
      content,
      createdAt: new Date(planCreatedAt),
    })
    return plan
  }

  return { latest, generate }
}
