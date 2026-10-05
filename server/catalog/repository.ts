import { and, eq, gte, lte } from 'drizzle-orm'
import type { DatabaseHandle } from '../db/client'
import { certificationGuides, certifications, guideRefreshLeases } from '../db/schema'
import type { CertificationCatalogItem, GuideDomain, StudyPathStep } from '../../src/api/certification-contracts'
import type { AiTokenUsage } from '../../src/api/ai-usage-contracts'

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value).sort(([left], [right]) => left.localeCompare(right))
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`).join(',')}}`
  }
  const serialized = JSON.stringify(value)
  if (serialized === undefined) throw new Error('Guide data must be JSON serializable.')
  return serialized
}

export async function syncCertificationCatalog(
  db: DatabaseHandle,
  catalog: CertificationCatalogItem[],
  now: Date,
) {
  for (const item of catalog) {
    const examGuide = item.sources.find((source) => source.kind === 'exam-guide')
    const certificationPage = item.sources.find((source) => source.kind === 'certification')
    const learningPath = item.sources.find((source) => source.kind === 'learning-path')
    if (!examGuide || !certificationPage || !learningPath) {
      throw new Error(`Certification ${item.id} is missing an official source.`)
    }

    await db.insert(certifications).values({
      id: item.id,
      name: item.name.en,
      examCode: item.examCode,
      sourceUrl: examGuide.url,
      certificationUrl: certificationPage.url,
      learningPathUrl: learningPath.url,
      createdAt: now,
      updatedAt: now,
    }).onConflictDoUpdate({
      target: certifications.id,
      set: {
        name: item.name.en,
        examCode: item.examCode,
        sourceUrl: examGuide.url,
        certificationUrl: certificationPage.url,
        learningPathUrl: learningPath.url,
        updatedAt: now,
      },
    })
  }
}

export async function getCertificationGuide(db: DatabaseHandle, certificationId: string) {
  return db.query.certificationGuides.findFirst({
    where: eq(certificationGuides.certificationId, certificationId),
  })
}

export async function acquireRefreshLease(
  db: DatabaseHandle,
  certificationId: string,
  now: Date,
  expiresAt: Date,
  leaseToken: string,
) {
  const acquired = await db.insert(guideRefreshLeases).values({ certificationId, leaseToken, expiresAt })
    .onConflictDoUpdate({
      target: guideRefreshLeases.certificationId,
      set: { leaseToken, expiresAt },
      setWhere: lte(guideRefreshLeases.expiresAt, now),
    })
    .returning({ leaseToken: guideRefreshLeases.leaseToken })
  return acquired.some((lease) => lease.leaseToken === leaseToken)
}

export async function refreshLeaseIsActive(db: DatabaseHandle, certificationId: string, now: Date) {
  const lease = await db.query.guideRefreshLeases.findFirst({
    where: and(eq(guideRefreshLeases.certificationId, certificationId), gte(guideRefreshLeases.expiresAt, now)),
  })
  return lease !== undefined
}

export async function releaseRefreshLease(db: DatabaseHandle, certificationId: string, leaseToken: string) {
  await db.delete(guideRefreshLeases).where(and(
    eq(guideRefreshLeases.certificationId, certificationId),
    eq(guideRefreshLeases.leaseToken, leaseToken),
  ))
}

export async function publishGuide(
  db: DatabaseHandle,
  input: {
    certificationId: string
    domains: GuideDomain[]
    studyPath: StudyPathStep[]
    aiUsage?: AiTokenUsage | null
    now: Date
    leaseToken: string
  },
) {
  return db.transaction(async (transaction) => {
    const previous = await transaction.query.certificationGuides.findFirst({
      where: eq(certificationGuides.certificationId, input.certificationId),
    })
    const contentChanged = !previous
      || stableJson(previous.domains) !== stableJson(input.domains)
      || stableJson(previous.studyPath) !== stableJson(input.studyPath)
    const version = (previous?.version ?? 0) + (contentChanged ? 1 : 0)

    await transaction.insert(certificationGuides).values({
      certificationId: input.certificationId,
      version,
      domains: input.domains,
      studyPath: input.studyPath,
      aiUsage: input.aiUsage ?? null,
      sourceHash: null,
      sourceSnapshot: null,
      lastSourceCheckedAt: null,
      lastAiRefreshedAt: input.now,
      updatedAt: input.now,
    }).onConflictDoUpdate({
      target: certificationGuides.certificationId,
      set: {
        version,
        domains: input.domains,
        studyPath: input.studyPath,
        aiUsage: input.aiUsage ?? null,
        sourceHash: null,
        sourceSnapshot: null,
        lastSourceCheckedAt: null,
        lastAiRefreshedAt: input.now,
        updatedAt: input.now,
      },
    })

    await transaction.delete(guideRefreshLeases).where(and(
      eq(guideRefreshLeases.certificationId, input.certificationId),
      eq(guideRefreshLeases.leaseToken, input.leaseToken),
    ))
    return { version, contentChanged }
  })
}
