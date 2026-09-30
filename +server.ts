import { Hono } from 'hono'
import vike from '@vikejs/hono'
import type { Server } from 'vike/types'

const app = new Hono()
let apiAppPromise: ReturnType<typeof createApiApp> | undefined

function createApiApp() {
  return Promise.all([
    import('./server/db/client'),
    import('drizzle-orm/bun-sqlite/migrator'),
    import('./server/app'),
  ]).then(([databaseModule, migratorModule, appModule]) => {
    const { client, db } = databaseModule.createDatabase()
    migratorModule.migrate(db, { migrationsFolder: './drizzle' })
    return { app: appModule.createApp({ db }), client }
  })
}

app.all('/api/*', async (context) => {
  apiAppPromise ??= createApiApp()
  const api = await apiAppPromise
  return api.app.fetch(context.req.raw)
})

vike(app)

export default { fetch: app.fetch } satisfies Server

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    void apiAppPromise?.then(({ client }) => client.close())
  })
}
