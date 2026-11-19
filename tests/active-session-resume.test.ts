import { describe, expect, test } from 'bun:test'
import type { SimulationSnapshot } from '@cert-prep/contracts/simulation-contracts'
import { isCurrentRealAnswer, requireMatchingActiveSession } from '../apps/web/src/data/active-session'

const saved: SimulationSnapshot = {
  sessionId: 'active-1', certificationId: 'cert-one', createdAt: '2026-01-01T12:00:00.000Z', mode: 'real', language: 'en',
  status: 'active', questionCount: 20, currentIndex: 4, expiresAt: null, currentQuestion: null, practiceProgress: null, result: null,
}

describe('revalidating a saved session', () => {
  test('returns the current server snapshot, preserving its saved language, mode and latest progress', async () => {
    let calls = 0
    const current = { ...saved, currentIndex: 7 }
    const result = await requireMatchingActiveSession(saved, async () => { calls++; return current })
    expect(result).toEqual(current)
    expect(result.mode).toBe('real')
    expect(result.language).toBe('en')
    expect(calls).toBe(1)
  })
  test('does not resume a removed, completed, replaced, or different-certification session', async () => {
    const variants: Array<SimulationSnapshot | null> = [null, { ...saved, status: 'completed' }, { ...saved, sessionId: 'different' }, { ...saved, certificationId: 'other' }]
    for (const current of variants) {
      await expect(requireMatchingActiveSession(saved, async () => current)).rejects.toThrow('no longer available')
    }
  })
  test('propagates load failures for a recoverable UI error', async () => {
    await expect(requireMatchingActiveSession(saved, async () => { throw new Error('offline') })).rejects.toThrow('offline')
  })
})

describe('late real simulation responses', () => {
  const context = { authenticated: true, userId: 'user-1', screen: 'quiz', activeSessionId: saved.sessionId, questionId: 'question-1', questionIndex: saved.currentIndex }
  test('only updates the submitted question for the same user and session', () => {
    expect(isCurrentRealAnswer(context, 'user-1', saved, 'question-1')).toBe(true)
    expect(isCurrentRealAnswer({ ...context, questionId: 'question-2', questionIndex: 5 }, 'user-1', saved, 'question-1')).toBe(false)
    expect(isCurrentRealAnswer({ ...context, activeSessionId: 'other' }, 'user-1', saved, 'question-1')).toBe(false)
    expect(isCurrentRealAnswer({ ...context, screen: 'home' }, 'user-1', saved, 'question-1')).toBe(false)
    expect(isCurrentRealAnswer({ ...context, userId: 'user-2' }, 'user-1', saved, 'question-1')).toBe(false)
    expect(isCurrentRealAnswer({ ...context, authenticated: false }, 'user-1', saved, 'question-1')).toBe(false)
  })
})
