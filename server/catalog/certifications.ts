import type { CertificationCatalogItem } from '../../src/api/certification-contracts'

export const certificationCatalog: CertificationCatalogItem[] = [
  {
    id: 'gcp-professional-cloud-developer',
    provider: 'google-cloud',
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
    provider: 'google-cloud',
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
    provider: 'google-cloud',
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
    provider: 'google-cloud',
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
    provider: 'google-cloud',
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
  {
    id: 'azure-ai-fundamentals',
    provider: 'microsoft-azure',
    name: {
      en: 'Azure AI Fundamentals',
      es: 'Fundamentos de IA de Azure',
    },
    examCode: 'AI-901',
    sources: [
      {
        kind: 'exam-guide',
        title: 'AI-901 study guide',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-901',
      },
      {
        kind: 'exam-details',
        title: 'AI-901 exam details',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/',
      },
      {
        kind: 'certification',
        title: 'Azure AI Fundamentals certification',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/',
      },
      {
        kind: 'learning-path',
        title: 'Get started with AI applications and agents on Azure',
        url: 'https://learn.microsoft.com/en-us/training/paths/get-started-ai-apps-agents/',
      },
      {
        kind: 'learning-path',
        title: 'AI concepts for developers and technology professionals',
        url: 'https://learn.microsoft.com/en-us/training/paths/ai-concepts/',
      },
    ],
  },
]

export function getCertificationDefinition(id: string) {
  return certificationCatalog.find((certification) => certification.id === id)
}
