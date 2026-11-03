import { z } from 'zod'
import { ApiErrorSchema } from '@cert-prep/contracts/contracts'
import {
  CertificationCatalogResponseSchema,
  CertificationGuideResponseSchema,
  type CertificationCatalogItem,
  type CertificationGuideResponse,
} from '@cert-prep/contracts/certification-contracts'

const GuidePayloadSchema = z.object({ guide: CertificationGuideResponseSchema })
type Fetcher = (input: RequestInfo | URL) => Promise<Response>

function logApiFailure(path: string, status: number | null, code: string) {
  if (import.meta.env.DEV) {
    console.error('[cert-prep] API request failed', { path, status, code })
  }
}

export class CertificationApiError extends Error {
  constructor(readonly code: string) {
    super(code)
  }
}

async function readJson<T>(url: string, schema: z.ZodType<T>, fetcher: Fetcher): Promise<T> {
  let response: Response
  try {
    response = await fetcher(url)
  } catch {
    logApiFailure(url, null, 'REQUEST_FAILED')
    throw new CertificationApiError('REQUEST_FAILED')
  }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    logApiFailure(url, response.status, 'INVALID_API_RESPONSE')
    throw new CertificationApiError('INVALID_API_RESPONSE')
  }

  if (!response.ok) {
    const parsedError = ApiErrorSchema.safeParse(body)
    const code = parsedError.success ? parsedError.data.error.code : 'REQUEST_FAILED'
    logApiFailure(url, response.status, code)
    throw new CertificationApiError(code)
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    logApiFailure(url, response.status, 'INVALID_API_RESPONSE')
    throw new CertificationApiError('INVALID_API_RESPONSE')
  }
  return parsed.data
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
