import { Hono } from 'hono'
import type { DatabaseHandle } from './db/client'
import { ApiException } from './errors'
import { createGatewayUserProvider, type UserProvider } from './gateway/user-provider'
import { healthRoutes } from './routes/health'
import { createMeRoutes } from './routes/me'
import { createCertificationRoutes } from './routes/certifications'
import { createCertificationGuideService } from './use-cases/certification-guide-service'
import type { OfficialSourceReader } from './catalog/source-reader'
import type { GuideGenerator } from './catalog/guide-generator'
import { createSimulationService } from './use-cases/simulation-service'
import { createSimulationRoutes } from './routes/simulations'

type AppDependencies = {
  db: DatabaseHandle
  userProvider?: UserProvider
  guideService?: ReturnType<typeof createCertificationGuideService>
  sourceReader?: OfficialSourceReader
  guideGenerator?: GuideGenerator
  simulationService?: ReturnType<typeof createSimulationService>
}

export function createApp({ db, userProvider = createGatewayUserProvider(), guideService, sourceReader, guideGenerator, simulationService }: AppDependencies) {
  const app = new Hono()
  const certificationGuideService = guideService ?? createCertificationGuideService(db, { sourceReader, guideGenerator })
  const sessions = simulationService ?? createSimulationService(db, { guideService: certificationGuideService })

  app.route('/api', healthRoutes)
  app.route('/api/v1', createMeRoutes({ db, userProvider }))
  app.route('/api/v1', createCertificationRoutes(certificationGuideService))
  app.route('/api/v1', createSimulationRoutes({ db, userProvider, simulationService: sessions }))

  app.onError((error, context) => {
    if (error instanceof ApiException) {
      return context.json({ error: { code: error.code, message: error.message } }, error.status)
    }
    return context.json({ error: { code: 'INTERNAL_ERROR', message: 'Ocurrió un error inesperado.' } }, 500)
  })

  return app
}
