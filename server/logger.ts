type LogLevel = 'info' | 'warn' | 'error'

type LogDetails = Record<string, string | number | boolean | null | undefined>

export function logServerEvent(level: LogLevel, event: string, details: LogDetails = {}) {
  if (process.env.NODE_ENV !== 'development') return

  const write = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info
  write(JSON.stringify({ timestamp: new Date().toISOString(), level, event, ...details }))
}
