import { Hono } from 'hono'
import { CertificationCatalogResponseSchema, CertificationGuideResponseSchema } from '@cert-prep/contracts/certification-contracts'
import type { createCertificationGuideService } from '../use-cases/certification-guide-service'

type CertificationGuideService = ReturnType<typeof createCertificationGuideService>

export function createCertificationRoutes(guideService: CertificationGuideService) {
  const routes = new Hono()

  routes.get('/certifications', async (context) => {
    const catalog = CertificationCatalogResponseSchema.parse(await guideService.listCatalog())
    return context.json(catalog)
  })

  routes.get('/certifications/:certificationId/guide', async (context) => {
    const guide = CertificationGuideResponseSchema.parse(
      await guideService.getGuide(context.req.param('certificationId')),
    )
    return context.json({ guide })
  })

  return routes
}
