import { expect, test } from 'bun:test'
import { CertificationCatalogResponseSchema } from '@cert-prep/contracts/certification-contracts'
import { certificationCatalog } from '../apps/api/src/catalog/certifications'

test('catalog registers six unique certifications with official exam, certification and learning URLs', () => {
  const catalog = CertificationCatalogResponseSchema.parse({ certifications: certificationCatalog }).certifications

  expect(catalog.map(({ id }) => id)).toEqual([
    'gcp-professional-cloud-developer',
    'gcp-professional-cloud-architect',
    'gcp-professional-cloud-database-engineer',
    'gcp-professional-data-engineer',
    'gcp-professional-cloud-devops-engineer',
    'azure-ai-fundamentals',
  ])
  expect(new Set(catalog.map(({ id }) => id)).size).toBe(6)
  for (const certification of catalog) {
    const sourceKinds = certification.sources.map(({ kind }) => kind)
    expect(sourceKinds).toContain('certification')
    expect(sourceKinds).toContain('exam-guide')
    expect(sourceKinds).toContain('learning-path')
    expect(certification.sources.every(({ url }) => new URL(url).protocol === 'https:')).toBe(true)
  }
})
