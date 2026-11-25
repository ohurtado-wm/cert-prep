import type { Locale } from '@cert-prep/contracts/certification-contracts'
import { ApiClientError } from '../api/request'
import { CertificationApiError } from '../api/certifications'
import { StudyPlanApiError } from '../api/study-plans'
import { SimulationApiError } from '../api/simulations'
import { translate } from './messages'

export function commonErrorMessage(locale: Locale, error: unknown): string | null {
  if (!(error instanceof ApiClientError)) return null
  if (error.code === 'REQUEST_FAILED') return translate(locale, 'networkError')
  if (error.code === 'INVALID_API_RESPONSE') return translate(locale, 'invalidResponseError')
  if (error.code === 'UNAUTHENTICATED') return translate(locale, 'authRequired')
  return null
}

export function guideErrorMessage(locale: Locale, error: unknown) {
  if (error instanceof CertificationApiError && error.code === 'GUIDE_REFRESH_IN_PROGRESS') {
    return translate(locale, 'guideRefreshing')
  }
  return commonErrorMessage(locale, error) ?? translate(locale, 'guideError')
}

export function profileErrorMessage(locale: Locale, error: unknown) {
  if (!error || (error instanceof SimulationApiError && error.code === 'UNAUTHENTICATED')) {
    return translate(locale, 'authRequired')
  }
  return commonErrorMessage(locale, error) ?? translate(locale, 'profileError')
}


export function simulationErrorMessage(locale: Locale, error: unknown) {
  if (error instanceof SimulationApiError && error.code === 'UNAUTHENTICATED') return translate(locale, 'authRequired')
  if (error instanceof SimulationApiError && error.code === 'SIMULATION_GENERATION_IN_PROGRESS') return translate(locale, 'simulationPreparing')
  if (error instanceof SimulationApiError && error.code === 'ADVANCED_BANK_UNAVAILABLE') return translate(locale, 'advancedUnavailable')
  if (error instanceof SimulationApiError && error.code === 'SIMULATION_RATE_LIMITED') return translate(locale, 'simulationRateLimited')
  if (error instanceof SimulationApiError && ['SIMULATION_CONFLICT', 'SIMULATION_EXPIRED', 'SIMULATION_NOT_FOUND', 'SIMULATION_COMPLETED', 'QUESTION_OUT_OF_ORDER'].includes(error.code)) return translate(locale, 'simulationSessionChanged')
  return commonErrorMessage(locale, error) ?? translate(locale, 'simulationError')
}

export function studyPlanErrorMessage(locale: Locale, error: unknown, generating = false) {
  const common = commonErrorMessage(locale, error)
  if (common) return common
  if (!(error instanceof StudyPlanApiError)) return translate(locale, 'studyPlanGenerateError')
  switch (error.code) {
    case 'STUDY_PLAN_HISTORY_EMPTY':
      return translate(locale, 'studyPlanNoHistory')
    case 'STUDY_PLAN_NO_REVIEW_AREAS':
      return translate(locale, 'studyPlanNoWeakAreas')
    case 'STUDY_PLAN_AI_UNAVAILABLE':
    case 'STUDY_PLAN_INVALID_OUTPUT':
      return translate(locale, 'studyPlanGenerateError')
    default:
      return translate(locale, generating ? 'studyPlanGenerateError' : 'studyPlanError')
  }
}

