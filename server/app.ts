import { Hono } from 'hono'
import type { DatabaseHandle } from './db/client'
import { ApiException } from './errors'
import { createGatewayUserProvider, type UserProvider } from './gateway/user-provider'
import { healthRoutes } from './routes/health'
import { createMeRoutes } from './routes/me'

type AppDependencies = {
  db: DatabaseHandle
  userProvider?: UserProvider
}

export function createApp({ db, userProvider = createGatewayUserProvider() }: AppDependencies) {
  const app = new Hono()

  app.route('/api', healthRoutes)
  app.route('/api/v1', createMeRoutes({ db, userProvider }))

  app.onError((error, context) => {
    if (error instanceof ApiException) {
      return context.json({ error: { code: error.code, message: error.message } }, error.status)
    }
    return context.json({ error: { code: 'INTERNAL_ERROR', message: 'Ocurrió un error inesperado.' } }, 500)
  })

  return app
}
