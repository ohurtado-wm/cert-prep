import { eq } from 'drizzle-orm'
import type { DatabaseHandle } from './client'
import { users } from './schema'

export async function recordGatewayUser(db: DatabaseHandle, gatewayUserId: string, now = new Date()) {
  await db.insert(users).values({
    gatewayUserId,
    createdAt: now,
    updatedAt: now,
  }).onConflictDoUpdate({
    target: users.gatewayUserId,
    set: { updatedAt: now },
  })

  return db.query.users.findFirst({ where: eq(users.gatewayUserId, gatewayUserId) })
}
