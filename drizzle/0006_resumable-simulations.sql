DELETE FROM `simulation_sessions`
WHERE `expires_at` <= CAST(strftime('%s', 'now') AS INTEGER) * 1000;
--> statement-breakpoint
CREATE TABLE `simulation_sessions_new` (
	`id` text PRIMARY KEY NOT NULL,
	`gateway_user_id` text NOT NULL,
	`certification_id` text NOT NULL,
	`mode` text NOT NULL,
	`guide_version` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`state` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer,
	FOREIGN KEY (`gateway_user_id`) REFERENCES `users`(`gateway_user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`certification_id`) REFERENCES `certifications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `simulation_sessions_new` (
	`id`, `gateway_user_id`, `certification_id`, `mode`, `guide_version`, `status`, `state`, `created_at`, `expires_at`
)
SELECT
	`id`, `gateway_user_id`, `certification_id`, `mode`, `guide_version`,
	CASE WHEN json_extract(`state`, '$.status') = 'completed' THEN 'completed' ELSE 'active' END,
	`state`, `created_at`, CASE WHEN json_extract(`state`, '$.status') = 'completed' THEN `expires_at` ELSE NULL END
FROM `simulation_sessions`;
--> statement-breakpoint
DELETE FROM `simulation_sessions_new`
WHERE `status` = 'active' AND `id` IN (
	SELECT `id` FROM (
		SELECT `id`, ROW_NUMBER() OVER (
			PARTITION BY `gateway_user_id` ORDER BY `created_at` DESC, `id` DESC
		) AS `position`
		FROM `simulation_sessions_new`
		WHERE `status` = 'active'
	) WHERE `position` > 1
);
--> statement-breakpoint
DROP TABLE `simulation_sessions`;
--> statement-breakpoint
ALTER TABLE `simulation_sessions_new` RENAME TO `simulation_sessions`;
--> statement-breakpoint
CREATE UNIQUE INDEX `simulation_sessions_one_active_per_user`
	ON `simulation_sessions` (`gateway_user_id`) WHERE `status` = 'active';
