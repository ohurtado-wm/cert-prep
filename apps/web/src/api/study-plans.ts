import type { z } from 'zod'
import { ApiClientError, requestJson as sharedRequestJson, type Fetcher } from './request'
import type { Locale } from '@cert-prep/contracts/certification-contracts'
import {
  LatestStudyPlanResponseSchema,
  StudyPlanSchema,
  type StudyPlan,
} from '@cert-prep/contracts/study-plan-contracts'

export class StudyPlanApiError extends ApiClientError {}

async function requestJson<T>(url: string, schema: z.ZodType<T>, init: RequestInit = {}, fetcher: Fetcher = fetch): Promise<T> {
  return sharedRequestJson(url, schema, init, fetcher, (code, status) => new StudyPlanApiError(code, status))
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
