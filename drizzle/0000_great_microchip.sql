CREATE TABLE `certification_guides` (
	`certification_id` text PRIMARY KEY NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`domains` text NOT NULL,
	`studyPath` text NOT NULL,
	`source_hash` text,
	`last_source_checked_at` integer,
	`last_ai_refreshed_at` integer,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`certification_id`) REFERENCES `certifications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `certifications` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`exam_code` text,
	`source_url` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `guide_refresh_leases` (
	`certification_id` text PRIMARY KEY NOT NULL,
	`lease_token` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`certification_id`) REFERENCES `certifications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `simulation_results` (
	`id` text PRIMARY KEY NOT NULL,
	`gateway_user_id` text NOT NULL,
	`certification_id` text NOT NULL,
	`mode` text NOT NULL,
	`score` integer NOT NULL,
	`total_questions` integer NOT NULL,
	`correct_answers` integer NOT NULL,
	`topicBreakdown` text NOT NULL,
	`completed_at` integer NOT NULL,
	FOREIGN KEY (`gateway_user_id`) REFERENCES `users`(`gateway_user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`certification_id`) REFERENCES `certifications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `simulation_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`gateway_user_id` text NOT NULL,
	`certification_id` text NOT NULL,
	`mode` text NOT NULL,
	`state` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`gateway_user_id`) REFERENCES `users`(`gateway_user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`certification_id`) REFERENCES `certifications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `study_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`gateway_user_id` text NOT NULL,
	`certification_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`gateway_user_id`) REFERENCES `users`(`gateway_user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`certification_id`) REFERENCES `certifications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`gateway_user_id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
