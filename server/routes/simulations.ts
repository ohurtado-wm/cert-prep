import { Hono } from 'hono'
import type { z } from 'zod'
import {
  SimulationHistoryQuerySchema,
  StartSimulationRequestSchema,
  SubmitAnswerRequestSchema,
} from '../../src/api/simulation-contracts'
import { WeakTopicAnalysisQuerySchema } from '../../src/api/weak-topic-contracts'
import type { DatabaseHandle } from '../db/client'
import { ApiException } from '../errors'
import type { UserProvider } from '../gateway/user-provider'
import type { createSimulationHistoryService } from '../use-cases/simulation-history-service'
import { resolveCurrentUser } from '../use-cases/resolve-current-user'
import type { createSimulationService } from '../use-cases/simulation-service'

type SimulationService = ReturnType<typeof createSimulationService>
type SimulationHistoryService = ReturnType<typeof createSimulationHistoryService>

async function parseBody<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  let value: unknown
  try {
    value = await request.json()
  } catch {
    throw new ApiException(400, 'INVALID_REQUEST', 'The request body must be valid JSON.')
  }
  const parsed = schema.safeParse(value)
  if (!parsed.success) throw new ApiException(400, 'INVALID_REQUEST', 'The request does not match the expected format.')
  return parsed.data
}

export function createSimulationRoutes(dependencies: {
  db: DatabaseHandle
  userProvider: UserProvider
  simulationService: SimulationService
  historyService: SimulationHistoryService
}) {
  const routes = new Hono()

  routes.get('/simulation-history', async (context) => {
    const user = await resolveCurrentUser(context.req.raw, dependencies.db, dependencies.userProvider)
    const query = SimulationHistoryQuerySchema.safeParse({
      certificationId: context.req.query('certificationId'),
    })
    if (!query.success) throw new ApiException(400, 'INVALID_REQUEST', 'The certification is invalid.')
    return context.json(await dependencies.historyService.list(user.id, query.data.certificationId))
  })

  routes.delete('/simulation-history', async (context) => {
    const user = await resolveCurrentUser(context.req.raw, dependencies.db, dependencies.userProvider)
    return context.json(await dependencies.historyService.clear(user.id))
  })

  routes.post('/simulations', async (context) => {
    const user = await resolveCurrentUser(context.req.raw, dependencies.db, dependencies.userProvider)
    const input = await parseBody(context.req.raw, StartSimulationRequestSchema)
    const snapshot = await dependencies.simulationService.start(user.id, input)
    return context.json(snapshot, 201)
  })

  routes.get('/simulations/weak-topics', async (context) => {
    const user = await resolveCurrentUser(context.req.raw, dependencies.db, dependencies.userProvider)
    const query = WeakTopicAnalysisQuerySchema.safeParse({
      certificationId: context.req.query('certificationId'),
    })
    if (!query.success) throw new ApiException(400, 'INVALID_REQUEST', 'The certification is invalid.')
    return context.json(await dependencies.simulationService.getWeakTopicAnalysis(
      user.id,
      query.data.certificationId,
    ))
  })

  routes.post('/simulations/weak-topics', async (context) => {
    const user = await resolveCurrentUser(context.req.raw, dependencies.db, dependencies.userProvider)
    const input = await parseBody(context.req.raw, StartSimulationRequestSchema)
    return context.json(await dependencies.simulationService.startWeakTopics(user.id, input), 201)
  })

  routes.get('/simulations/active', async (context) => {
    const user = await resolveCurrentUser(context.req.raw, dependencies.db, dependencies.userProvider)
    return context.json(await dependencies.simulationService.getActive(user.id))
  })

  routes.get('/simulations/:sessionId', async (context) => {
    const user = await resolveCurrentUser(context.req.raw, dependencies.db, dependencies.userProvider)
    const snapshot = await dependencies.simulationService.get(user.id, context.req.param('sessionId'))
    return context.json(snapshot)
  })

  routes.delete('/simulations/:sessionId', async (context) => {
    const user = await resolveCurrentUser(context.req.raw, dependencies.db, dependencies.userProvider)
    await dependencies.simulationService.cancel(user.id, context.req.param('sessionId'))
    return context.body(null, 204)
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
