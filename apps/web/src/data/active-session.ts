import type { SimulationSnapshot } from '@cert-prep/contracts/simulation-contracts'

export function isCurrentRealAnswer(context: {
  authenticated: boolean
  userId: string | undefined
  screen: string
  activeSessionId: string | undefined
  questionId: string | undefined
  questionIndex: number | undefined
}, ownerId: string | undefined, submitted: SimulationSnapshot | null, questionId: string): boolean {
  return Boolean(ownerId && submitted && context.authenticated && context.userId === ownerId
    && context.screen === 'quiz' && context.activeSessionId === submitted.sessionId
    && context.questionId === questionId && context.questionIndex === submitted.currentIndex)
}

export async function requireMatchingActiveSession(
  expected: Pick<SimulationSnapshot, 'sessionId' | 'certificationId'>,
  load: () => Promise<SimulationSnapshot | null>,
): Promise<SimulationSnapshot> {
  const current = await load()
  if (!current || current.status !== 'active' || current.sessionId !== expected.sessionId || current.certificationId !== expected.certificationId) {
    throw new Error('The saved session is no longer available')
  }
  return current
}
