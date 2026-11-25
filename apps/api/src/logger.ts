type LogLevel = 'info' | 'warn' | 'error'
type LogDetails = Record<string, string | number | boolean | null | undefined>

// Exception messages and stacks can contain model output, request bodies or credentials.
// Only a numeric provider status is safe to retain without inspecting provider text.
export function errorLogDetails(error: unknown): LogDetails {
  if (typeof error !== 'object' || error === null) return { errorCategory: 'unexpected' }
  let status: unknown
  try {
    const value = error as Record<string, unknown>
    status = value.status ?? value.statusCode
  } catch {
    return { errorCategory: 'unexpected' }
  }
  return {
    errorCategory: 'upstream_or_validation',
    ...(typeof status === 'number' && Number.isInteger(status) && status >= 100 && status <= 599 ? { upstreamStatus: status } : {}),
  }
}

export function logServerEvent(level: LogLevel, event: string, details: LogDetails = {}) {
  if (process.env.NODE_ENV === 'test') return
  if (process.env.NODE_ENV !== 'development' && level === 'info') return

  const write = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info
  write(JSON.stringify({ timestamp: new Date().toISOString(), level, event, ...details }))
}
