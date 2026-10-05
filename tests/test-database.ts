import { randomUUID } from 'node:crypto'
import { Pool } from 'pg'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { createDatabase } from '../server/db/client'

const RESET_TABLES = [
  'users',
  'certifications',
  'certification_guides',
  'guide_refresh_leases',
  'simulation_generation_leases',
  'simulation_results',
  'simulation_sessions',
  'simulation_start_events',
  'study_plans',
]

export async function createTestDatabase() {
  const configuredUrl = process.env.TEST_DATABASE_URL
  if (!configuredUrl) {
    throw new Error('TEST_DATABASE_URL is required. Start the local PostgreSQL service before running integration tests.')
  }

  const databaseName = `cert_prep_test_${randomUUID().replaceAll('-', '')}`
  const adminUrl = new URL(configuredUrl)
  adminUrl.pathname = '/postgres'
  const admin = new Pool({ connectionString: adminUrl.toString(), max: 1 })
  await admin.query(`CREATE DATABASE "${databaseName}"`)

  const databaseUrl = new URL(configuredUrl)
  databaseUrl.pathname = `/${databaseName}`
  const database = createDatabase(databaseUrl.toString(), { max: 6 })

  try {
    await migrate(database.db, {
      migrationsFolder: './drizzle/postgresql',
      migrationsSchema: 'drizzle',
    })
  } catch (error) {
    await database.client.end()
    await admin.query(`DROP DATABASE "${databaseName}" WITH (FORCE)`)
    await admin.end()
    throw error
  }

  let closed = false
  return {
    ...database,
    url: databaseUrl.toString(),
    async reset() {
      await database.client.query(`TRUNCATE TABLE ${RESET_TABLES.map((table) => `"${table}"`).join(', ')} RESTART IDENTITY CASCADE`)
    },
    async close() {
      if (closed) return
      closed = true
      try {
        await database.client.end()
      } finally {
        try {
          await admin.query(`DROP DATABASE "${databaseName}" WITH (FORCE)`)
        } finally {
          await admin.end()
        }
      }
    },
  }
}
