INSERT INTO `team`(`team_name`,`owner_id`,`type`) SELECT transfermarkt_team.team_name,nation.id,transfermarkt_team.type FROM `transfermarkt_team` JOIN `transfermarkt_nation` ON transfermarkt_nation.nation_id = transfermarkt_team.nation_id JOIN `nation` ON nation.full_name = transfermarkt_nation.name WHERE transfermarkt_team.type = 1 AND transfermarkt_team.team_name NOT IN (SELECT `team_name` FROM `team`);

INSERT INTO `team`(`team_name`,`owner_id`,`type`) SELECT transfermarket_team.team_name,club.id,transfermarket_team.type FROM `club` JOIN `transfermarket_club` ON transfermarket_club.club_ref_id = club.id JOIN `transfermarket_team` ON transfermarket_team.owner_id = transfermarket_club.id WHERE transfermarket_team.type = 2 AND transfermarket_team.team_name NOT IN (SELECT `team_name` FROM `team`) #The same as blow

INSERT INTO `team`(`team_name`,`owner_id`,`type`) SELECT original_team.team_name,club.id,original_team.type FROM (SELECT * FROM `transfermarket_team` WHERE type = 2 AND team_name NOT IN (SELECT `team_name` FROM `team`))`original_team` JOIN `transfermarket_club` ON original_team.owner_id = transfermarket_club.id JOIN `club` ON transfermarket_club.club_ref_id = club.id



UPDATE `team` JOIN `transfermarkt_team` ON transfermarkt_team.team_name = team.team_name JOIN `transfermarkt_club` ON transfermarkt_team.owner_id = transfermarkt_club.id JOIN `club` ON club.id = transfermarkt_club.club_ref_id SET team.owner_id = club.id WHERE team.type = 2

UPDATE `transfermarket_team` JOIN `team` ON transfermarket_team.team_name = team.team_name SET transfermarket_team.team_ref_id = team.id WHERE transfermarket_team.team_ref_id = 0