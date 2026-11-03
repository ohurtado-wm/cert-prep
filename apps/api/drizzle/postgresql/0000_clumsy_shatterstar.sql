CREATE TYPE "public"."simulation_language" AS ENUM('es', 'en');--> statement-breakpoint
CREATE TYPE "public"."simulation_mode" AS ENUM('practice', 'real');--> statement-breakpoint
CREATE TYPE "public"."simulation_start_status" AS ENUM('started', 'succeeded', 'failed');--> statement-breakpoint
CREATE TYPE "public"."simulation_status" AS ENUM('active', 'completed');--> statement-breakpoint
CREATE TABLE "certification_guides" (
	"certification_id" text PRIMARY KEY NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"domains" jsonb NOT NULL,
	"study_path" jsonb NOT NULL,
	"source_hash" text,
	"source_snapshot" jsonb,
	"ai_usage" jsonb,
	"last_source_checked_at" timestamp with time zone,
	"last_ai_refreshed_at" timestamp with time zone,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certifications" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"exam_code" text,
	"source_url" text NOT NULL,
	"certification_url" text DEFAULT '' NOT NULL,
	"learning_path_url" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guide_refresh_leases" (
	"certification_id" text PRIMARY KEY NOT NULL,
	"lease_token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "simulation_generation_leases" (
	"gateway_user_id" text PRIMARY KEY NOT NULL,
	"lease_token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "simulation_results" (
	"id" text PRIMARY KEY NOT NULL,
	"gateway_user_id" text NOT NULL,
	"certification_id" text NOT NULL,
	"mode" "simulation_mode" NOT NULL,
	"guide_version" integer DEFAULT 1 NOT NULL,
	"language" "simulation_language" DEFAULT 'es' NOT NULL,
	"score" integer NOT NULL,
	"total_questions" integer NOT NULL,
	"correct_answers" integer NOT NULL,
	"correct_after_retry" integer DEFAULT 0 NOT NULL,
	"answers_revealed" integer DEFAULT 0 NOT NULL,
	"incorrect_answers" integer DEFAULT 0 NOT NULL,
	"domain_breakdown" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"topic_breakdown" jsonb NOT NULL,
	"focus_breakdown" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"completed_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "simulation_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"gateway_user_id" text NOT NULL,
	"certification_id" text NOT NULL,
	"mode" "simulation_mode" NOT NULL,
	"guide_version" integer DEFAULT 1 NOT NULL,
	"status" "simulation_status" DEFAULT 'active' NOT NULL,
	"state" jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "simulation_start_events" (
	"id" text PRIMARY KEY NOT NULL,
	"gateway_user_id" text NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"status" "simulation_start_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"gateway_user_id" text NOT NULL,
	"certification_id" text NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"gateway_user_id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "certification_guides" ADD CONSTRAINT "certification_guides_certification_id_certifications_id_fk" FOREIGN KEY ("certification_id") REFERENCES "public"."certifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_refresh_leases" ADD CONSTRAINT "guide_refresh_leases_certification_id_certifications_id_fk" FOREIGN KEY ("certification_id") REFERENCES "public"."certifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_generation_leases" ADD CONSTRAINT "simulation_generation_leases_gateway_user_id_users_gateway_user_id_fk" FOREIGN KEY ("gateway_user_id") REFERENCES "public"."users"("gateway_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_results" ADD CONSTRAINT "simulation_results_gateway_user_id_users_gateway_user_id_fk" FOREIGN KEY ("gateway_user_id") REFERENCES "public"."users"("gateway_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_results" ADD CONSTRAINT "simulation_results_certification_id_certifications_id_fk" FOREIGN KEY ("certification_id") REFERENCES "public"."certifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_sessions" ADD CONSTRAINT "simulation_sessions_gateway_user_id_users_gateway_user_id_fk" FOREIGN KEY ("gateway_user_id") REFERENCES "public"."users"("gateway_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_sessions" ADD CONSTRAINT "simulation_sessions_certification_id_certifications_id_fk" FOREIGN KEY ("certification_id") REFERENCES "public"."certifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulation_start_events" ADD CONSTRAINT "simulation_start_events_gateway_user_id_users_gateway_user_id_fk" FOREIGN KEY ("gateway_user_id") REFERENCES "public"."users"("gateway_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_plans" ADD CONSTRAINT "study_plans_gateway_user_id_users_gateway_user_id_fk" FOREIGN KEY ("gateway_user_id") REFERENCES "public"."users"("gateway_user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_plans" ADD CONSTRAINT "study_plans_certification_id_certifications_id_fk" FOREIGN KEY ("certification_id") REFERENCES "public"."certifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "guide_refresh_leases_expires_at_idx" ON "guide_refresh_leases" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "simulation_generation_leases_expires_at_idx" ON "simulation_generation_leases" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "simulation_results_owner_completed_idx" ON "simulation_results" USING btree ("gateway_user_id","completed_at");--> statement-breakpoint
CREATE INDEX "simulation_results_owner_cert_completed_idx" ON "simulation_results" USING btree ("gateway_user_id","certification_id","completed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "simulation_sessions_one_active_per_user" ON "simulation_sessions" USING btree ("gateway_user_id") WHERE "simulation_sessions"."status" = 'active';--> statement-breakpoint
CREATE INDEX "simulation_sessions_owner_status_expires_idx" ON "simulation_sessions" USING btree ("gateway_user_id","status","expires_at");--> statement-breakpoint
CREATE INDEX "simulation_start_events_owner_started_idx" ON "simulation_start_events" USING btree ("gateway_user_id","started_at");--> statement-breakpoint
CREATE INDEX "study_plans_owner_cert_created_idx" ON "study_plans" USING btree ("gateway_user_id","certification_id","created_at");