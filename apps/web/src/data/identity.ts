import { SimulationApiError } from '../api/simulations'
import { StudyPlanApiError } from '../api/study-plans'

export function isConfirmedSignOut(...errors: unknown[]): boolean {
  return errors.some((error) => (error instanceof SimulationApiError || error instanceof StudyPlanApiError) && error.code === 'UNAUTHENTICATED')
}

export function hasIdentityChanged(previousId: string | null, currentId: string | null, userError: unknown): boolean {
  return Boolean(previousId && previousId !== currentId && (currentId !== null || !userError))
}
