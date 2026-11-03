import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'bun:test'
import { ApiErrorSchema, CurrentUserResponseSchema, HealthResponseSchema } from '@cert-prep/contracts/contracts'
import { createApp } from '../apps/api/src/app'
import { createDatabase } from '../apps/api/src/db/client'
import { recordGatewayUser } from '../apps/api/src/db/repository'
import { users } from '../apps/api/src/db/schema'
import { ApiException } from '../apps/api/src/errors'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { createTestDatabase } from './test-database'

describe('API foundation', () => {
  let client: ReturnType<typeof createDatabase>['client']
  let db: ReturnType<typeof createDatabase>['db']
  let testDatabase: Awaited<ReturnType<typeof createTestDatabase>>

  beforeAll(async () => {
    testDatabase = await createTestDatabase()
    client = testDatabase.client
    db = testDatabase.db
  })

  beforeEach(async () => testDatabase.reset())
  afterAll(async () => testDatabase?.close())

  test('health check is public', async () => {
    const app = createApp({ db, userProvider: async () => { throw new Error('should not be called') } })
    const response = await app.request('/api/healthz')
    expect(response.status).toBe(200)
    expect(HealthResponseSchema.parse(await response.json())).toEqual({ status: 'ok' })
  })

  test('fresh migration creates the intended SQL column names', async () => {
    const guideColumns = await client.query<{ column_name: string }>(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1`,
      ['certification_guides'],
    )
    const resultColumns = await client.query<{ column_name: string }>(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1`,
      ['simulation_results'],
    )
    expect(guideColumns.rows.map((column) => column.column_name)).toContain('study_path')
    expect(resultColumns.rows.map((column) => column.column_name)).toContain('topic_breakdown')
    await migrate(db, { migrationsFolder: './apps/api/drizzle/postgresql', migrationsSchema: 'drizzle' })
    const migrationCount = await client.query<{ count: number }>(
      'SELECT COUNT(*)::int AS count FROM "drizzle"."__drizzle_migrations"',
    )
    expect(migrationCount.rows[0]?.count).toBe(1)
  })

  test('identity comes from the gateway and only the stable id is persisted', async () => {
    const app = createApp({ db, userProvider: async () => ({
      id: 'gateway-user-123',
      email: 'learner@example.com',
      avatar: 'https://example.com/avatar.png',
      permissions: ['admin'],
    }) })

    const response = await app.request('/api/v1/me', {
      method: 'GET',
      headers: { 'x-user-id': 'attacker-controlled-id' },
    })
    expect(response.status).toBe(200)
    expect(CurrentUserResponseSchema.parse(await response.json())).toEqual({
      user: {
        id: 'gateway-user-123',
        email: 'learner@example.com',
        avatar: 'https://example.com/avatar.png',
      },
    })
    expect(await db.select().from(users)).toEqual([
      expect.objectContaining({ gatewayUserId: 'gateway-user-123' }),
    ])
  })

  test('unauthenticated gateway response uses the stable API error envelope', async () => {
    const app = createApp({ db, userProvider: async () => {
      throw new ApiException(401, 'UNAUTHENTICATED', 'Inicia sesión para continuar.')
    } })
    const response = await app.request('/api/v1/me')
    expect(response.status).toBe(401)
    expect(ApiErrorSchema.parse(await response.json())).toEqual({
      error: { code: 'UNAUTHENTICATED', message: 'Inicia sesión para continuar.' },
    })
  })

  test('upserts the gateway identity without storing profile details', async () => {
    await recordGatewayUser(db, 'stable-id')
    await recordGatewayUser(db, 'stable-id')
    expect(await db.select().from(users)).toHaveLength(1)
  })
})
