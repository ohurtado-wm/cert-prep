import { describe, expect, test } from 'bun:test'
import { errorLogDetails } from './logger'
import { AdvancedBankError, parseBankFile } from './simulations/advanced-bank/bank'

describe('safe server diagnostics', () => {
  test('never returns provider text, secret, question, answer or stack', () => {
    const sensitive = 'secret private question correct answer'
    const diagnostic = errorLogDetails({ name: sensitive, message: sensitive, stack: sensitive, text: sensitive, status: 503 })
    expect(diagnostic).toEqual({ errorCategory: 'upstream_or_validation', upstreamStatus: 503 })
    expect(JSON.stringify(diagnostic)).not.toContain(sensitive)
  })

  test('categorizes malformed bank assets without recording their contents', () => {
    try {
      parseBankFile('private question', 1)
      throw new Error('Expected failure')
    } catch (error) {
      expect(error).toBeInstanceOf(AdvancedBankError)
      expect((error as AdvancedBankError).category).toBe('asset')
      expect((error as AdvancedBankError).reason).toBe('asset_invalid')
    }
  })
})

test('request failures log a safe diagnostic and retain the public error envelope', async () => {
  const { createApp } = await import('./app')
  const { ApiException } = await import('./errors')
  const previousEnvironment = process.env.NODE_ENV
  const previousError = console.error
  const lines: string[] = []
  process.env.NODE_ENV = 'production'
  console.error = (...args: unknown[]) => { lines.push(args.map(String).join(' ')) }
  try {
    const app = createApp({
      db: {} as import('./db/client').DatabaseHandle,
      userProvider: async () => { throw new ApiException(503, 'ADVANCED_BANK_UNAVAILABLE', 'Unavailable', { operation: 'advanced_bank', category: 'compatibility_provider', reason: 'compatibility_provider' }) },
    })
    const response = await app.request('/api/v1/me?private=secret', { headers: { authorization: 'Bearer private-token' } })
    expect(response.status).toBe(503)
    expect(response.headers.get('X-Cert-Prep-Diagnostic')).toBe('compatibility_provider')
    expect(response.headers.get('X-Request-Id')).toMatch(/^[a-f0-9-]{36}$/)
    expect(await response.json()).toEqual({ error: { code: 'ADVANCED_BANK_UNAVAILABLE', message: 'Unavailable' } })
    expect(lines).toHaveLength(1)
    const event = JSON.parse(lines[0]!)
    expect(event).toMatchObject({ event: 'api_request_failed', operation: 'advanced_bank', category: 'compatibility_provider', code: 'ADVANCED_BANK_UNAVAILABLE', status: 503 })
    expect(event.requestId).toMatch(/^[a-f0-9-]{36}$/)
    expect(lines[0]).not.toContain('private')
    expect(lines[0]).not.toContain('secret')
  } finally {
    process.env.NODE_ENV = previousEnvironment
    console.error = previousError
  }
})
