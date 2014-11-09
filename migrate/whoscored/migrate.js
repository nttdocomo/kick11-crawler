var excute = require('../../excute'),mysql = require('mysql'),
insert_whoscored_player_player = function(callback){
	excute('INSERT INTO `whoscored_player_player`(`whoscored_player_id`,`player_id`) SELECT whoscored_player_not_in_whoscored_player_player.id,player.id FROM (SELECT * FROM `whoscored_player` WHERE id NOT IN (SELECT whoscored_player_id FROM `whoscored_player_player`))`whoscored_player_not_in_whoscored_player_player` JOIN `player` ON player.name = whoscored_player_not_in_whoscored_player_player.name',callback)
},
insert_whoscored_team_team = function(callback){
	excute('INSERT INTO `whoscored_team_team`(`whoscored_team_id`,`team_id`) SELECT whoscored_team_not_in_whoscored_team_team.id,team.id FROM (SELECT * FROM `whoscored_teams` WHERE id NOT IN (SELECT whoscored_team_id FROM `whoscored_team_team`))`whoscored_team_not_in_whoscored_team_team` JOIN `team` ON team.team_name = whoscored_team_not_in_whoscored_team_team.name',callback)
},
insert_whoscored_match_match = function(callback){
	excute('INSERT INTO `whoscored_match_match`(`whoscored_match_id`,`match_id`) SELECT whoscored_match.id,matchs.id FROM (SELECT whoscored_matches_not_in_whoscored_match_match.id,team1.team_id AS team1_id,team2.team_id AS team2_id,whoscored_matches_not_in_whoscored_match_match.play_at,whoscored_matches_not_in_whoscored_match_match.score1,whoscored_matches_not_in_whoscored_match_match.score2 FROM (SELECT * FROM `whoscored_matches` WHERE id NOT IN (SELECT whoscored_match_id FROM `whoscored_match_match`))`whoscored_matches_not_in_whoscored_match_match` \
JOIN `whoscored_team_team` AS `team1` ON team1.whoscored_team_id = whoscored_matches_not_in_whoscored_match_match.team1_id \
JOIN `whoscored_team_team` AS `team2` ON team2.whoscored_team_id = whoscored_matches_not_in_whoscored_match_match.team2_id)`whoscored_match` \
JOIN `matchs` ON (whoscored_match.team1_id = matchs.team1_id AND whoscored_match.team2_id = matchs.team2_id AND whoscored_match.play_at = matchs.play_at)',callback)
},
select_whoscored_event = function(){
	var match_events = {};
	excute('SELECT * FROM `whoscored_match_events` WHERE id NOT IN (SELECT whoscored_event_id FROM `whoscored_event_event`) AND match_id IN (SELECT whoscored_match_id FROM `whoscored_match_match`)',function(whoscored_match_events){
		console.log(whoscored_match_events.length);
		if(whoscored_match_events.length){
			whoscored_match_events.forEach(function(whoscored_match_event){
				excute(mysql.format('SELECT match_id FROM `whoscored_match_match` WHERE whoscored_match_id = ?',[whoscored_match_event.match_id]),function(whoscored_match_match){
					if(whoscored_match_match.length){
						match_events.match_id = whoscored_match_match[0].match_id
						insert_match_events(match_events,whoscored_match_event)
					}
				})
				excute(mysql.format('SELECT player_id FROM `whoscored_player_player` WHERE whoscored_player_id = ?',[whoscored_match_event.player_id]),function(whoscored_player_player){
					if(whoscored_player_player.length){
						match_events.player_id = whoscored_player_player[0].player_id
						insert_match_events(match_events,whoscored_match_event)
					}
				})
				excute(mysql.format('SELECT team_id FROM `whoscored_team_team` WHERE whoscored_team_id = ?',[whoscored_match_event.team_id]),function(whoscored_team_team){
					if(whoscored_team_team.length){
						match_events.team_id = whoscored_team_team[0].team_id
						insert_match_events(match_events,whoscored_match_event)
					}
				})
			})
		}
	})
},
insert_whoscored_event_event = function(match_events_id,whoscored_match_event_id){
	excute(mysql.format('INSERT INTO `whoscored_event_event` SET ?',{
		whoscored_event_id:whoscored_match_event_id,
		event_id:match_events_id
	}))
},
insert_match_events = function(match_events,whoscored_match_event){
	if(match_events.match_id && match_events.player_id && match_events.team_id){
		match_events.offset = whoscored_match_event.offset;
		match_events.minute = whoscored_match_event.minute;
		console.log('start insert_whoscored_event');
		excute(mysql.format('INSERT INTO `match_events` SET ?',match_events),function(result){
			insert_whoscored_event_event(result.insertId,whoscored_match_event.id)
		})
	}
},
migrate = function(){
	insert_whoscored_player_player(function(){
		insert_whoscored_team_team(function(){
			insert_whoscored_match_match(select_whoscored_event)
		})
	})
}
//SELECT whoscored_player_not_in_whoscored_player_player.id,player.id FROM (SELECT * FROM `whoscored_player` WHERE id NOT IN (SELECT whoscored_player_id FROM `whoscored_player_player`))`whoscored_player_not_in_whoscored_player_player` 
//JOIN `player` ON player.name = whoscored_player_not_in_whoscored_player_player.name
//SELECT whoscored_matches_not_in_whoscored_match_match.*,whoscored_team_team.team_id FROM (SELECT * FROM `whoscored_matches` WHERE id NOT IN (SELECT whoscored_match_id FROM `whoscored_match_match`))`whoscored_matches_not_in_whoscored_match_match` JOIN `whoscored_team_team` ON whoscored_team_team.whoscored_team_id = whoscored_matches_not_in_whoscored_match_match.team1_id

/*INSERT INTO `whoscored_match_match`(`whoscored_match_id`,`match_id`) SELECT whoscored_match.id,matchs.id FROM (SELECT whoscored_matches_not_in_whoscored_match_match.id,team1.team_id AS team1_id,team2.team_id AS team2_id,whoscored_matches_not_in_whoscored_match_match.play_at,whoscored_matches_not_in_whoscored_match_match.score1,whoscored_matches_not_in_whoscored_match_match.score2 FROM (SELECT * FROM `whoscored_matches` WHERE id NOT IN (SELECT whoscored_match_id FROM `whoscored_match_match`))`whoscored_matches_not_in_whoscored_match_match` 
JOIN `whoscored_team_team` AS `team1` ON team1.whoscored_team_id = whoscored_matches_not_in_whoscored_match_match.team1_id 
JOIN `whoscored_team_team` AS `team2` ON team2.whoscored_team_id = whoscored_matches_not_in_whoscored_match_match.team2_id)`whoscored_match` 
JOIN `matchs` ON (whoscored_match.team1_id = matchs.team1_id AND whoscored_match.team2_id = matchs.team2_id AND whoscored_match.play_at = matchs.play_at)*/
module.exports = migrate;
migrate()