import type { Locale } from '@cert-prep/contracts/certification-contracts'

const localeStorageKey = 'cert-helper-locale'
const themeStorageKey = 'cert-helper-theme'

export type Theme = 'light' | 'dark'
export type ThemePreference = Theme | 'system'

type LocaleReader = Pick<Storage, 'getItem'>
type LocaleWriter = Pick<Storage, 'setItem'>

export function readLocalePreference(storage: LocaleReader): Locale | null {
  try {
    const value = storage.getItem(localeStorageKey)
    return value === 'es' || value === 'en' ? value : null
  } catch {
    return null
  }
}

export function writeLocalePreference(storage: LocaleWriter, locale: Locale) {
  try {
    storage.setItem(localeStorageKey, locale)
    return true
  } catch {
    return false
  }
}

export function readStoredThemePreference(storage: LocaleReader): ThemePreference | null {
  try {
    const value = storage.getItem(themeStorageKey)
    return value === 'light' || value === 'dark' || value === 'system' ? value : null
  } catch {
    return null
  }
}

export function readThemePreference(storage: LocaleReader): ThemePreference {
  return readStoredThemePreference(storage) ?? 'system'
}

export function writeThemePreference(storage: LocaleWriter, preference: ThemePreference) {
  try {
    storage.setItem(themeStorageKey, preference)
    return true
  } catch {
    return false
  }
}

type PreferenceStorage = Pick<Storage, 'getItem' | 'setItem'>

export function readInitialPreferences(storage: LocaleReader | undefined) {
  const locale = storage ? readLocalePreference(storage) : null
  const theme = storage ? readStoredThemePreference(storage) : null
  return { locale: locale ?? 'es', theme: theme ?? 'system', needsConfirmation: !locale || !theme }
}

export function saveInitialPreferences(storage: PreferenceStorage | undefined, locale: Locale, theme: ThemePreference): boolean {
  if (!storage) return false
  const localeWritten = writeLocalePreference(storage, locale)
  const themeWritten = writeThemePreference(storage, theme)
  return localeWritten && themeWritten && readLocalePreference(storage) === locale && readStoredThemePreference(storage) === theme
}

export function observeThemePreference(
  preference: ThemePreference,
  matchMedia: ((query: string) => MediaQueryList) | undefined,
  onChange: (theme: Theme) => void,
): () => void {
  if (preference !== 'system') {
    onChange(preference)
    return () => {}
  }
  let query: MediaQueryList
  try {
    if (!matchMedia) throw new Error('matchMedia unavailable')
    query = matchMedia('(prefers-color-scheme: dark)')
  } catch {
    onChange('light')
    return () => {}
  }
  const update = (event: Pick<MediaQueryListEvent, 'matches'>) => onChange(event.matches ? 'dark' : 'light')
  update(query)
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }
  if (typeof query.addListener === 'function') {
    query.addListener(update)
    return () => query.removeListener(update)
  }
  return () => {}
}
