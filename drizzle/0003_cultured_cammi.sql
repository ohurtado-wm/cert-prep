ALTER TABLE `simulation_results` ADD `guide_version` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `simulation_results` ADD `language` text DEFAULT 'es' NOT NULL;--> statement-breakpoint
ALTER TABLE `simulation_results` ADD `correct_after_retry` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `simulation_results` ADD `answers_revealed` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `simulation_results` ADD `incorrect_answers` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `simulation_results` ADD `domain_breakdown` text DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE `simulation_results` ADD `focus_breakdown` text DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE `simulation_sessions` ADD `guide_version` integer DEFAULT 1 NOT NULL;