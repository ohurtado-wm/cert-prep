import { describe, expect, test } from 'bun:test'
import { readInitialPreferences, saveInitialPreferences } from '../apps/web/src/i18n/preferences'

function memoryStorage(entries: Array<[string, string]> = []) {
  const values = new Map(entries)
  return {
    values,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value) },
  }
}

describe('initial preferences', () => {
  test('requires confirmation when either preference is absent or invalid and preserves valid values', () => {
    expect(readInitialPreferences(memoryStorage())).toEqual({ locale: 'es', theme: 'system', needsConfirmation: true })
    expect(readInitialPreferences(memoryStorage([['cert-helper-locale', 'en']]))).toEqual({ locale: 'en', theme: 'system', needsConfirmation: true })
    expect(readInitialPreferences(memoryStorage([['cert-helper-theme', 'dark']]))).toEqual({ locale: 'es', theme: 'dark', needsConfirmation: true })
    expect(readInitialPreferences(memoryStorage([['cert-helper-locale', 'invalid'], ['cert-helper-theme', 'system']]))).toEqual({ locale: 'es', theme: 'system', needsConfirmation: true })
    expect(readInitialPreferences(memoryStorage([['cert-helper-locale', 'en'], ['cert-helper-theme', 'system']]))).toEqual({ locale: 'en', theme: 'system', needsConfirmation: false })
  })

  test('saves both choices and does not touch the active session', () => {
    const storage = memoryStorage([['active-session', 'existing']])
    expect(saveInitialPreferences(storage, 'en', 'dark')).toBe(true)
    expect(readInitialPreferences(storage)).toEqual({ locale: 'en', theme: 'dark', needsConfirmation: false })
    expect(storage.values.get('active-session')).toBe('existing')
  })

  test('reports unavailable, partial, or silently unsuccessful storage', () => {
    expect(readInitialPreferences(undefined).needsConfirmation).toBe(true)
    expect(saveInitialPreferences(undefined, 'en', 'light')).toBe(false)
    const partial = memoryStorage()
    const failing = { getItem: partial.getItem, setItem: (key: string, value: string) => {
      if (key === 'cert-helper-theme') throw new Error('blocked')
      partial.setItem(key, value)
    } }
    expect(saveInitialPreferences(failing, 'en', 'dark')).toBe(false)
    expect(readInitialPreferences(partial)).toEqual({ locale: 'en', theme: 'system', needsConfirmation: true })
    expect(saveInitialPreferences({ getItem: () => null, setItem: () => {} }, 'en', 'dark')).toBe(false)
    expect(readInitialPreferences({ getItem: () => { throw new Error('blocked') } }).needsConfirmation).toBe(true)
  })
})
