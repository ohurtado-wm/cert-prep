import { describe, expect, test } from 'bun:test'
import { observeThemePreference, readThemePreference, writeThemePreference, type Theme } from '../apps/web/src/i18n/preferences'

describe('theme preferences', () => {
  test('preserves existing choices and stores system independently of locale', () => {
    const values = new Map<string, string>([['cert-helper-locale', 'en']])
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    }
    expect(readThemePreference(storage)).toBe('system')
    for (const preference of ['light', 'dark', 'system'] as const) {
      writeThemePreference(storage, preference)
      expect(readThemePreference(storage)).toBe(preference)
    }
    values.set('cert-helper-theme', 'invalid')
    expect(readThemePreference(storage)).toBe('system')
    expect(values.get('cert-helper-locale')).toBe('en')
  })

  test('handles unavailable storage and missing device preferences', () => {
    const storage = {
      getItem: () => { throw new Error('blocked') },
      setItem: () => { throw new Error('blocked') },
    }
    expect(readThemePreference(storage)).toBe('system')
    expect(() => writeThemePreference(storage, 'dark')).not.toThrow()
    const themes: Theme[] = []
    observeThemePreference('system', undefined, (theme) => themes.push(theme))()
    expect(themes).toEqual(['light'])
  })

  test('follows device changes and removes the listener when switching to a fixed theme', () => {
    let listener: ((event: MediaQueryListEvent) => void) | undefined
    let removed = false
    const media = {
      matches: false,
      addEventListener: (_type: string, callback: (event: MediaQueryListEvent) => void) => { listener = callback },
      removeEventListener: (_type: string, callback: (event: MediaQueryListEvent) => void) => {
        if (listener === callback) { listener = undefined; removed = true }
      },
    } as unknown as MediaQueryList
    const themes: Theme[] = []
    const cleanup = observeThemePreference('system', (query) => {
      expect(query).toBe('(prefers-color-scheme: dark)')
      return media
    }, (theme) => themes.push(theme))
    listener?.({ matches: true } as MediaQueryListEvent)
    expect(themes).toEqual(['light', 'dark'])
    cleanup()
    expect(removed).toBe(true)
    observeThemePreference('light', () => { throw new Error('fixed theme must not subscribe') }, (theme) => themes.push(theme))()
    expect(themes).toEqual(['light', 'dark', 'light'])
  })
})
