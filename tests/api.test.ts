import { beforeEach, describe, expect, test } from 'bun:test'
import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { ApiErrorSchema, CurrentUserResponseSchema, HealthResponseSchema } from '../src/api/contracts'
import { createApp } from '../server/app'
import { createDatabase } from '../server/db/client'
import { recordGatewayUser } from '../server/db/repository'
import { users } from '../server/db/schema'
import { ApiException } from '../server/errors'

describe('API foundation', () => {
  let client: ReturnType<typeof createDatabase>['client']
  let db: ReturnType<typeof createDatabase>['db']

  beforeEach(() => {
    const database = createDatabase(':memory:')
    client = database.client
    db = database.db
    migrate(db, { migrationsFolder: './drizzle' })
  })

  test('health check is public', async () => {
    const app = createApp({ db, userProvider: async () => { throw new Error('should not be called') } })
    const response = await app.request('/api/healthz')
    expect(response.status).toBe(200)
    expect(HealthResponseSchema.parse(await response.json())).toEqual({ status: 'ok' })
    client.close()
  })

  test('fresh migration creates the intended SQL column names', () => {
    const guideColumns = client.query('PRAGMA table_info(certification_guides)').all() as Array<{ name: string }>
    const resultColumns = client.query('PRAGMA table_info(simulation_results)').all() as Array<{ name: string }>
    expect(guideColumns.map((column) => column.name)).toContain('study_path')
    expect(resultColumns.map((column) => column.name)).toContain('topic_breakdown')
    client.close()
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
    client.close()
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
    client.close()
  })

  test('upserts the gateway identity without storing profile details', async () => {
    await recordGatewayUser(db, 'stable-id')
    await recordGatewayUser(db, 'stable-id')
    expect(await db.select().from(users)).toHaveLength(1)
    client.close()
  })
})
