INSERT INTO `tables`(`event_id`,`team_id`) SELECT event_id, team_id FROM `events_teams` WHERE CONCAT(event_id,'-',team_id) NOT IN (SELECT CONCAT(event_id,'-',team_id) FROM `tables`)

CREATE TABLE IF NOT EXISTS `rounds` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `event_id` int(10) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  `pos` int(10) unsigned NOT NULL,
  `start_at` date NOT NULL,
  `end_at` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=117 ;