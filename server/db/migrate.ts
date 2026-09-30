import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { createDatabase } from './client'

const { client, db } = createDatabase()

try {
  migrate(db, { migrationsFolder: './drizzle' })
} finally {
  client.close()
}
