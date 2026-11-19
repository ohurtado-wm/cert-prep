import { useState } from 'react'

export function AccountAvatar({ avatar }: { avatar?: string | null }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const imageUrl = avatar?.trim()

  return <span className="account-avatar" aria-hidden="true">
    {imageUrl && imageUrl !== failedUrl ? (
      <img className="account-avatar-image" src={imageUrl} alt="" onError={() => setFailedUrl(imageUrl)} />
    ) : (
      <svg className="account-avatar-fallback" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" focusable="false">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
      </svg>
    )}
  </span>
}
