BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `data` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`chapter`	INTEGER,
	`topic`	INTEGER,
	`status`	INTEGER,
	`sentence`	TEXT,
	`correct`	TEXT
);
INSERT INTO `data` VALUES (1,1,1,0,'My home is nearer the railway station.','nearer');
INSERT INTO `data` VALUES (2,1,1,0,'I were going to the gym','were');
INSERT INTO `data` VALUES (3,1,2,0,'We is Students.','is');
COMMIT;
