import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@cert-prep/contracts/certification-contracts'
import type { CurrentUserResponse } from '@cert-prep/contracts/contracts'
import { translate } from '../i18n/messages'
import type { Theme, ThemePreference } from '../i18n/preferences'
import { AccountAvatar } from './AccountAvatar'
import type { View } from './HomeScreen'

export function SimulationProcessingOverlay({ locale, elapsedSeconds }: { locale: Locale; elapsedSeconds: number }) {
  const slow = elapsedSeconds >= 25
  const text = (key: Parameters<typeof translate>[1], values?: Record<string, string | number>) => translate(locale, key, values)

  return (
    <div className="ai-processing-backdrop">
      <div className="ai-processing-dialog" role="status" aria-live="polite" aria-busy="true">
        <p className="eyebrow">{text('simulationLoadingEyebrow')}</p>
        <div className="ai-processing-heading">
          <span className="guide-loading-spinner" aria-hidden="true" />
          <h2>{text('simulationLoadingTitle')}</h2>
        </div>
        <p key={slow ? 'slow' : 'detail'} className="ai-processing-detail">
          {text(slow ? 'simulationLoadingSlow' : 'simulationLoadingDetail')}
        </p>
        <span className="ai-processing-elapsed" aria-hidden="true">
          {text('guideLoadingElapsed', { seconds: elapsedSeconds })}
        </span>
        <div className="guide-loading-track" aria-hidden="true"><span /></div>
      </div>
    </div>
  )
}

export function Header({ theme, locale, user, loading, view, onNavigate }: {
  theme: Theme
  locale: Locale
  user: CurrentUserResponse['user'] | null
  loading: boolean
  view: View
  onNavigate: (view: View) => void
}) {
  const text = (key: Parameters<typeof translate>[1]) => translate(locale, key)
  const [open, setOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => { if (!container.current?.contains(event.target as Node)) setOpen(false) }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
  }, [open])
  const links: Array<[View, Parameters<typeof translate>[1]]> = [
    ['dashboard', 'navDashboard'], ['progress', 'navProgress'], ['study-plan', 'navStudyPlan'],
    ['resources', 'navResources'], ['settings', 'navSettings'],
  ]
  // TODO: Show the full name when the gateway's verified profile field is documented.
  const accountLabel = user?.email ?? user?.id
  return (
    <header className="site-header sticky top-0 z-50 flex w-full items-center justify-center border-b border-neutral-300 bg-neutral-50/90 py-2 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/90">
      <div className="content-width header-inner flex w-full items-center justify-between">
        <a className="brand-lockup" href="#/dashboard" onClick={() => onNavigate('dashboard')}>
          <img className="brand-logo" src={theme === 'dark' ? '/assets/logo/wm_h_rev_wht_rgb_august2024.svg' : '/assets/logo/wm_h_pos_clr_rgb_august2024.svg'} alt={text('brandLabel')} width="173" height="36" />
          <span className="brand-divider" aria-hidden="true" /><span className="product-name">CERTIFICATION HELPER</span>
        </a>
        <div className="account-menu" ref={container}>
          <button ref={trigger} className="account-trigger" type="button" aria-expanded={open} aria-controls="account-navigation" onClick={() => setOpen(!open)}>
            <AccountAvatar key={user?.avatar ?? ''} avatar={user?.avatar} />
            <span className="account-name">{loading ? text('profileLoading') : accountLabel || text('accountMenu')}</span>
            <svg className="account-caret" aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="m3 6 5 5 5-5" /></svg>
          </button>
          {open && <nav id="account-navigation" className="account-dropdown" aria-label={text('accountMenu')}>
            {user?.email && <p className="account-email">{user.email}</p>}
            {links.map(([destination, label]) => <a key={destination} href={`#/${destination}`} aria-current={view === destination ? 'page' : undefined} onClick={() => { setOpen(false); onNavigate(destination) }}>{text(label)}</a>)}
          </nav>}
        </div>
      </div>
    </header>
  )
}

export function SettingsScreen({ locale, themePreference, onThemeChange, onLocaleChange }: {
  locale: Locale; themePreference: ThemePreference; onThemeChange: (preference: ThemePreference) => void; onLocaleChange: (locale: Locale) => void
}) {
  const text = (key: Parameters<typeof translate>[1]) => translate(locale, key)
  return <main className="content-width page-content settings-page">
    <h1 className="view-title">{text('settingsTitle')}</h1>
    <p className="section-intro settings-intro">{text('settingsDescription')}</p>
    <section className="settings-card" aria-labelledby="settings-preferences">
      <h2 id="settings-preferences">{text('settingsPreferences')}</h2>
      <div className="settings-row"><div><strong id="language-preference-label">{text('languageLabel')}</strong><p>{text('settingsLanguageHelp')}</p></div>
        <div className="theme-preference" role="radiogroup" aria-labelledby="language-preference-label">
          {([['es', 'Español'], ['en', 'English']] as const).map(([option, label]) => (
            <label className={`theme-preference-option${locale === option ? ' is-active' : ''}`} key={option}>
              <input type="radio" name="language-preference" value={option} checked={locale === option} onChange={() => onLocaleChange(option)} />
              <span lang={option}>{label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="settings-row">
        <div><strong id="theme-preference-label">{text('settingsAppearance')}</strong><p>{text('settingsThemeHelp')}</p></div>
        <div className="theme-preference" role="radiogroup" aria-labelledby="theme-preference-label">
          {(['system', 'light', 'dark'] as const).map(option => (
            <label className={`theme-preference-option${themePreference === option ? ' is-active' : ''}`} key={option}>
              <input type="radio" name="theme-preference" value={option} checked={themePreference === option} onChange={() => onThemeChange(option)} />
              {text(option === 'system' ? 'themeSystem' : option === 'light' ? 'themeLight' : 'themeDark')}
            </label>
          ))}
        </div>
      </div>
    </section>
    <section className="settings-card" aria-labelledby="settings-about"><h2 id="settings-about">{text('settingsAbout')}</h2><p>{text('settingsAboutDescription')}</p><p><strong>{text('settingsVersion')}</strong> v1.1</p></section>
  </main>
}

export function LoadingState({ locale }: { locale: Locale }) {
  const text = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  return (
    <main className="content-width state-page" aria-live="polite">
      <p className="eyebrow">{text('loadingCatalogEyebrow')}</p>
      <h1>{text('loadingCatalogTitle')}</h1>
      <p className="body-copy">{text('loadingCatalogBody')}</p>
    </main>
  )
}

export function ErrorState({ locale, message, onRetry }: { locale: Locale; message: string; onRetry: () => void }) {
  const text = (key: Parameters<typeof translate>[1]) => translate(locale, key)

  return (
    <main className="content-width state-page" role="alert">
      <p className="eyebrow">{text('errorEyebrow')}</p>
      <h1>{text('errorTitle')}</h1>
      <p className="body-copy">{message}</p>
      <button className="button button-primary" type="button" onClick={onRetry}>{text('retry')}</button>
    </main>
  )
}

