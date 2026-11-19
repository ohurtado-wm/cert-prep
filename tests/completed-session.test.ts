import { describe, expect, test } from 'bun:test'
import { getOwnedCompletedSession, type CompletedSessionView } from '../apps/web/src/data/completed-session'

const session: CompletedSessionView = {
  ownerId: 'user-1', sessionId: 'session-1', certificationId: 'cert-1', mode: 'real', language: 'es', aiUsage: null,
  result: { score: 80, totalQuestions: 20, correctAnswers: 16, correctAfterRetry: 0, answersRevealed: 0, incorrectAnswers: 4, domainBreakdown: [], topicBreakdown: [], focusBreakdown: [] },
  printableQuestions: [{ question: 'Question', answer: 'Answer' }],
}

describe('completed session access', () => {
  test('retains the result and printable questions for the matching user and certification', () => {
    expect(getOwnedCompletedSession(session, 'user-1', 'cert-1')).toEqual(session)
  })
  test('does not expose the result to another user or certification', () => {
    expect(getOwnedCompletedSession(session, 'user-2', 'cert-1')).toBeNull()
    expect(getOwnedCompletedSession(session, undefined, 'cert-1')).toBeNull()
    expect(getOwnedCompletedSession(session, 'user-1', 'cert-2')).toBeNull()
    expect(getOwnedCompletedSession(null, 'user-1', 'cert-1')).toBeNull()
  })
})
