import { Pool, type PoolConfig } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

const DEFAULT_POOL_SIZE = 10
const MAX_POOL_SIZE = 50

function poolSize(value: string | undefined) {
  if (!value) return DEFAULT_POOL_SIZE
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_POOL_SIZE) {
    throw new Error(`DATABASE_POOL_MAX must be an integer between 1 and ${MAX_POOL_SIZE}.`)
  }
  return parsed
}

export function createDatabase(
  databaseUrl = process.env.DATABASE_URL,
  poolOptions: Omit<PoolConfig, 'connectionString'> = {},
) {
  if (!databaseUrl) throw new Error('DATABASE_URL is required to connect to PostgreSQL.')

  const client = new Pool({
    connectionString: databaseUrl,
    max: poolSize(process.env.DATABASE_POOL_MAX),
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 30_000,
    application_name: 'cert-prep',
    ...poolOptions,
  })

  return { client, db: drizzle({ client, schema }) }
}

export type DatabaseHandle = ReturnType<typeof createDatabase>['db']
