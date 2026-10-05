import { Hono } from 'hono'
import vike from '@vikejs/hono'
import type { Server } from 'vike/types'

const app = new Hono()
let apiAppPromise: ReturnType<typeof createApiApp> | undefined

function createApiApp() {
  return Promise.all([
    import('./server/db/client'),
    import('./server/app'),
  ]).then(([databaseModule, appModule]) => {
    const { client, db } = databaseModule.createDatabase()
    return { app: appModule.createApp({ db }), client }
  })
}

app.all('/api/*', async (context) => {
  apiAppPromise ??= createApiApp()
  const api = await apiAppPromise
  return api.app.fetch(context.req.raw)
})

vike(app)

const server = { fetch: app.fetch, gracefulShutdown: true }
export default server satisfies Server

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    void apiAppPromise?.then(({ client }) => client.end())
  })
} else {
  const closePool = () => {
    void apiAppPromise?.then(({ client }) => client.end())
  }
  process.once('SIGTERM', closePool)
  process.once('SIGINT', closePool)
}
