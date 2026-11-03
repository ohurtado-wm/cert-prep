import { Hono } from 'hono'
import { StudyPlanRequestSchema } from '@cert-prep/contracts/study-plan-contracts'
import type { DatabaseHandle } from '../db/client'
import { ApiException } from '../errors'
import type { UserProvider } from '../gateway/user-provider'
import { resolveCurrentUser } from '../use-cases/resolve-current-user'
import type { createStudyPlanService } from '../use-cases/study-plan-service'

type StudyPlanService = ReturnType<typeof createStudyPlanService>

export function createStudyPlanRoutes(dependencies: {
  db: DatabaseHandle
  userProvider: UserProvider
  studyPlanService: StudyPlanService
}) {
  const routes = new Hono()

  routes.get('/study-plans/latest', async (context) => {
    const user = await resolveCurrentUser(context.req.raw, dependencies.db, dependencies.userProvider)
    const certificationId = context.req.query('certificationId')
    if (!certificationId || !/^[a-z0-9-]+$/.test(certificationId)) {
      throw new ApiException(400, 'INVALID_REQUEST', 'Indica una certificación válida.')
    }
    return context.json({ plan: await dependencies.studyPlanService.latest(user.id, certificationId) })
  })

  routes.post('/study-plans', async (context) => {
    const user = await resolveCurrentUser(context.req.raw, dependencies.db, dependencies.userProvider)
    let body: unknown
    try {
      body = await context.req.json()
    } catch {
      throw new ApiException(400, 'INVALID_REQUEST', 'El cuerpo de la solicitud no es JSON válido.')
    }
    const parsed = StudyPlanRequestSchema.safeParse(body)
    if (!parsed.success) throw new ApiException(400, 'INVALID_REQUEST', 'La solicitud no cumple el formato esperado.')
    const plan = await dependencies.studyPlanService.generate(user.id, parsed.data)
    return context.json(plan, 201)
  })

  return routes
}
