const DEFAULT_TIMEOUT_SECONDS = 60
const MAX_TIMEOUT_SECONDS = Math.floor(2_147_483_647 / 1_000)

function readAiRequestTimeoutMs() {
  const configuredValue = process.env.AI_REQUEST_TIMEOUT_SECONDS?.trim()
  const timeoutSeconds = configuredValue ? Number(configuredValue) : DEFAULT_TIMEOUT_SECONDS

  if (!Number.isSafeInteger(timeoutSeconds) || timeoutSeconds < 1 || timeoutSeconds > MAX_TIMEOUT_SECONDS) {
    throw new Error(`AI_REQUEST_TIMEOUT_SECONDS must be a whole number between 1 and ${MAX_TIMEOUT_SECONDS}.`)
  }

  return timeoutSeconds * 1_000
}

export const AI_REQUEST_TIMEOUT_MS = readAiRequestTimeoutMs()
