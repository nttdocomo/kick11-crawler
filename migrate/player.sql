INSERT INTO `player`(`name`,`date_of_birth`,`height`,`foot`) SELECT `full_name`,`date_of_birth`,`height`,`foot` FROM `transfermarket_player` WHERE CONCAT(`full_name`,`date_of_birth`) NOT IN (SELECT CONCAT(`name`,`date_of_birth`) FROM `player`);

#由于数据量太大导致执行太久，所以分批执行
UPDATE `transfermarket_player` JOIN `player` ON CONCAT(transfermarket_player.full_name,transfermarket_player.date_of_birth) = CONCAT(player.name,player.date_of_birth) SET transfermarket_player.player_ref_id = player.id WHERE transfermarket_player.player_ref_id = 0