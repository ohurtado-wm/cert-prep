import { describe, expect, test } from 'bun:test'
import { SimulationApiError } from '../apps/web/src/api/simulations'
import { StudyPlanApiError } from '../apps/web/src/api/study-plans'
import { hasIdentityChanged, isConfirmedSignOut } from '../apps/web/src/data/identity'

describe('identity transitions', () => {
  test('a failed profile refresh does not discard the previous identity or local results', () => {
    const error = new SimulationApiError('REQUEST_FAILED')
    expect(isConfirmedSignOut(error)).toBe(false)
    expect(hasIdentityChanged('user-1', null, error)).toBe(false)
    expect(hasIdentityChanged('user-1', 'user-1', error)).toBe(false)
  })
  test('sign-out and a different user still clear private state', () => {
    expect(isConfirmedSignOut(new SimulationApiError('UNAUTHENTICATED'))).toBe(true)
    expect(isConfirmedSignOut(null, new StudyPlanApiError('UNAUTHENTICATED'))).toBe(true)
    expect(hasIdentityChanged('user-1', 'user-2', null)).toBe(true)
    expect(hasIdentityChanged('user-1', null, null)).toBe(true)
  })
})
