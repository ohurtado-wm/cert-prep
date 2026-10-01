import { Hono } from 'hono'
import type { DatabaseHandle } from './db/client'
import { ApiException } from './errors'
import { logServerEvent } from './logger'
import { createEnvironmentUserProvider, type UserProvider } from './gateway/user-provider'
import { healthRoutes } from './routes/health'
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

export function createApp({ db, userProvider = createEnvironmentUserProvider(), guideService, guideGenerator, simulationService, studyPlanService }: AppDependencies) {
  const app = new Hono()
  const certificationGuideService = guideService ?? createCertificationGuideService(db, { guideGenerator })
  const sessions = simulationService ?? createSimulationService(db, { guideService: certificationGuideService })
  const plans = studyPlanService ?? createStudyPlanService(db, { guideService: certificationGuideService })

  app.use('/api/*', async (context, next) => {
    const startedAt = Date.now()
    try {
      await next()
    } finally {
      logServerEvent('info', 'api_request_completed', {
        method: context.req.method,
        path: context.req.path,
        status: context.res.status,
        durationMs: Date.now() - startedAt,
      })
    }
  })

  app.route('/api', healthRoutes)
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
      logServerEvent(error.status >= 500 ? 'error' : 'warn', 'api_request_failed', {
        method: context.req.method,
        path: context.req.path,
        status: error.status,
        code: error.code,
      })
      return context.json({ error: { code: error.code, message: error.message } }, error.status)
    }
    logServerEvent('error', 'api_request_failed', {
      method: context.req.method,
      path: context.req.path,
      status: 500,
      code: 'INTERNAL_ERROR',
    })
    return context.json({ error: { code: 'INTERNAL_ERROR', message: 'Ocurrió un error inesperado.' } }, 500)
  })

  return app
}
