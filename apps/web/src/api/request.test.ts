import { describe, expect, test } from 'bun:test'
import { z } from 'zod'
import { ApiClientError, requestJson } from './request'
import { simulationErrorMessage } from '../i18n/error-messages'
import { SimulationApiError } from './simulations'

const schema = z.object({ ok: z.boolean() })
const createError = (code: string, status?: number) => new ApiClientError(code, status)

describe('shared API response handling', () => {
  test('validates successful responses and preserves server codes', async () => {
    expect(await requestJson('/test', schema, {}, async () => Response.json({ ok: true }), createError)).toEqual({ ok: true })
    await expect(requestJson('/test', schema, {}, async () => Response.json({ error: { code: 'KNOWN', message: 'private' } }, { status: 503 }), createError)).rejects.toMatchObject({ code: 'KNOWN', status: 503 })
  })

  test('distinguishes network failures, invalid JSON and invalid payloads', async () => {
    await expect(requestJson('/test', schema, {}, async () => { throw new Error('private') }, createError)).rejects.toMatchObject({ code: 'REQUEST_FAILED' })
    await expect(requestJson('/test', schema, {}, async () => new Response('bad'), createError)).rejects.toMatchObject({ code: 'INVALID_API_RESPONSE', status: 200 })
    await expect(requestJson('/test', schema, {}, async () => Response.json({ ok: 'invalid' }), createError)).rejects.toMatchObject({ code: 'INVALID_API_RESPONSE' })
  })

  test('preserves aborts', async () => {
    const controller = new AbortController()
    controller.abort()
    const abort = new DOMException('cancelled', 'AbortError')
    await expect(requestJson('/test', schema, { signal: controller.signal }, async () => { throw abort }, createError)).rejects.toBe(abort)
  })

  test('shows localized messages without server text', () => {
    expect(simulationErrorMessage('en', new SimulationApiError('REQUEST_FAILED'))).toContain('connect')
    expect(simulationErrorMessage('es', new SimulationApiError('REQUEST_FAILED'))).toContain('conectar')
    expect(simulationErrorMessage('en', new SimulationApiError('ADVANCED_BANK_UNAVAILABLE'))).toContain('Advanced practice')
    expect(simulationErrorMessage('es', new SimulationApiError('UNKNOWN'))).toContain('solicitud')
  })
})

test('browser diagnostics expose only safe request metadata, including an advanced-bank reason', async () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const originalError = console.error
  const events: unknown[][] = []
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {} })
  console.error = (...args: unknown[]) => { events.push(args) }
  try {
    const requestId = 'a1a2a3a4-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
    const headers = { 'X-Request-Id': requestId, 'X-Cert-Prep-Diagnostic': 'asset_read' }
    await expect(requestJson('/api/v1/simulations/private-session?token=secret', schema, {}, async () => Response.json({ error: { code: 'ADVANCED_BANK_UNAVAILABLE', message: 'private question and answer' } }, { status: 503, headers }), createError)).rejects.toMatchObject({ code: 'ADVANCED_BANK_UNAVAILABLE' })
    expect(events).toEqual([['[cert-prep] API request failed', { operation: 'simulations', code: 'ADVANCED_BANK_UNAVAILABLE', status: 503, requestId, reason: 'asset_read' }]])
    expect(JSON.stringify(events)).not.toContain('secret')
    expect(JSON.stringify(events)).not.toContain('private')
    events.length = 0
    await expect(requestJson('/api/v1/simulations/private-session', schema, {}, async () => Response.json({ error: { code: 'SECRET_DATA', message: 'private' } }, { status: 500, headers: { 'X-Cert-Prep-Diagnostic': 'private', 'X-Request-Id': 'private' } }), createError)).rejects.toMatchObject({ code: 'SECRET_DATA' })
    expect(events).toEqual([['[cert-prep] API request failed', { operation: 'simulations', code: 'UNKNOWN_API_ERROR', status: 500 }]])
    events.length = 0
    const abort = new DOMException('secret', 'AbortError')
    await expect(requestJson('/api/v1/simulations', schema, {}, async () => { throw abort }, createError)).rejects.toBe(abort)
    expect(events).toHaveLength(0)
  } finally {
    console.error = originalError
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow)
    else Reflect.deleteProperty(globalThis, 'window')
  }
})
