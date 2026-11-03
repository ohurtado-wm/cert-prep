CREATE TABLE `simulation_start_events` (
	`id` text PRIMARY KEY NOT NULL,
	`gateway_user_id` text NOT NULL,
	`started_at` integer NOT NULL,
	FOREIGN KEY (`gateway_user_id`) REFERENCES `users`(`gateway_user_id`) ON UPDATE no action ON DELETE no action
);
