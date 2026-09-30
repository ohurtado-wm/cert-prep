import { Hono } from 'hono'
import type { DatabaseHandle } from '../db/client'
import type { UserProvider } from '../gateway/user-provider'
import { resolveCurrentUser } from '../use-cases/resolve-current-user'

export function createMeRoutes(dependencies: { db: DatabaseHandle; userProvider: UserProvider }) {
  return new Hono().get('/me', async (context) => {
    const user = await resolveCurrentUser(context.req.raw, dependencies.db, dependencies.userProvider)
    return context.json({ user })
  })
}
