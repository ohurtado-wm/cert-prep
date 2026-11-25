import { z } from 'zod'
import { ApiClientError, requestJson, type Fetcher } from './request'
import {
  CertificationCatalogResponseSchema,
  CertificationGuideResponseSchema,
  type CertificationCatalogItem,
  type CertificationGuideResponse,
} from '@cert-prep/contracts/certification-contracts'

const GuidePayloadSchema = z.object({ guide: CertificationGuideResponseSchema })
export class CertificationApiError extends ApiClientError {}

async function readJson<T>(url: string, schema: z.ZodType<T>, fetcher: Fetcher): Promise<T> {
  return requestJson(url, schema, {}, fetcher, (code, status) => new CertificationApiError(code, status))
}

export async function loadCertificationCatalog(fetcher: Fetcher = fetch): Promise<CertificationCatalogItem[]> {
  const response = await readJson('/api/v1/certifications', CertificationCatalogResponseSchema, fetcher)
  return response.certifications
}

export async function loadCertificationGuide(
  certificationId: string,
  fetcher: Fetcher = fetch,
): Promise<CertificationGuideResponse> {
  const path = `/api/v1/certifications/${encodeURIComponent(certificationId)}/guide`
  const response = await readJson(path, GuidePayloadSchema, fetcher)
  return response.guide
}
