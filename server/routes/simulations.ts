import { Hono } from 'hono'
import type { z } from 'zod'
import {
  StartSimulationRequestSchema,
  SubmitAnswerRequestSchema,
} from '../../src/api/simulation-contracts'
import type { DatabaseHandle } from '../db/client'
import { ApiException } from '../errors'
import type { UserProvider } from '../gateway/user-provider'
import { resolveCurrentUser } from '../use-cases/resolve-current-user'
import type { createSimulationService } from '../use-cases/simulation-service'

type SimulationService = ReturnType<typeof createSimulationService>

async function parseBody<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  let value: unknown
  try {
    value = await request.json()
  } catch {
    throw new ApiException(400, 'INVALID_REQUEST', 'El cuerpo de la solicitud no es JSON válido.')
  }
  const parsed = schema.safeParse(value)
  if (!parsed.success) throw new ApiException(400, 'INVALID_REQUEST', 'La solicitud no cumple el formato esperado.')
  return parsed.data
}

export function createSimulationRoutes(dependencies: {
  db: DatabaseHandle
  userProvider: UserProvider
  simulationService: SimulationService
}) {
  const routes = new Hono()

  routes.post('/simulations', async (context) => {
    const user = await resolveCurrentUser(context.req.raw, dependencies.db, dependencies.userProvider)
    const input = await parseBody(context.req.raw, StartSimulationRequestSchema)
    const snapshot = await dependencies.simulationService.start(user.id, input)
    return context.json(snapshot, 201)
  })

  routes.get('/simulations/:sessionId', async (context) => {
    const user = await resolveCurrentUser(context.req.raw, dependencies.db, dependencies.userProvider)
    const snapshot = await dependencies.simulationService.get(user.id, context.req.param('sessionId'))
    return context.json(snapshot)
  })

  routes.post('/simulations/:sessionId/answers', async (context) => {
    const user = await resolveCurrentUser(context.req.raw, dependencies.db, dependencies.userProvider)
    const input = await parseBody(context.req.raw, SubmitAnswerRequestSchema)
    const result = await dependencies.simulationService.answer(user.id, context.req.param('sessionId'), input)
    return context.json(result)
  })

  routes.post('/simulations/:sessionId/reveal', async (context) => {
    const user = await resolveCurrentUser(context.req.raw, dependencies.db, dependencies.userProvider)
    const result = await dependencies.simulationService.reveal(user.id, context.req.param('sessionId'))
    return context.json(result)
  })

  routes.post('/simulations/:sessionId/next', async (context) => {
    const user = await resolveCurrentUser(context.req.raw, dependencies.db, dependencies.userProvider)
    const snapshot = await dependencies.simulationService.next(user.id, context.req.param('sessionId'))
    return context.json(snapshot)
  })

  return routes
}
