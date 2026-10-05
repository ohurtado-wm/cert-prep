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
        url: 'https://www.skills.google/paths/19',
      },
    ],
  },
  {
    id: 'gcp-professional-cloud-architect',
    name: {
      en: 'Professional Cloud Architect',
      es: 'Arquitecto profesional de Google Cloud',
    },
    examCode: null,
    sources: [
      {
        kind: 'exam-guide',
        title: 'Professional Cloud Architect exam guide',
        url: 'https://services.google.com/fh/files/misc/professional_cloud_architect_exam_guide_english.pdf',
      },
      {
        kind: 'certification',
        title: 'Professional Cloud Architect certification',
        url: 'https://cloud.google.com/learn/certification/cloud-architect',
      },
      {
        kind: 'learning-path',
        title: 'Professional Cloud Architect learning path',
        url: 'https://www.skills.google/paths/12',
      },
    ],
  },
  {
    id: 'gcp-professional-cloud-database-engineer',
    name: {
      en: 'Professional Cloud Database Engineer',
      es: 'Ingeniero profesional de bases de datos en la nube',
    },
    examCode: null,
    sources: [
      {
        kind: 'exam-guide',
        title: 'Professional Cloud Database Engineer exam guide',
        url: 'https://services.google.com/fh/files/misc/professional_cloud_database_engineer_exam_guide_english.pdf',
      },
      {
        kind: 'certification',
        title: 'Professional Cloud Database Engineer certification',
        url: 'https://cloud.google.com/learn/certification/cloud-database-engineer',
      },
      {
        kind: 'learning-path',
        title: 'Professional Cloud Database Engineer learning path',
        url: 'https://www.skills.google/paths/22',
      },
    ],
  },
  {
    id: 'gcp-professional-data-engineer',
    name: {
      en: 'Professional Data Engineer',
      es: 'Ingeniero profesional de datos',
    },
    examCode: null,
    sources: [
      {
        kind: 'exam-guide',
        title: 'Professional Data Engineer exam guide',
        url: 'https://services.google.com/fh/files/misc/professional_data_engineer_exam_guide_english.pdf',
      },
      {
        kind: 'certification',
        title: 'Professional Data Engineer certification',
        url: 'https://cloud.google.com/learn/certification/data-engineer',
      },
      {
        kind: 'learning-path',
        title: 'Professional Data Engineer learning path',
        url: 'https://www.skills.google/paths/16',
      },
    ],
  },
  {
    id: 'gcp-professional-cloud-devops-engineer',
    name: {
      en: 'Professional Cloud DevOps Engineer',
      es: 'Ingeniero profesional de DevOps en la nube',
    },
    examCode: null,
    sources: [
      {
        kind: 'exam-guide',
        title: 'Professional Cloud DevOps Engineer exam guide',
        url: 'https://services.google.com/fh/files/misc/professional_cloud_devops_engineer_exam_guide_english.pdf',
      },
      {
        kind: 'certification',
        title: 'Professional Cloud DevOps Engineer certification',
        url: 'https://cloud.google.com/learn/certification/cloud-devops-engineer',
      },
      {
        kind: 'learning-path',
        title: 'Professional Cloud DevOps Engineer learning path',
        url: 'https://www.skills.google/paths/20',
      },
    ],
  },
]

export function getCertificationDefinition(id: string) {
  return certificationCatalog.find((certification) => certification.id === id)
}
