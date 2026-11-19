import type { Locale } from '@cert-prep/contracts/certification-contracts'
import type { PrintableSimulationQuestion, SimulationMode, SimulationResult, SimulationSnapshot } from '@cert-prep/contracts/simulation-contracts'

export type CompletedSessionView = {
  ownerId: string
  sessionId: string
  certificationId: string
  mode: SimulationMode
  language: Locale
  aiUsage: SimulationSnapshot['aiUsage']
  result: SimulationResult
  printableQuestions: PrintableSimulationQuestion[]
}

export function getOwnedCompletedSession(
  session: CompletedSessionView | null,
  ownerId: string | undefined,
  certificationId: string | undefined,
): CompletedSessionView | null {
  return ownerId && session?.ownerId === ownerId && session.certificationId === certificationId ? session : null
}
