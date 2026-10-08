type LogLevel = 'info' | 'warn' | 'error'

type LogDetails = Record<string, string | number | boolean | null | undefined>

function readProperty(value: unknown, key: string): unknown {
  if (typeof value !== 'object' || value === null) return undefined
  try {
    return (value as Record<string, unknown>)[key]
  } catch {
    return undefined
  }
}

function safeLogText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return undefined
  return value
    .replace(/\bBearer\s+\S+/gi, 'Bearer [REDACTED]')
    .replace(/\bsk-[A-Za-z0-9_-]{16,}\b/g, '[REDACTED]')
    .replace(/\b(api[_-]?key|authorization)\s*[:=]\s*[^\s,;]+/gi, '$1=[REDACTED]')
    .slice(0, maxLength)
}

function safeLogScalar(value: unknown): string | number | undefined {
  return typeof value === 'string' || typeof value === 'number' ? value : undefined
}

export function errorLogDetails(error: unknown): LogDetails {
  const details: LogDetails = {}
  let current: unknown = error

  for (let depth = 0; depth < 3 && current !== undefined && current !== null; depth += 1) {
    const prefix = depth === 0 ? 'error' : `cause${depth}`
    const name = readProperty(current, 'name')
    const message = readProperty(current, 'message')
    const code = readProperty(current, 'code')
    const status = readProperty(current, 'status') ?? readProperty(current, 'statusCode')
    const requestId = readProperty(current, 'requestId') ?? readProperty(current, 'request_id')
    const stack = readProperty(current, 'stack')
    const usage = readProperty(current, 'usage')
    const text = readProperty(current, 'text')
    const isJsonParseError = name === 'AI_JSONParseError'

    details[`${prefix}Name`] = safeLogText(name, 120) ?? (depth === 0 ? typeof current : undefined)
    details[`${prefix}Message`] = isJsonParseError
      ? 'Model output could not be parsed as JSON.'
      : safeLogText(message, 1_000) ?? (depth === 0 ? safeLogText(current, 1_000) : undefined)
    details[`${prefix}Code`] = safeLogScalar(code)
    details[`${prefix}Status`] = safeLogScalar(status)
    if (depth === 0) {
      details.errorRequestId = safeLogText(requestId, 200)
      details.errorStack = safeLogText(stack, 3_000)
      details.errorFinishReason = safeLogText(readProperty(current, 'finishReason'), 80)
      details.errorOutputCharacters = typeof text === 'string' ? text.length : undefined
      details.errorInputTokens = safeLogScalar(readProperty(usage, 'inputTokens'))
      details.errorOutputTokens = safeLogScalar(readProperty(usage, 'outputTokens'))
      details.errorTotalTokens = safeLogScalar(readProperty(usage, 'totalTokens'))
    }

    current = readProperty(current, 'cause')
  }

  return details
}

export function logServerEvent(level: LogLevel, event: string, details: LogDetails = {}) {
  if (process.env.NODE_ENV === 'test') return
  if (process.env.NODE_ENV !== 'development' && level !== 'error') return

  const write = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info
  write(JSON.stringify({ timestamp: new Date().toISOString(), level, event, ...details }))
}
