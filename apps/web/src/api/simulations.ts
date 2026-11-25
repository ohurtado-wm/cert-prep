import { z } from 'zod'
import { reportApiFailure } from './diagnostics'
import { ApiClientError, requestJson as sharedRequestJson, type Fetcher } from './request'
import { ApiErrorSchema, CurrentUserResponseSchema, type CurrentUserResponse } from '@cert-prep/contracts/contracts'
import {
  ClearSimulationHistoryResponseSchema,
  SimulationAnswerResponseSchema,
  SimulationHistoryResponseSchema,
  SimulationRevealResponseSchema,
  SimulationSnapshotSchema,
  QuestionExplanationResponseSchema,
  type SimulationAnswerResponse,
  type SimulationHistoryItem,
  type SimulationMode,
  type QuestionSource,
  type SimulationRevealResponse,
  type SimulationSnapshot,
} from '@cert-prep/contracts/simulation-contracts'
import type { Locale } from '@cert-prep/contracts/certification-contracts'
import { WeakTopicAnalysisResponseSchema, type WeakTopicAnalysisResponse } from '@cert-prep/contracts/weak-topic-contracts'

export class SimulationApiError extends ApiClientError {}

async function requestJson<T>(url: string, schema: z.ZodType<T>, init: RequestInit = {}, fetcher: Fetcher = fetch): Promise<T> {
  return sharedRequestJson(url, schema, init, fetcher, (code, status) => new SimulationApiError(code, status))
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
  questionSource: QuestionSource = 'ai',
): Promise<SimulationSnapshot> {
  return requestJson('/api/v1/simulations', SimulationSnapshotSchema, postJson({ certificationId, mode, language, ...(questionSource === 'advanced' ? { questionSource } : {}) }), fetcher)
}

export async function generateQuestionExplanation(sessionId: string, questionId: string, signal?: AbortSignal) {
  return requestJson(`/api/v1/simulations/${encodeURIComponent(sessionId)}/review/${encodeURIComponent(questionId)}/explanation`, QuestionExplanationResponseSchema, { ...postJson({}), signal })
}

export async function closeSimulationReview(sessionId: string): Promise<void> {
  await fetch(`/api/v1/simulations/${encodeURIComponent(sessionId)}/review`, { method: 'DELETE', keepalive: true }).catch(() => undefined)
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
  const url = `/api/v1/simulations/${encodeURIComponent(sessionId)}`
  let response: Response
  try {
    response = await fetcher(url, { method: 'DELETE' })
  } catch {
    reportApiFailure(url, 'REQUEST_FAILED')
    throw new SimulationApiError('REQUEST_FAILED')
  }
  if (response.status === 204) return
  let body: unknown
  try {
    body = await response.json()
  } catch {
    reportApiFailure(url, 'INVALID_API_RESPONSE', response)
    throw new SimulationApiError('INVALID_API_RESPONSE', response.status)
  }
  const parsed = ApiErrorSchema.safeParse(body)
  const code = parsed.success ? parsed.data.error.code : 'REQUEST_FAILED'
  reportApiFailure(url, code, response)
  throw new SimulationApiError(code, response.status)
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
