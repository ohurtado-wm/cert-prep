import { and, count, eq, gte, lte } from 'drizzle-orm'
import type { DatabaseHandle } from '../db/client'
import { simulationGenerationLeases, simulationStartEvents } from '../db/schema'

export async function acquireGenerationLease(
  db: DatabaseHandle,
  userId: string,
  now: Date,
  expiresAt: Date,
  leaseToken: string,
) {
  const acquired = await db.insert(simulationGenerationLeases).values({
    gatewayUserId: userId,
    leaseToken,
    expiresAt,
  }).onConflictDoUpdate({
    target: simulationGenerationLeases.gatewayUserId,
    set: { leaseToken, expiresAt },
    setWhere: lte(simulationGenerationLeases.expiresAt, now),
  }).returning({ leaseToken: simulationGenerationLeases.leaseToken })

  return acquired.some((lease) => lease.leaseToken === leaseToken)
}

export async function releaseGenerationLease(db: DatabaseHandle, userId: string, leaseToken: string) {
  await db.delete(simulationGenerationLeases).where(and(
    eq(simulationGenerationLeases.gatewayUserId, userId),
    eq(simulationGenerationLeases.leaseToken, leaseToken),
  ))
}

export async function reserveSimulationStart(
  db: DatabaseHandle,
  input: {
    id: string
    userId: string
    startedAt: Date
    cutoff: Date
    limit: number
  },
) {
  return db.transaction(async (tx) => {
    await tx.delete(simulationStartEvents).where(and(
      eq(simulationStartEvents.gatewayUserId, input.userId),
      lte(simulationStartEvents.startedAt, input.cutoff),
    ))

    const [recent] = await tx.select({ value: count() }).from(simulationStartEvents).where(and(
      eq(simulationStartEvents.gatewayUserId, input.userId),
      gte(simulationStartEvents.startedAt, input.cutoff),
    ))
    if ((recent?.value ?? 0) >= input.limit) return false

    await tx.insert(simulationStartEvents).values({
      id: input.id,
      gatewayUserId: input.userId,
      startedAt: input.startedAt,
      status: 'started',
    })
    return true
  })
}

export async function finishSimulationStart(
  db: DatabaseHandle,
  id: string,
  userId: string,
  status: 'succeeded' | 'failed',
) {
  await db.update(simulationStartEvents).set({ status }).where(and(
    eq(simulationStartEvents.id, id),
    eq(simulationStartEvents.gatewayUserId, userId),
  ))
}
