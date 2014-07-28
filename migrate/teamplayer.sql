INSERT INTO `teamplayer`(`team_id`,`player_id`) SELECT transfermarket_team.team_ref_id,transfermarket_player.player_ref_id FROM `transfermarket_team` JOIN `transfermarket_team_player` ON (transfermarket_team_player.team_id = transfermarket_team.id) JOIN `transfermarket_player` ON (transfermarket_player.id = transfermarket_team_player.player_id) WHERE CONCAT(transfermarket_team.team_ref_id,transfermarket_player.player_ref_id) NOT IN (SELECT CONCAT(team_id, player_id) FROM `teamplayer`) AND transfermarket_player.player_ref_id != 0 AND transfermarket_team.team_ref_id != 0

#根据transfer插入teamplayer
INSERT INTO `teamplayer`(`team_id`,`player_id`,`date`) SELECT taking_team_id,player_id,transfer_date FROM `transfer`

SELECT team.id,player.id FROM `team` JOIN `transfermarkt_team` ON team.id = transfermarkt_team.team_ref_id JOIN `transfermarket_team_player` ON transfermarkt_team.id = transfermarket_team_player.team_id JOIN `transfermarkt_player` ON transfermarkt_player.id = transfermarket_team_player.player_id JOIN `player` ON transfermarkt_player.player_ref_id = player.id

#根据transfer获得球队当前阵容
SELECT player.* FROM (SELECT taking_team_id,player_id,transfer_date FROM (SELECT * FROM `transfer` ORDER BY transfer_date DESC)`temp` GROUP BY player_id ORDER BY transfer_date DESC)`temp1` JOIN `player` ON temp1.player_id = player.id WHERE temp1.taking_team_id = 3