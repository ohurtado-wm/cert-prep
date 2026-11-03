import { sql } from 'drizzle-orm'
import { Hono } from 'hono'
import type { DatabaseHandle } from '../db/client'

export function createHealthRoutes(db: DatabaseHandle) {
  return new Hono().get('/healthz', async (context) => {
    await db.execute(sql`select 1`)
    return context.json({ status: 'ok' as const })
  })
}
