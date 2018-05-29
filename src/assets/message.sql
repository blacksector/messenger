DROP TABLE IF EXISTS `threads`;
CREATE TABLE IF NOT EXISTS `threads` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
	`thread_id`	INTEGER,
	`tag`	TEXT
);
DROP TABLE IF EXISTS `inbox`;
CREATE TABLE IF NOT EXISTS `inbox` (
	`id`	INTEGER NOT NULL UNIQUE,
	`thread_id`	INTEGER,
	`address`	TEXT,
	`date`	INTEGER,
	`date_sent`	INTEGER,
	`read`	INTEGER,
	`status`	INTEGER,
	`type`	INTEGER,
	`body`	TEXT,
	`locked`	INTEGER,
	`error_code`	INTEGER,
	`sub_id`	INTEGER,
	`seen`	INTEGER,
	PRIMARY KEY(`id`)
);
COMMIT;
