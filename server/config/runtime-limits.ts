function readPositiveInteger(name: string, defaultValue: number) {
  const configuredValue = process.env[name]?.trim()
  if (!configuredValue) return defaultValue

  const parsedValue = Number(configuredValue)
  if (!Number.isSafeInteger(parsedValue) || parsedValue < 1) {
    throw new Error(`${name} must be a positive integer.`)
  }
  return parsedValue
}

export const MAX_SIMULATION_HISTORY_ITEMS = readPositiveInteger('MAX_SIMULATION_HISTORY_ITEMS', 5)
export const MAX_STARTS_PER_HOUR = readPositiveInteger('MAX_STARTS_PER_HOUR', 10)

const GUIDE_MAX_AGE_DAYS = readPositiveInteger('AI_GUIDE_MAX_AGE_DAYS', 30)
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1_000
const guideMaxAgeMs = GUIDE_MAX_AGE_DAYS * MILLISECONDS_PER_DAY
if (!Number.isSafeInteger(guideMaxAgeMs) || guideMaxAgeMs > 8_640_000_000_000_000) {
  throw new Error('AI_GUIDE_MAX_AGE_DAYS is too large.')
}

export const GUIDE_MAX_AGE_MS = guideMaxAgeMs
