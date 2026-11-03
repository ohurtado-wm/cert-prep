import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createDatabase } from './client'

const MIGRATIONS_DIRECTORY = fileURLToPath(new URL('../../drizzle/postgresql/', import.meta.url))
const MIGRATION_LOCK_KEY = 2_024_100_201

type MigrationJournal = {
  entries: Array<{ tag: string; when: number }>
}

const { client } = createDatabase()
const connection = await client.connect()
let inTransaction = false
let lockAcquired = false

try {
  await connection.query('SELECT pg_advisory_lock($1::bigint)', [MIGRATION_LOCK_KEY])
  lockAcquired = true
  await connection.query(`
    CREATE TABLE IF NOT EXISTS public.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `)

  const journal = JSON.parse(
    await readFile(join(MIGRATIONS_DIRECTORY, 'meta/_journal.json'), 'utf8'),
  ) as MigrationJournal
  const applied = await connection.query<{ created_at: string | number | null }>(
    'SELECT created_at FROM public.__drizzle_migrations ORDER BY created_at DESC LIMIT 1',
  )
  let lastAppliedAt = Number(applied.rows[0]?.created_at ?? 0)

  for (const migration of journal.entries) {
    if (migration.when <= lastAppliedAt) continue

    const migrationSql = await readFile(join(MIGRATIONS_DIRECTORY, `${migration.tag}.sql`), 'utf8')
    const hash = createHash('sha256').update(migrationSql).digest('hex')
    await connection.query('BEGIN')
    inTransaction = true
    for (const statement of migrationSql.split('--> statement-breakpoint')) {
      if (statement.trim()) await connection.query(statement)
    }
    await connection.query(
      'INSERT INTO public.__drizzle_migrations ("hash", "created_at") VALUES ($1, $2)',
      [hash, migration.when],
    )
    await connection.query('COMMIT')
    inTransaction = false
    lastAppliedAt = migration.when
  }
} finally {
  if (inTransaction) await connection.query('ROLLBACK').catch(() => undefined)
  if (lockAcquired) {
    await connection.query('SELECT pg_advisory_unlock($1::bigint)', [MIGRATION_LOCK_KEY]).catch(() => undefined)
  }
  connection.release()
  await client.end()
}
