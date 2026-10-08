import { and, desc, eq, inArray } from 'drizzle-orm'
import { MAX_SIMULATION_HISTORY_ITEMS } from '../config/runtime-limits'
import { SimulationHistoryResponseSchema } from '../../src/api/simulation-contracts'
import type { DatabaseHandle } from '../db/client'
import { simulationResults, simulationSessions, studyPlans } from '../db/schema'
import { StoredSimulationStateSchema } from '../simulations/state'

export function createSimulationHistoryService(db: DatabaseHandle) {
  async function list(userId: string, certificationId?: string) {
    const ownerFilter = eq(simulationResults.gatewayUserId, userId)
    const rows = await db.select().from(simulationResults)
      .where(certificationId
        ? and(ownerFilter, eq(simulationResults.certificationId, certificationId))
        : ownerFilter)
      .orderBy(desc(simulationResults.completedAt), desc(simulationResults.id))
      .limit(MAX_SIMULATION_HISTORY_ITEMS)

    return SimulationHistoryResponseSchema.parse({
      sessions: rows.map((row) => ({
        id: row.id,
        certificationId: row.certificationId,
        guideVersion: row.guideVersion,
        mode: row.mode,
        language: row.language,
        completedAt: row.completedAt.toISOString(),
        score: row.score,
        totalQuestions: row.totalQuestions,
        correctAnswers: row.correctAnswers,
        correctAfterRetry: row.correctAfterRetry,
        answersRevealed: row.answersRevealed,
        incorrectAnswers: row.incorrectAnswers,
        domainBreakdown: Object.entries(row.domainBreakdown).map(([id, value]) => ({ id, ...value })),
        topicBreakdown: Object.entries(row.topicBreakdown).map(([id, value]) => ({ id, ...value })),
        focusBreakdown: Object.entries(row.focusBreakdown).map(([id, value]) => ({ id, ...value })),
      })),
    })
  }

  async function clear(userId: string) {
    return db.transaction(async (tx) => {
      const deletedResults = await tx.delete(simulationResults)
        .where(eq(simulationResults.gatewayUserId, userId))
        .returning({ id: simulationResults.id })
      const deletedPlans = await tx.delete(studyPlans)
        .where(eq(studyPlans.gatewayUserId, userId))
        .returning({ id: studyPlans.id })
      const sessionRows = await tx.select({ id: simulationSessions.id, state: simulationSessions.state })
        .from(simulationSessions)
        .where(eq(simulationSessions.gatewayUserId, userId))

      const completedIds = sessionRows.filter(({ state }) => {
        const parsed = StoredSimulationStateSchema.safeParse(state)
        return parsed.success && parsed.data.status === 'completed'
      }).map(({ id }) => id)

      if (completedIds.length > 0) {
        await tx.delete(simulationSessions).where(and(
          eq(simulationSessions.gatewayUserId, userId),
          inArray(simulationSessions.id, completedIds),
        ))
      }

      return { deletedSessions: deletedResults.length, deletedPlans: deletedPlans.length }
    })
  }

  return { list, clear }
}
