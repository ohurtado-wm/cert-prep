import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp as pgTimestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import type { GuideDomain, StudyPathStep } from '@cert-prep/contracts/certification-contracts'
import type { AiTokenUsage } from '@cert-prep/contracts/ai-usage-contracts'
import type { CachedGuideSources } from '../catalog/source-types'
import type { StoredSimulationState } from '../simulations/state'

const json = <T>(name: string) => jsonb(name).$type<T>()
const timestamp = (name: string) => pgTimestamp(name, { mode: 'date', withTimezone: true })

export const simulationMode = pgEnum('simulation_mode', ['practice', 'real'])
export const simulationStatus = pgEnum('simulation_status', ['active', 'completed'])
export const simulationStartStatus = pgEnum('simulation_start_status', ['started', 'succeeded', 'failed'])
export const simulationLanguage = pgEnum('simulation_language', ['es', 'en'])

export const users = pgTable('users', {
  gatewayUserId: text('gateway_user_id').primaryKey(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const certifications = pgTable('certifications', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  examCode: text('exam_code'),
  sourceUrl: text('source_url').notNull(),
  certificationUrl: text('certification_url').notNull().default(''),
  learningPathUrl: text('learning_path_url').notNull().default(''),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const certificationGuides = pgTable('certification_guides', {
  certificationId: text('certification_id').primaryKey().references(() => certifications.id),
  version: integer('version').notNull().default(1),
  domains: json<GuideDomain[]>('domains').notNull(),
  studyPath: json<StudyPathStep[]>('study_path').notNull(),
  sourceHash: text('source_hash'),
  sourceSnapshot: json<CachedGuideSources>('source_snapshot'),
  aiUsage: json<AiTokenUsage | null>('ai_usage'),
  lastSourceCheckedAt: timestamp('last_source_checked_at'),
  lastAiRefreshedAt: timestamp('last_ai_refreshed_at'),
  updatedAt: timestamp('updated_at').notNull(),
})

export const guideRefreshLeases = pgTable('guide_refresh_leases', {
  certificationId: text('certification_id').primaryKey().references(() => certifications.id),
  leaseToken: text('lease_token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
}, (table) => [
  index('guide_refresh_leases_expires_at_idx').on(table.expiresAt),
])

export const simulationSessions = pgTable('simulation_sessions', {
  id: text('id').primaryKey(),
  gatewayUserId: text('gateway_user_id').notNull().references(() => users.gatewayUserId),
  certificationId: text('certification_id').notNull().references(() => certifications.id),
  mode: simulationMode('mode').notNull(),
  guideVersion: integer('guide_version').notNull().default(1),
  status: simulationStatus('status').notNull().default('active'),
  state: json<StoredSimulationState>('state').notNull(),
  createdAt: timestamp('created_at').notNull(),
  expiresAt: timestamp('expires_at'),
}, (table) => [
  uniqueIndex('simulation_sessions_one_active_per_user').on(table.gatewayUserId)
    .where(sql`${table.status} = 'active'`),
  index('simulation_sessions_owner_status_expires_idx').on(table.gatewayUserId, table.status, table.expiresAt),
])

export const simulationStartEvents = pgTable('simulation_start_events', {
  id: text('id').primaryKey(),
  gatewayUserId: text('gateway_user_id').notNull().references(() => users.gatewayUserId),
  startedAt: timestamp('started_at').notNull(),
  status: simulationStartStatus('status').notNull(),
}, (table) => [
  index('simulation_start_events_owner_started_idx').on(table.gatewayUserId, table.startedAt),
])

export const simulationGenerationLeases = pgTable('simulation_generation_leases', {
  gatewayUserId: text('gateway_user_id').primaryKey().references(() => users.gatewayUserId),
  leaseToken: text('lease_token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
}, (table) => [
  index('simulation_generation_leases_expires_at_idx').on(table.expiresAt),
])

export const simulationResults = pgTable('simulation_results', {
  id: text('id').primaryKey(),
  gatewayUserId: text('gateway_user_id').notNull().references(() => users.gatewayUserId),
  certificationId: text('certification_id').notNull().references(() => certifications.id),
  mode: simulationMode('mode').notNull(),
  guideVersion: integer('guide_version').notNull().default(1),
  language: simulationLanguage('language').notNull().default('es'),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  correctAnswers: integer('correct_answers').notNull(),
  correctAfterRetry: integer('correct_after_retry').notNull().default(0),
  answersRevealed: integer('answers_revealed').notNull().default(0),
  incorrectAnswers: integer('incorrect_answers').notNull().default(0),
  domainBreakdown: json<Record<string, { correct: number; total: number }>>('domain_breakdown').notNull().default({}),
  topicBreakdown: json<Record<string, { correct: number; total: number }>>('topic_breakdown').notNull(),
  focusBreakdown: json<Record<string, { correct: number; total: number }>>('focus_breakdown').notNull().default({}),
  completedAt: timestamp('completed_at').notNull(),
}, (table) => [
  index('simulation_results_owner_completed_idx').on(table.gatewayUserId, table.completedAt),
  index('simulation_results_owner_cert_completed_idx').on(table.gatewayUserId, table.certificationId, table.completedAt),
])

export const studyPlans = pgTable('study_plans', {
  id: text('id').primaryKey(),
  gatewayUserId: text('gateway_user_id').notNull().references(() => users.gatewayUserId),
  certificationId: text('certification_id').notNull().references(() => certifications.id),
  content: json<Record<string, unknown>>('content').notNull(),
  createdAt: timestamp('created_at').notNull(),
}, (table) => [
  index('study_plans_owner_cert_created_idx').on(table.gatewayUserId, table.certificationId, table.createdAt),
])
