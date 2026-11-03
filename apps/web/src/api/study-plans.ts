import { z } from 'zod'
import type { Locale } from '@cert-prep/contracts/certification-contracts'
import {
  LatestStudyPlanResponseSchema,
  StudyPlanSchema,
  type StudyPlan,
} from '@cert-prep/contracts/study-plan-contracts'

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

export class StudyPlanApiError extends Error {
  constructor(readonly code: string) {
    super(code)
  }
}

async function requestJson<T>(url: string, schema: z.ZodType<T>, init: RequestInit = {}, fetcher: Fetcher = fetch): Promise<T> {
  let response: Response
  try {
    response = await fetcher(url, { ...init, headers: { accept: 'application/json', ...init.headers } })
  } catch {
    throw new StudyPlanApiError('REQUEST_FAILED')
  }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new StudyPlanApiError('INVALID_API_RESPONSE')
  }
  if (!response.ok) {
    const parsed = z.object({ error: z.object({ code: z.string() }) }).safeParse(body)
    throw new StudyPlanApiError(parsed.success ? parsed.data.error.code : 'REQUEST_FAILED')
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) throw new StudyPlanApiError('INVALID_API_RESPONSE')
  return parsed.data
}

export async function loadLatestStudyPlan(certificationId: string, fetcher: Fetcher = fetch): Promise<StudyPlan | null> {
  const query = new URLSearchParams({ certificationId })
  const response = await requestJson(
    '/api/v1/study-plans/latest?' + query.toString(),
    LatestStudyPlanResponseSchema,
    {},
    fetcher,
  )
  return response.plan
}

export async function generateStudyPlan(
  certificationId: string,
  language: Locale,
  fetcher: Fetcher = fetch,
): Promise<StudyPlan> {
  return requestJson('/api/v1/study-plans', StudyPlanSchema, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ certificationId, language }),
  }, fetcher)
}
