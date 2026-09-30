import {
  CertificationCollectionSchema,
  type Certification,
} from './certification-schema'

export async function loadCertifications(): Promise<Certification[]> {
  const response = await fetch('/data/certifications.json')

  if (!response.ok) {
    throw new Error('No se pudo cargar el banco de preguntas local.')
  }

  const result = CertificationCollectionSchema.safeParse(await response.json())

  if (!result.success) {
    const firstIssue = result.error.issues[0]?.message ?? 'El formato del archivo no es válido.'
    throw new Error(`El banco de preguntas no es válido: ${firstIssue}`)
  }

  if (!result.data.certifications.some((item) => item.id === 'gcp-professional-cloud-developer')) {
    throw new Error('No se encontró la certificación Professional Cloud Developer.')
  }

  return result.data.certifications
}
