/**
 * @author nttdocomo
 */
var mysql = require('mysql'),
inserPlayerPosition  = require('./playerposition'),
excute  = require('../crawler/transfermarkt.co.uk/excute');
function insertTransferMarketClub(){
	var sql = "INSERT INTO `transfermarket_club`(`id`,`club_name`,`profile_uri`,`nation_id`) SELECT id, team_name, profile_uri, nation_id FROM `transfermarket_team` WHERE id = owner_id AND type = 2 AND id NOT IN (SELECT `id` FROM `transfermarket_club`)";
	excute(sql,insertClub);
}
function insertClub(){
	var sql = "INSERT INTO `club`(`name`,`nation_id`) SELECT transfermarket_club.club_name,transfermarket_nation.nation_ref_id FROM (SELECT * FROM `transfermarket_club` WHERE `club_ref_id` = 0)`transfermarket_club` JOIN `transfermarket_nation` ON transfermarket_club.nation_id = transfermarket_nation.id";
	excute(sql,updateTransferMarketClub);
}
function updateTransferMarketClub(){
	var sql = "UPDATE `transfermarket_club` JOIN `club` ON transfermarket_club.club_name = club.name SET transfermarket_club.club_ref_id = club.id WHERE transfermarket_club.club_ref_id = 0";
	excute(sql,inserTeam);
}
function inserTeam(){
	var sql = "INSERT INTO `team`(`team_name`,`owner_id`,`type`) SELECT original_team.team_name,club.id,original_team.type FROM (SELECT * FROM `transfermarket_team` WHERE type = 2 AND team_name NOT IN (SELECT `team_name` FROM `team`))`original_team` JOIN `transfermarket_club` ON original_team.owner_id = transfermarket_club.id JOIN `club` ON transfermarket_club.club_ref_id = club.id";
	excute(sql,updateTransfermarketTeam);
}
function updateTransfermarketTeam(){
	var sql = "UPDATE `transfermarket_team` JOIN `team` ON transfermarket_team.team_name = team.team_name SET transfermarket_team.team_ref_id = team.id WHERE transfermarket_team.team_ref_id = 0";
	excute(sql,inserPlayer);
}
function inserPlayer(){
	var sql = "INSERT INTO `player`(`name`,`date_of_birth`,`height`,`foot`) SELECT `full_name`,`date_of_birth`,`height`,`foot` FROM `transfermarket_player` WHERE player_ref_id = 0 AND CONCAT(`full_name`,'-',`date_of_birth`) NOT IN (SELECT CONCAT(`name`,'-',`date_of_birth`) FROM `player`)";
	excute(sql,updateTransfermarketPlayer);
}
function updateTransfermarketPlayer(){
	var sql = "UPDATE `transfermarket_player` JOIN (SELECT player.id,CONCAT(player.name,'-',player.date_of_birth) AS name_date_of_birth FROM (SELECT * FROM `transfermarket_player` WHERE player_ref_id = 0)`transfermarket_player` JOIN `player` ON CONCAT(transfermarket_player.full_name,'-',transfermarket_player.date_of_birth) = CONCAT(player.name,'-',player.date_of_birth))`player` ON CONCAT(transfermarket_player.full_name,'-',transfermarket_player.date_of_birth) = player.name_date_of_birth SET transfermarket_player.player_ref_id = player.id";
	excute(sql,inserNationPlayer);
}
function inserNationPlayer(){
	var sql = "INSERT INTO `nation2player`(nation_id,player_id) SELECT transfermarket_nation.nation_ref_id,transfermarket_player.player_ref_id FROM `transfermarket_nation` JOIN `transfermarket_player` ON transfermarket_player.nation_id = transfermarket_nation.id WHERE CONCAT(transfermarket_nation.nation_ref_id,transfermarket_player.player_ref_id) NOT IN (SELECT CONCAT(nation_id, player_id) FROM `nation2player`) AND transfermarket_nation.nation_ref_id != 0 AND transfermarket_player.player_ref_id != 0";
	excute(sql,inserPlayerPosition);
}
function inserPlayerPosition(){
	inserPlayerPosition();
	inserTransfer();
}
function inserTransfer(){
	var sql = "INSERT INTO transfer(taking_team_id,releasing_team_id,player_id,season,transfer_date,transfer_sum,contract_period,loan) SELECT taking_team.team_ref_id AS taking_team_id,releasing_team.team_ref_id AS releasing_team_id,transfermarket_player.player_ref_id AS player_id,transfermarket_transfer.season,transfermarket_transfer.transfer_date,transfermarket_transfer.transfer_sum,transfermarket_transfer.contract_period,transfermarket_transfer.loan FROM `transfermarket_team` taking_team JOIN (SELECT * FROM `transfermarket_transfer` WHERE transfer_ref_id = 0 AND taking_team_id IN (SELECT id FROM `transfermarket_team` WHERE team_ref_id != 0) AND releasing_team_id IN (SELECT id FROM `transfermarket_team` WHERE team_ref_id != 0))`transfermarket_transfer` ON transfermarket_transfer.taking_team_id = taking_team.id JOIN `transfermarket_team` releasing_team ON transfermarket_transfer.releasing_team_id = releasing_team.id JOIN `transfermarket_player` ON transfermarket_transfer.player_id = transfermarket_player.id WHERE CONCAT(taking_team.team_ref_id,'-',releasing_team.team_ref_id,'-',transfermarket_player.player_ref_id,'-',transfermarket_transfer.season) NOT IN (SELECT CONCAT(taking_team_id,'-',releasing_team_id,'-',player_id,'-',season) FROM `transfer`)";
	excute(sql,updateTransfer);
}
function updateTransfer(){
	var sql = "UPDATE `transfermarket_transfer` JOIN (SELECT transfermarket_transfer.id AS id,transfer.id AS transfer_id FROM (SELECT * FROM `transfermarket_transfer` WHERE transfer_ref_id = 0 AND taking_team_id IN (SELECT id FROM `transfermarket_team`) AND releasing_team_id IN (SELECT id FROM `transfermarket_team`))`transfermarket_transfer` JOIN `transfer` ON transfer.transfer_date = transfermarket_transfer.transfer_date JOIN `transfermarket_team` taking_team ON taking_team.id = transfermarket_transfer.taking_team_id AND taking_team.team_ref_id = transfer.taking_team_id JOIN `transfermarket_team` releasing_team ON releasing_team.id = transfermarket_transfer.releasing_team_id AND releasing_team.team_ref_id = transfer.releasing_team_id JOIN `transfermarket_player` ON transfermarket_player.id = transfermarket_transfer.player_id AND transfermarket_player.player_ref_id = transfer.player_id)`tmp` ON transfermarket_transfer.id = tmp.id SET transfermarket_transfer.transfer_ref_id = tmp.transfer_id";
	excute(sql,function(){});
}
insertTransferMarketClub()