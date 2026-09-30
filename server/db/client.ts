import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as schema from './schema'

export function createDatabase(path = process.env.DATABASE_PATH ?? './data/cert-prep.sqlite') {
  if (path !== ':memory:') mkdirSync(dirname(resolve(path)), { recursive: true })

  const client = new Database(path, { create: true })
  client.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;')
  return { client, db: drizzle({ client, schema }) }
}

export type DatabaseHandle = ReturnType<typeof createDatabase>['db']
