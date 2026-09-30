import type { Locale } from '../api/certification-contracts'

const localeStorageKey = 'cert-helper-locale'

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
  } catch {
    // The selected language still applies for the current page session.
  }
}
