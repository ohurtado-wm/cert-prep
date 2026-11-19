import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@cert-prep/contracts/certification-contracts'
import type { ThemePreference } from '../i18n/preferences'

export function InitialPreferencesDialog({ initialLocale, initialTheme, onPreviewTheme, onConfirm }: {
  initialLocale: Locale
  initialTheme: ThemePreference
  onPreviewTheme: (theme: ThemePreference) => void
  onConfirm: (locale: Locale, theme: ThemePreference) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [locale, setLocale] = useState(initialLocale)
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (typeof dialog.showModal === 'function') dialog.showModal()
    else dialog.setAttribute('open', '')
    return () => {
      if (dialog.open && typeof dialog.close === 'function') dialog.close()
      else dialog.removeAttribute('open')
    }
  }, [])

  return (
    <dialog ref={dialogRef} className="initial-preferences-dialog" aria-modal="true" aria-labelledby="initial-preferences-title" aria-describedby="initial-preferences-description" onCancel={(event) => event.preventDefault()}>
      <form onSubmit={(event) => { event.preventDefault(); onConfirm(locale, theme) }}>
        <p className="initial-preferences-eyebrow">CERTIFICATION HELPER</p>
        <h1 id="initial-preferences-title"><span lang="es">Elige tus preferencias</span> <span aria-hidden="true">/</span> <span lang="en">Choose your preferences</span></h1>
        <p id="initial-preferences-description"><span lang="es">Puedes cambiarlas después en Configuración.</span> <span lang="en">You can change them later in Settings.</span></p>
        <fieldset>
          <legend><span lang="es">Idioma</span> / <span lang="en">Language</span></legend>
          <div className="initial-preferences-options">
            {([['es', 'Español'], ['en', 'English']] as const).map(([value, label]) => (
              <label key={value} className={`initial-preferences-option${locale === value ? ' is-active' : ''}`}>
                <input type="radio" name="initial-locale" value={value} checked={locale === value} onChange={() => setLocale(value)} autoFocus={value === initialLocale} />
                <span lang={value}>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend><span lang="es">Apariencia</span> / <span lang="en">Appearance</span></legend>
          <div className="initial-preferences-options">
            {([
              ['system', 'Sistema', 'System'],
              ['light', 'Claro', 'Light'],
              ['dark', 'Oscuro', 'Dark'],
            ] as const).map(([value, es, en]) => (
              <label key={value} className={`initial-preferences-option${theme === value ? ' is-active' : ''}`}>
                <input type="radio" name="initial-theme" value={value} checked={theme === value} onChange={() => { setTheme(value); onPreviewTheme(value) }} />
                <span><span lang="es">{es}</span> / <span lang="en">{en}</span></span>
              </label>
            ))}
          </div>
        </fieldset>
        <button className="button button-primary initial-preferences-confirm" type="submit"><span lang="es">Confirmar</span> / <span lang="en">Confirm</span></button>
      </form>
    </dialog>
  )
}
