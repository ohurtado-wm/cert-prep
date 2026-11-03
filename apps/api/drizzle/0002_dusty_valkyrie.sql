ALTER TABLE `certification_guides` ADD `source_snapshot` text;--> statement-breakpoint
ALTER TABLE `certifications` ADD `certification_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `certifications` ADD `learning_path_url` text DEFAULT '' NOT NULL;