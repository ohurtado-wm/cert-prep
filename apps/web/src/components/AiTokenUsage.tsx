import type { AiTokenUsage as AiTokenUsageData } from '@cert-prep/contracts/ai-usage-contracts'
import type { Locale } from '@cert-prep/contracts/certification-contracts'
import { translate } from '../i18n/messages'

export function AiTokenUsage({
  locale,
  usage,
  compact = false,
}: {
  locale: Locale
  usage: AiTokenUsageData | null | undefined
  compact?: boolean
}) {
  if (!usage) return null

  const totalTokens = usage.totalTokens
    ?? (usage.inputTokens !== null && usage.outputTokens !== null
      ? usage.inputTokens + usage.outputTokens
      : null)
  const format = (value: number | null) => value === null ? '—' : value.toLocaleString(locale)
  const label = translate(locale, 'aiTokenUsage', {
    total: format(totalTokens),
    input: format(usage.inputTokens),
    output: format(usage.outputTokens),
  })

  return (
    <p className={`ai-token-usage${compact ? ' ai-token-usage-compact' : ''}`} aria-label={label}>
      <span className="ai-token-usage-mark" aria-hidden="true">AI</span>
      <span>{label}</span>
    </p>
  )
}
