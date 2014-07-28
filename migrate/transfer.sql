INSERT INTO transfer(taking_team_id,releasing_team_id,player_id,season,transfer_date,transfer_sum,contract_period,loan) SELECT taking_team.team_ref_id AS taking_team_id,releasing_team.team_ref_id AS releasing_team_id,transfermarket_player.player_ref_id AS player_id,transfermarket_transfer.season,transfermarket_transfer.transfer_date,transfermarket_transfer.transfer_sum,transfermarket_transfer.contract_period,transfermarket_transfer.loan FROM `transfermarket_team` taking_team 
JOIN `transfermarket_transfer` ON transfermarket_transfer.taking_team_id = taking_team.id 
JOIN `transfermarket_team` releasing_team ON transfermarket_transfer.releasing_team_id = releasing_team.id 
JOIN `transfermarket_player` ON transfermarket_transfer.player_id = transfermarket_player.id 
WHERE CONCAT(taking_team.team_ref_id,releasing_team.team_ref_id,transfermarket_player.player_ref_id,transfermarket_transfer.season) NOT IN (SELECT CONCAT(taking_team_id,releasing_team_id,player_id,season) FROM `transfer`)

#按照转会日期
UPDATE `transfermarket_transfer` JOIN `transfer` ON transfer.transfer_date = transfermarket_transfer.transfer_date JOIN `transfermarket_team` taking_team ON taking_team.id = transfermarket_transfer.taking_team_id AND taking_team.team_ref_id = transfer.taking_team_id JOIN `transfermarket_team` releasing_team ON releasing_team.id = transfermarket_transfer.releasing_team_id AND releasing_team.team_ref_id = transfer.releasing_team_id JOIN `transfermarket_player` ON transfermarket_player.id = transfermarket_transfer.player_id AND transfermarket_player.player_ref_id = transfer.player_id SET transfermarket_transfer.transfer_ref_id = transfer.id WHERE transfermarket_transfer.transfer_ref_id = 0


SELECT * FROM (SELECT taking_team_id,player_id,transfer_date FROM (SELECT * FROM `transfer` ORDER BY transfer_date DESC)`temp` GROUP BY player_id ORDER BY transfer_date DESC)`tmp` JOIN `player` ON tmp.player_id = player.id WHERE tmp.taking_team_id = 1