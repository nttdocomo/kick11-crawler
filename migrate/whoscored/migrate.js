var excute = require('../../excute'),
insert_whoscored_player_player = function(callback){
	excute('INSERT INTO `whoscored_player_player`(`whoscored_player_id`,`player_id`) SELECT whoscored_player_not_in_whoscored_player_player.id,player.id FROM (SELECT * FROM `whoscored_player` WHERE id NOT IN (SELECT whoscored_player_id FROM `whoscored_player_player`))`whoscored_player_not_in_whoscored_player_player` JOIN `player` ON player.name = whoscored_player_not_in_whoscored_player_player.name',callback)
},
insert_whoscored_team_team = function(callback){
	excute('INSERT INTO `whoscored_team_team`(`whoscored_team_id`,`team_id`) SELECT whoscored_team_not_in_whoscored_team_team.id,whoscored_team_not_in_whoscored_team_team.name,team.team_name,team.id FROM (SELECT * FROM `whoscored_teams` WHERE id NOT IN (SELECT whoscored_team_id FROM `whoscored_team_team`))`whoscored_team_not_in_whoscored_team_team` JOIN `team` ON team.team_name = whoscored_team_not_in_whoscored_team_team.name',callback)
},
insert_whoscored_match_match = function(callback){
	excute('INSERT INTO `whoscored_match_match`(`whoscored_match_id`,`match_id`) SELECT whoscored_match.id,matchs.id FROM (SELECT whoscored_matches_not_in_whoscored_match_match.id,team1.team_id AS team1_id,team2.team_id AS team2_id,whoscored_matches_not_in_whoscored_match_match.play_at,whoscored_matches_not_in_whoscored_match_match.score1,whoscored_matches_not_in_whoscored_match_match.score2 FROM (SELECT * FROM `whoscored_matches` WHERE id NOT IN (SELECT whoscored_match_id FROM `whoscored_match_match`))`whoscored_matches_not_in_whoscored_match_match` 
JOIN `whoscored_team_team` AS `team1` ON team1.whoscored_team_id = whoscored_matches_not_in_whoscored_match_match.team1_id 
JOIN `whoscored_team_team` AS `team2` ON team2.whoscored_team_id = whoscored_matches_not_in_whoscored_match_match.team2_id)`whoscored_match` 
JOIN `matchs` ON (whoscored_match.team1_id = matchs.team1_id AND whoscored_match.team2_id = matchs.team2_id AND whoscored_match.play_at = matchs.play_at)',callback)
},
insert_whoscored_event = function(callback){
	var match_events = {};
	excute('SELECT * FROM `whoscored_match_events`',function(whoscored_match_events){
		if(whoscored_match_events.length){
			whoscored_match_events.forEach(function(whoscored_match_event){
				excute(mysql.format('SELECT match_id FROM `whoscored_match_match` WHERE whoscored_match_id = ?',[whoscored_match_event.match_id]),function(whoscored_match_match){
					if(whoscored_match_match.length){
						match_events.match_id = whoscored_match_match.match_id
					}
				})
				excute(mysql.format('SELECT player_id FROM `whoscored_player_player` WHERE whoscored_player_id = ?',[whoscored_match_event.player_id]),function(whoscored_player_player){
					if(whoscored_player_player.length){
						match_events.player_id = whoscored_player_player.player_id
					}
				})
				excute(mysql.format('SELECT team_id FROM `whoscored_team_team` WHERE whoscored_team_id = ?',[whoscored_match_event.team_id]),function(whoscored_team_team){
					if(whoscored_team_team.length){
						match_events.team_id = whoscored_team_team.team_id
					}
				})
			})
		}
	})
},
migrate = function(){
	insert_whoscored_player_player(function(){
		insert_whoscored_team_team()
	})
}
//SELECT whoscored_player_not_in_whoscored_player_player.id,player.id FROM (SELECT * FROM `whoscored_player` WHERE id NOT IN (SELECT whoscored_player_id FROM `whoscored_player_player`))`whoscored_player_not_in_whoscored_player_player` 
//JOIN `player` ON player.name = whoscored_player_not_in_whoscored_player_player.name
excute('SELECT * FROM whoscored_matches WHERE id NOT IN (SELECT whoscored_match_id FROM whoscored_match_match)',function(rows){
	rows.forEach(function(row){
		excute('SELECT * FROM whoscored_matches WHERE id NOT IN (SELECT whoscored_match_id FROM whoscored_match_match)')
	})
})
//SELECT whoscored_matches_not_in_whoscored_match_match.*,whoscored_team_team.team_id FROM (SELECT * FROM `whoscored_matches` WHERE id NOT IN (SELECT whoscored_match_id FROM `whoscored_match_match`))`whoscored_matches_not_in_whoscored_match_match` JOIN `whoscored_team_team` ON whoscored_team_team.whoscored_team_id = whoscored_matches_not_in_whoscored_match_match.team1_id

/*INSERT INTO `whoscored_match_match`(`whoscored_match_id`,`match_id`) SELECT whoscored_match.id,matchs.id FROM (SELECT whoscored_matches_not_in_whoscored_match_match.id,team1.team_id AS team1_id,team2.team_id AS team2_id,whoscored_matches_not_in_whoscored_match_match.play_at,whoscored_matches_not_in_whoscored_match_match.score1,whoscored_matches_not_in_whoscored_match_match.score2 FROM (SELECT * FROM `whoscored_matches` WHERE id NOT IN (SELECT whoscored_match_id FROM `whoscored_match_match`))`whoscored_matches_not_in_whoscored_match_match` 
JOIN `whoscored_team_team` AS `team1` ON team1.whoscored_team_id = whoscored_matches_not_in_whoscored_match_match.team1_id 
JOIN `whoscored_team_team` AS `team2` ON team2.whoscored_team_id = whoscored_matches_not_in_whoscored_match_match.team2_id)`whoscored_match` 
JOIN `matchs` ON (whoscored_match.team1_id = matchs.team1_id AND whoscored_match.team2_id = matchs.team2_id AND whoscored_match.play_at = matchs.play_at)*/
module.exports = migrate;