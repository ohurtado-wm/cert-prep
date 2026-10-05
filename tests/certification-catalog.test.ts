import { expect, test } from 'bun:test'
import { CertificationCatalogResponseSchema } from '../src/api/certification-contracts'
import { certificationCatalog } from '../server/catalog/certifications'

test('catalog registers five unique certifications with official exam, certification and learning URLs', () => {
  const catalog = CertificationCatalogResponseSchema.parse({ certifications: certificationCatalog }).certifications

  expect(catalog.map(({ id }) => id)).toEqual([
    'gcp-professional-cloud-developer',
    'gcp-professional-cloud-architect',
    'gcp-professional-cloud-database-engineer',
    'gcp-professional-data-engineer',
    'gcp-professional-cloud-devops-engineer',
  ])
  expect(new Set(catalog.map(({ id }) => id)).size).toBe(5)
  for (const certification of catalog) {
    expect(certification.sources.map(({ kind }) => kind).sort()).toEqual(['certification', 'exam-guide', 'learning-path'])
    expect(certification.sources.every(({ url }) => new URL(url).protocol === 'https:')).toBe(true)
  }
})
