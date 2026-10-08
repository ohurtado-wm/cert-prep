import { z } from 'zod'
import { ApiErrorSchema, CurrentUserResponseSchema, type CurrentUserResponse } from './contracts'
import {
  ClearSimulationHistoryResponseSchema,
  SimulationAnswerResponseSchema,
  SimulationHistoryResponseSchema,
  SimulationRevealResponseSchema,
  SimulationSnapshotSchema,
  type SimulationAnswerResponse,
  type SimulationHistoryItem,
  type SimulationMode,
  type SimulationRevealResponse,
  type SimulationSnapshot,
} from './simulation-contracts'
import type { Locale } from './certification-contracts'
import { WeakTopicAnalysisResponseSchema, type WeakTopicAnalysisResponse } from './weak-topic-contracts'

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

export class SimulationApiError extends Error {
  constructor(readonly code: string) {
    super(code)
  }
}

async function requestJson<T>(url: string, schema: z.ZodType<T>, init: RequestInit = {}, fetcher: Fetcher = fetch): Promise<T> {
  let response: Response
  try {
    response = await fetcher(url, { ...init, headers: { accept: 'application/json', ...init.headers } })
  } catch {
    throw new SimulationApiError('REQUEST_FAILED')
  }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new SimulationApiError('INVALID_API_RESPONSE')
  }

  if (!response.ok) {
    const parsed = ApiErrorSchema.safeParse(body)
    throw new SimulationApiError(parsed.success ? parsed.data.error.code : 'REQUEST_FAILED')
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) throw new SimulationApiError('INVALID_API_RESPONSE')
  return parsed.data
}

function postJson(body: unknown): RequestInit {
  return {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }
}

export async function loadCurrentUser(fetcher: Fetcher = fetch): Promise<CurrentUserResponse['user']> {
  const response = await requestJson('/api/v1/me', CurrentUserResponseSchema, {}, fetcher)
  return response.user
}

export async function startSimulation(
  certificationId: string,
  mode: SimulationMode,
  language: Locale,
  fetcher: Fetcher = fetch,
): Promise<SimulationSnapshot> {
  return requestJson('/api/v1/simulations', SimulationSnapshotSchema, postJson({ certificationId, mode, language }), fetcher)
}

export async function loadWeakTopicAnalysis(
  certificationId: string,
  fetcher: Fetcher = fetch,
): Promise<WeakTopicAnalysisResponse> {
  const query = new URLSearchParams({ certificationId })
  return requestJson(`/api/v1/simulations/weak-topics?${query}`, WeakTopicAnalysisResponseSchema, {}, fetcher)
}

export async function startWeakTopicSimulation(
  certificationId: string,
  mode: SimulationMode,
  language: Locale,
  fetcher: Fetcher = fetch,
): Promise<SimulationSnapshot> {
  return requestJson('/api/v1/simulations/weak-topics', SimulationSnapshotSchema, postJson({ certificationId, mode, language }), fetcher)
}

export async function loadActiveSimulation(fetcher: Fetcher = fetch): Promise<SimulationSnapshot | null> {
  return requestJson('/api/v1/simulations/active', z.union([SimulationSnapshotSchema, z.null()]), {}, fetcher)
}

export async function cancelSimulation(sessionId: string, fetcher: Fetcher = fetch): Promise<void> {
  let response: Response
  try {
    response = await fetcher(`/api/v1/simulations/${encodeURIComponent(sessionId)}`, { method: 'DELETE' })
  } catch {
    throw new SimulationApiError('REQUEST_FAILED')
  }
  if (response.status === 204) return
  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new SimulationApiError('INVALID_API_RESPONSE')
  }
  const parsed = ApiErrorSchema.safeParse(body)
  throw new SimulationApiError(parsed.success ? parsed.data.error.code : 'REQUEST_FAILED')
}

export async function submitSimulationAnswer(
  sessionId: string,
  questionId: string,
  answerId: string,
  fetcher: Fetcher = fetch,
): Promise<SimulationAnswerResponse> {
  return requestJson(
    `/api/v1/simulations/${encodeURIComponent(sessionId)}/answers`,
    SimulationAnswerResponseSchema,
    postJson({ questionId, answerId }),
    fetcher,
  )
}

export async function revealSimulationAnswer(sessionId: string, fetcher: Fetcher = fetch): Promise<SimulationRevealResponse> {
  return requestJson(
    `/api/v1/simulations/${encodeURIComponent(sessionId)}/reveal`,
    SimulationRevealResponseSchema,
    postJson({}),
    fetcher,
  )
}

export async function advancePracticeSimulation(sessionId: string, fetcher: Fetcher = fetch): Promise<SimulationSnapshot> {
  return requestJson(
    `/api/v1/simulations/${encodeURIComponent(sessionId)}/next`,
    SimulationSnapshotSchema,
    postJson({}),
    fetcher,
  )
}

export async function loadSimulationHistory(
  certificationId?: string,
  fetcher: Fetcher = fetch,
): Promise<SimulationHistoryItem[]> {
  const query = certificationId ? `?${new URLSearchParams({ certificationId })}` : ''
  const response = await requestJson(`/api/v1/simulation-history${query}`, SimulationHistoryResponseSchema, {}, fetcher)
  return response.sessions
}

export async function clearSimulationHistory(fetcher: Fetcher = fetch): Promise<void> {
  await requestJson('/api/v1/simulation-history', ClearSimulationHistoryResponseSchema, { method: 'DELETE' }, fetcher)
}
