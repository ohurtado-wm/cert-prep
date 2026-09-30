import type { CertificationCatalogItem } from '../../src/api/certification-contracts'

export const certificationCatalog: CertificationCatalogItem[] = [
  {
    id: 'gcp-professional-cloud-developer',
    name: {
      en: 'Professional Cloud Developer',
      es: 'Desarrollador profesional de Google Cloud',
    },
    examCode: null,
    sources: [
      {
        kind: 'exam-guide',
        title: 'Professional Cloud Developer exam guide',
        url: 'https://cloud.google.com/learn/certification/guides/cloud-developer',
      },
      {
        kind: 'certification',
        title: 'Professional Cloud Developer certification',
        url: 'https://cloud.google.com/learn/certification/cloud-developer',
      },
      {
        kind: 'learning-path',
        title: 'Professional Cloud Developer learning path',
      url: 'https://www.skills.google/paths/19?locale=en',
      },
    ],
  },
]

export function getCertificationDefinition(id: string) {
  return certificationCatalog.find((certification) => certification.id === id)
}
