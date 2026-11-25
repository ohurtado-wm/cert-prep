import { Hono } from 'hono'
import { randomUUID } from 'node:crypto'
import type { DatabaseHandle } from './db/client'
import { ApiException } from './errors'
import { logServerEvent } from './logger'
import { createEnvironmentUserProvider, type UserProvider } from './gateway/user-provider'
import { createHealthRoutes } from './routes/health'
import { createMeRoutes } from './routes/me'
import { createCertificationRoutes } from './routes/certifications'
import { createCertificationGuideService } from './use-cases/certification-guide-service'
import type { GuideGenerator } from './catalog/guide-generator'
import { createSimulationService } from './use-cases/simulation-service'
import { createSimulationRoutes } from './routes/simulations'
import { createSimulationHistoryService } from './use-cases/simulation-history-service'
import { createStudyPlanService } from './use-cases/study-plan-service'
import { createStudyPlanRoutes } from './routes/study-plans'

type AppDependencies = {
  db: DatabaseHandle
  userProvider?: UserProvider
  guideService?: ReturnType<typeof createCertificationGuideService>
  guideGenerator?: GuideGenerator
  simulationService?: ReturnType<typeof createSimulationService>
  studyPlanService?: ReturnType<typeof createStudyPlanService>
}

function operationForPath(path: string): string {
  if (path === '/api/healthz') return 'health'
  if (path === '/api/v1/me') return 'identity'
  if (path.startsWith('/api/v1/certifications')) return 'certifications'
  if (path.startsWith('/api/v1/simulations')) return 'simulations'
  if (path.startsWith('/api/v1/study-plans')) return 'study_plans'
  return 'other'
}

function categoryForStatus(status: number): string {
  if (status === 401) return 'authentication'
  if (status === 400 || status === 422) return 'invalid_request'
  if (status === 404) return 'not_found'
  if (status === 409) return 'conflict'
  if (status === 429) return 'rate_limit'
  return 'service_failure'
}

export function createApp({ db, userProvider = createEnvironmentUserProvider(), guideService, guideGenerator, simulationService, studyPlanService }: AppDependencies) {
  const app = new Hono<{ Variables: { requestId: string } }>()
  const certificationGuideService = guideService ?? createCertificationGuideService(db, { guideGenerator })
  const sessions = simulationService ?? createSimulationService(db, { guideService: certificationGuideService })
  const plans = studyPlanService ?? createStudyPlanService(db, { guideService: certificationGuideService })

  app.use('/api/*', async (context, next) => {
    const startedAt = Date.now()
    context.set('requestId', randomUUID())
    try {
      await next()
    } finally {
      logServerEvent('info', 'api_request_completed', {
        method: context.req.method,
        operation: operationForPath(context.req.path),
        requestId: context.get('requestId'),
        status: context.res.status,
        durationMs: Date.now() - startedAt,
      })
    }
  })

  app.route('/api', createHealthRoutes(db))
  app.route('/api/v1', createMeRoutes({ db, userProvider }))
  app.route('/api/v1', createCertificationRoutes(certificationGuideService))
  app.route('/api/v1', createSimulationRoutes({
    db,
    userProvider,
    simulationService: sessions,
    historyService: createSimulationHistoryService(db),
  }))
  app.route('/api/v1', createStudyPlanRoutes({ db, userProvider, studyPlanService: plans }))

  app.onError((error, context) => {
    if (error instanceof ApiException) {
      context.header('X-Request-Id', context.get('requestId'))
      if (error.diagnostic) context.header('X-Cert-Prep-Diagnostic', error.diagnostic.reason ?? error.diagnostic.category)
      logServerEvent(error.status >= 500 ? 'error' : 'warn', 'api_request_failed', {
        method: context.req.method,
        operation: operationForPath(context.req.path),
        requestId: context.get('requestId'),
        status: error.status,
        code: error.code,
        category: categoryForStatus(error.status),
        ...(error.diagnostic ? { operation: error.diagnostic.operation, category: error.diagnostic.category, reason: error.diagnostic.reason ?? error.diagnostic.category } : {}),
      })
      return context.json({ error: { code: error.code, message: error.message } }, error.status)
    }
    context.header('X-Request-Id', context.get('requestId'))
    logServerEvent('error', 'api_request_failed', {
      method: context.req.method,
      operation: operationForPath(context.req.path),
      requestId: context.get('requestId'),
      status: 500,
      code: 'INTERNAL_ERROR',
      category: 'unexpected',
    })
    return context.json({ error: { code: 'INTERNAL_ERROR', message: 'Ocurrió un error inesperado.' } }, 500)
  })

  return app
}
