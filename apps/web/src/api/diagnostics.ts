// Only fixed error codes and operation names are written to the browser console.
// Response bodies, URLs, IDs, credentials and exception text can contain private data.
const knownCodes = new Set([
  'REQUEST_FAILED', 'INVALID_API_RESPONSE', 'AI_NOT_CONFIGURED', 'AI_PROVIDER_UNSUPPORTED', 'AI_OUTPUT_TOKENS_INVALID',
  'GATEWAY_UNAVAILABLE', 'INVALID_GATEWAY_RESPONSE', 'UNAUTHENTICATED', 'INVALID_REQUEST',
  'CERTIFICATION_NOT_FOUND', 'GUIDE_AI_INVALID', 'GUIDE_AI_UNAVAILABLE', 'GUIDE_REFRESH_FAILED',
  'GUIDE_REFRESH_IN_PROGRESS', 'GUIDE_STALE', 'GUIDE_INVALID', 'QUESTION_GENERATION_UNAVAILABLE', 'QUESTION_SET_INVALID',
  'ADVANCED_BANK_UNAVAILABLE', 'ADVANCED_MODE_INVALID', 'ANSWER_NOT_IN_QUESTION', 'EXPLANATION_LIMIT',
  'EXPLANATION_UNAVAILABLE', 'NEXT_NOT_ALLOWED', 'NO_WEAK_TOPICS', 'QUESTION_ALREADY_ANSWERED',
  'QUESTION_NOT_RESOLVED', 'QUESTION_OUT_OF_ORDER', 'REVEAL_NOT_ALLOWED', 'REVIEW_QUESTION_NOT_FOUND',
  'REVIEW_UNAVAILABLE', 'SIMULATION_COMPLETED', 'SIMULATION_CONFLICT', 'SIMULATION_EXPIRED',
  'SIMULATION_GENERATION_IN_PROGRESS', 'SIMULATION_HISTORY_EMPTY', 'SIMULATION_INCOMPLETE',
  'SIMULATION_NOT_FOUND', 'SIMULATION_RATE_LIMITED', 'SIMULATION_STATE_INVALID', 'WEAK_TOPICS_UNAVAILABLE',
  'STUDY_PLAN_AI_UNAVAILABLE', 'STUDY_PLAN_HISTORY_EMPTY', 'STUDY_PLAN_INVALID', 'STUDY_PLAN_INVALID_OUTPUT',
  'STUDY_PLAN_NO_REVIEW_AREAS', 'INTERNAL_ERROR',
])
const knownReasons = new Set(['asset', 'asset_read', 'asset_invalid', 'mapping', 'compatibility', 'compatibility_provider', 'coverage', 'provider_configuration', 'provider_timeout', 'provider_request_failed', 'provider_invalid_output'])

function operationForUrl(url: string) {
  if (url === '/api/v1/me') return 'identity'
  if (url.startsWith('/api/v1/certifications')) return 'certifications'
  if (url.startsWith('/api/v1/simulations')) return 'simulations'
  if (url.startsWith('/api/v1/study-plans')) return 'study_plans'
  return 'other'
}

export function reportApiFailure(url: string, code: string, response?: Response) {
  if (typeof window === 'undefined') return
  const requestId = response?.headers.get('X-Request-Id')
  const reason = response?.headers.get('X-Cert-Prep-Diagnostic')
  console.error('[cert-prep] API request failed', {
    operation: operationForUrl(url),
    code: knownCodes.has(code) ? code : 'UNKNOWN_API_ERROR',
    ...(response ? { status: response.status } : {}),
    ...(requestId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestId) ? { requestId } : {}),
    ...(reason && knownReasons.has(reason) && code === 'ADVANCED_BANK_UNAVAILABLE' ? { reason } : {}),
  })
}
