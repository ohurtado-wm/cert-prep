import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import type { GuideDomain, StudyPathStep } from '../../src/api/certification-contracts'
import type { AiTokenUsage } from '../../src/api/ai-usage-contracts'
import type { CachedOfficialSources } from '../catalog/source-types'
import type { StoredSimulationState } from '../simulations/state'

const jsonText = <T>(name: string) => text(name, { mode: 'json' }).$type<T>()

export const users = sqliteTable('users', {
  gatewayUserId: text('gateway_user_id').primaryKey(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
})

export const certifications = sqliteTable('certifications', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  examCode: text('exam_code'),
  sourceUrl: text('source_url').notNull(),
  certificationUrl: text('certification_url').notNull().default(''),
  learningPathUrl: text('learning_path_url').notNull().default(''),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
})

export const certificationGuides = sqliteTable('certification_guides', {
  certificationId: text('certification_id').primaryKey().references(() => certifications.id),
  version: integer('version').notNull().default(1),
  domains: jsonText<GuideDomain[]>('domains').notNull(),
  studyPath: jsonText<StudyPathStep[]>('study_path').notNull(),
  sourceHash: text('source_hash'),
  sourceSnapshot: jsonText<CachedOfficialSources>('source_snapshot'),
  aiUsage: jsonText<AiTokenUsage | null>('ai_usage'),
  lastSourceCheckedAt: integer('last_source_checked_at', { mode: 'timestamp_ms' }),
  lastAiRefreshedAt: integer('last_ai_refreshed_at', { mode: 'timestamp_ms' }),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
})

export const guideRefreshLeases = sqliteTable('guide_refresh_leases', {
  certificationId: text('certification_id').primaryKey().references(() => certifications.id),
  leaseToken: text('lease_token').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
})

export const simulationSessions = sqliteTable('simulation_sessions', {
  id: text('id').primaryKey(),
  gatewayUserId: text('gateway_user_id').notNull().references(() => users.gatewayUserId),
  certificationId: text('certification_id').notNull().references(() => certifications.id),
  mode: text('mode', { enum: ['practice', 'real'] }).notNull(),
  guideVersion: integer('guide_version').notNull().default(1),
  status: text('status', { enum: ['active', 'completed'] }).notNull().default('active'),
  state: jsonText<StoredSimulationState>('state').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }),
}, (table) => [
  uniqueIndex('simulation_sessions_one_active_per_user').on(table.gatewayUserId).where(sql`${table.status} = 'active'`),
])

export const simulationStartEvents = sqliteTable('simulation_start_events', {
  id: text('id').primaryKey(),
  gatewayUserId: text('gateway_user_id').notNull().references(() => users.gatewayUserId),
  startedAt: integer('started_at', { mode: 'timestamp_ms' }).notNull(),
})

export const simulationResults = sqliteTable('simulation_results', {
  id: text('id').primaryKey(),
  gatewayUserId: text('gateway_user_id').notNull().references(() => users.gatewayUserId),
  certificationId: text('certification_id').notNull().references(() => certifications.id),
  mode: text('mode', { enum: ['practice', 'real'] }).notNull(),
  guideVersion: integer('guide_version').notNull().default(1),
  language: text('language', { enum: ['es', 'en'] }).notNull().default('es'),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  correctAnswers: integer('correct_answers').notNull(),
  correctAfterRetry: integer('correct_after_retry').notNull().default(0),
  answersRevealed: integer('answers_revealed').notNull().default(0),
  incorrectAnswers: integer('incorrect_answers').notNull().default(0),
  domainBreakdown: jsonText<Record<string, { correct: number; total: number }>>('domain_breakdown').notNull().default({}),
  topicBreakdown: jsonText<Record<string, { correct: number; total: number }>>('topic_breakdown').notNull(),
  focusBreakdown: jsonText<Record<string, { correct: number; total: number }>>('focus_breakdown').notNull().default({}),
  completedAt: integer('completed_at', { mode: 'timestamp_ms' }).notNull(),
})

export const studyPlans = sqliteTable('study_plans', {
  id: text('id').primaryKey(),
  gatewayUserId: text('gateway_user_id').notNull().references(() => users.gatewayUserId),
  certificationId: text('certification_id').notNull().references(() => certifications.id),
  content: jsonText<Record<string, unknown>>('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
})
