import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { InitialPreferencesDialog } from './InitialPreferencesDialog'

describe('initial preferences dialog', () => {
  test('presents both languages and all choices with one confirmation control', () => {
    const html = renderToStaticMarkup(<InitialPreferencesDialog initialLocale="en" initialTheme="dark" onPreviewTheme={() => {}} onConfirm={() => {}} />)
    expect(html).toContain('<dialog')
    expect(html).toContain('aria-labelledby="initial-preferences-title"')
    expect(html).toContain('Idioma')
    expect(html).toContain('Language')
    expect(html).toContain('Apariencia')
    expect(html).toContain('Appearance')
    expect(html).toContain('Confirmar')
    expect(html).toContain('Confirm')
    expect(html).toContain('name="initial-locale" checked="" value="en"')
    expect(html).toContain('name="initial-theme" checked="" value="dark"')
    expect((html.match(/<button/g) ?? []).length).toBe(1)
  })
})
