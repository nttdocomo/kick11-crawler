INSERT INTO `player`(`name`,`date_of_birth`,`height`,`foot`) SELECT `full_name`,`date_of_birth`,`height`,`foot` FROM `transfermarket_player` WHERE player_ref_id = 0 AND CONCAT(`full_name`,'-',`date_of_birth`) NOT IN (SELECT CONCAT(`name`,'-',`date_of_birth`) FROM `player`)

#由于数据量太大导致执行太久，所以分批执行
UPDATE `transfermarket_player` JOIN `player` ON CONCAT(transfermarket_player.full_name,transfermarket_player.date_of_birth) = CONCAT(player.name,player.date_of_birth) SET transfermarket_player.player_ref_id = player.id WHERE transfermarket_player.player_ref_id = 0

UPDATE `transfermarket_player` JOIN (SELECT player.id,CONCAT(player.name,'-',player.date_of_birth) AS name_date_of_birth FROM (SELECT * FROM `transfermarket_player` WHERE player_ref_id = 0)`transfermarket_player` JOIN `player` ON CONCAT(transfermarket_player.full_name,'-',transfermarket_player.date_of_birth) = CONCAT(player.name,'-',player.date_of_birth))`player` ON CONCAT(transfermarket_player.full_name,'-',transfermarket_player.date_of_birth) = player.name_date_of_birth SET transfermarket_player.player_ref_id = player.id

#查找重复记录
SELECT id, date_of_birth, profile_uri, transfermarket_player.full_name FROM transfermarket_player
INNER JOIN (SELECT full_name FROM transfermarket_player
GROUP BY full_name HAVING count(id) > 1) dup ON transfermarket_player.full_name = dup.full_name
ORDER BY transfermarket_player.full_name