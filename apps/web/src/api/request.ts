import { ApiErrorSchema } from '@cert-prep/contracts/contracts'
import type { z } from 'zod'
import { reportApiFailure } from './diagnostics'

export type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

export class ApiClientError extends Error {
  constructor(readonly code: string, readonly status?: number) {
    super(code)
    this.name = 'ApiClientError'
  }
}

export async function requestJson<T>(
  url: string,
  schema: z.ZodType<T>,
  init: RequestInit,
  fetcher: Fetcher,
  createError: (code: string, status?: number) => Error,
): Promise<T> {
  let response: Response
  try {
    response = await fetcher(url, { ...init, headers: { accept: 'application/json', ...init.headers } })
  } catch (error) {
    if (init.signal?.aborted || (error instanceof Error && error.name === 'AbortError')) throw error
    reportApiFailure(url, 'REQUEST_FAILED')
    throw createError('REQUEST_FAILED')
  }

  let body: unknown
  try {
    body = await response.json()
  } catch (error) {
    if (init.signal?.aborted || (error instanceof Error && error.name === 'AbortError')) throw error
    reportApiFailure(url, 'INVALID_API_RESPONSE', response)
    throw createError('INVALID_API_RESPONSE', response.status)
  }
  if (!response.ok) {
    const parsed = ApiErrorSchema.safeParse(body)
    const code = parsed.success ? parsed.data.error.code : 'REQUEST_FAILED'
    reportApiFailure(url, code, response)
    throw createError(code, response.status)
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    reportApiFailure(url, 'INVALID_API_RESPONSE', response)
    throw createError('INVALID_API_RESPONSE', response.status)
  }
  return parsed.data
}
