ALTER TABLE nation DROP COLUMN capital_city,DROP COLUMN nationality,DROP COLUMN short_name;
ALTER TABLE position DROP COLUMN side,DROP COLUMN score;
ALTER TABLE position CHANGE position_name name VARCHAR( 30 ) NOT NULL;
ALTER TABLE `player` DROP COLUMN `short_name`,DROP COLUMN `nation_id`,DROP COLUMN `left_foot`;
ALTER TABLE `player` CHANGE `right_foot` `foot` CHAR( 5 ) NOT NULL DEFAULT 'right';
ALTER TABLE `player` CHANGE `full_name` `name` VARCHAR( 60 ) NOT NULL;

ALTER TABLE `club` CHANGE `club_name` `name` VARCHAR( 40 ) NOT NULL;
ALTER TABLE `club` CHANGE `year_founded` `foundation` date;
ALTER TABLE `club` DROP COLUMN `nickname`;

ALTER TABLE  `team` CHANGE  `team_name`  `team_name` VARCHAR( 40 ) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL

TRUNCATE TABLE  `position`;

INSERT INTO nation(full_name) SELECT name FROM transfermarket_nation WHERE name NOT IN (SELECT full_name FROM nation);

UPDATE transfermarket_nation JOIN nation ON transfermarket_nation.name = nation.full_name SET transfermarket_nation.nation_ref_id = nation.id

INSERT INTO `position`(name) SELECT distinct position FROM transfermarket_player WHERE position != '' AND position NOT IN ('Torwart','Abwehr','Sturm','Mittelfeld');

INSERT INTO `player`(`name`,`date_of_birth`,`height`,`foot`) SELECT `full_name`,`date_of_birth`,`height`,`foot` FROM `transfermarkt_player` WHERE `full_name` NOT IN (SELECT `name` FROM `player`);

INSERT INTO `player2position`(`position_id`,`player_id`) SELECT positions.id,player.id FROM `positions` JOIN `transfermarkt_player` ON transfermarkt_player.position = positions.name JOIN `player` ON transfermarkt_player.full_name = player.name WHERE CONCAT(position.id, player.id) NOT IN (SELECT CONCAT(position_id, player_id) FROM `player2position`)

INSERT INTO `nation2player`(`nation_id`,`player_id`) SELECT nation.id,player.id FROM `nation` JOIN `transfermarkt_player` ON transfermarkt_player.nationality = nation.full_name JOIN `player` ON transfermarkt_player.full_name = player.name WHERE CONCAT(nation.id, player.id) NOT IN (SELECT CONCAT(nation_id, player_id) FROM `nation2player`)

INSERT INTO `club`(`name`) SELECT `club_name` FROM `transfermarkt_club` WHERE `club_name` NOT IN (SELECT `name` FROM `club`);

SELECT a.team_name FROM `transfermarkt_team` a JOIN `transfermarkt_team` b ON a.id = b.owner_id WHERE b.type = 2 AND b.team_name NOT IN (SELECT `name` FROM `club`);

INSERT INTO `team`(`team_name`,`owner_id`,`type`) SELECT transfermarkt_team.team_name,nation.id,transfermarkt_team.type FROM `transfermarkt_team` JOIN `transfermarkt_nation` ON transfermarkt_nation.nation_id = transfermarkt_team.nation_id JOIN `nation` ON nation.full_name = transfermarkt_nation.name WHERE transfermarkt_team.type = 1 AND transfermarkt_team.team_name NOT IN (SELECT `team_name` FROM `team`);

INSERT INTO `team`(`team_name`,`owner_id`,`type`) SELECT b.team_name,club.id,b.type FROM `club` JOIN `transfermarkt_team` a ON a.team_name = club.name JOIN `transfermarkt_team` b ON a.id = b.nation_id WHERE b.type = 2 AND b.team_name NOT IN (SELECT `team_name` FROM `team`);

#更新球队类型
UPDATE `team` JOIN `transfermarkt_team` ON team.id = transfermarkt_team.team_ref_id SET team.type = transfermarkt_team.type

INSERT INTO `competition_type`(`name`) SELECT `type_name` FROM `transfermarkt_competition_type`;

INSERT INTO `competition`(`name`,`type_id`,`nation_id`) SELECT transfermarkt_competition.competition_name,competition_type.id,nation.id FROM `transfermarkt_competition` JOIN `competition_type` ON competition_type.name = transfermarkt_competition.competition_type JOIN `nation` ON transfermarkt_competition.nation_name = nation.full_name AND transfermarkt_competition.competition_name NOT IN (SELECT `name` FROM `competition`);

SELECT positions.id, player.id form 

#按照id将transfermarkt_club的competition复制到transfermarkt_team
UPDATE `transfermarkt_team` JOIN `transfermarkt_club` ON transfermarkt_club.id = transfermarkt_team.id SET transfermarkt_team.competition = transfermarkt_club.competition

UPDATE `transfermarkt_player` JOIN `player` ON transfermarkt_player.full_name = player.name SET transfermarkt_player.player_ref_id = player.id


SELECT team.id AS team_id, player.id AS player_id FROM `team` JOIN `transfermarkt_team` ON (transfermarkt_team.team_ref_id = team.id) JOIN `transfermarket_team_player` ON (transfermarket_team_player.team_id = transfermarkt_team.id) JOIN `transfermarkt_player` ON (transfermarkt_player.id = transfermarket_team_player.player_id) JOIN `player` ON (player.id = transfermarkt_player.player_ref_id)

INSERT INTO `teamplayer`(`team_id`,`player_id`) SELECT team.id AS team_id, player.id AS player_id FROM `team` JOIN `transfermarkt_team` ON (transfermarkt_team.team_ref_id = team.id) JOIN `transfermarket_team_player` ON (transfermarket_team_player.team_id = transfermarkt_team.id) JOIN `transfermarkt_player` ON (transfermarkt_player.id = transfermarket_team_player.player_id) JOIN `player` ON (player.id = transfermarkt_player.player_ref_id) WHERE CONCAT(team.id, player.id) NOT IN (SELECT CONCAT(team_id, player_id) FROM `teamplayer`)

INSERT INTO `competitionteam`(`competition_id`,`team_id`) SELECT competition.id,team.id FROM `competition` JOIN `transfermarkt_team` ON (competition.name = transfermarkt_team.competition) JOIN `team` ON (team.id = transfermarkt_team.team_ref_id) WHERE transfermarkt_team.competition IS NOT NULL AND CONCAT(competition.id, team.id) NOT IN (SELECT CONCAT(competition_id, team_id) FROM `competitionteam`)

