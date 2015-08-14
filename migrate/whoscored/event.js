var excute = require('../../excute'),
mysql = require('mysql'),
_ = require('underscore'),
get_team = function(whoscored_match_event,cb){
	return excute(mysql.format('SELECT team_id FROM whoscored_team_team WHERE whoscored_team_id = ?',[[whoscored_match_event.team_id]])).then(function(team){
		if(team.length){
			cb({
				team_id:team[0].team_id
			})
		} else {
			cb({})
		}
	})
},
get_match = function(whoscored_match_event,cb){
	excute(mysql.format('SELECT match_id FROM `whoscored_match_match` WHERE whoscored_match_id = ?',[whoscored_match_event.match_id]),function(match){
		if(match.length){
			cb({
				match_id:match[0].match_id
			})
		} else {
			cb({})
		}
	})
},
get_player = function(whoscored_match_event,cb){
	excute(mysql.format('SELECT player_id FROM `whoscored_player_player` WHERE whoscored_player_id = ?',[whoscored_match_event.player_id]),function(player){
		if(player.length){
			cb({
				player_id:player[0].player_id
			})
		} else {
			cb({})
		}
	})
},
insert_whoscored_event_event = function(match_events_id,whoscored_match_event_id,cb){
	excute(mysql.format('INSERT INTO `whoscored_event_event` SET ?',{
		whoscored_event_id:whoscored_match_event_id,
		event_id:match_events_id
	}),cb)
},
get_event_id_for_goal_event = function(event_id,cb){
	excute(mysql.format('SELECT event_id FROM `whoscored_event_event` WHERE whoscored_event_id = ? AND event_id NOT IN (SELECT event_id FROM `goal_events`)',[event_id]),cb)
},
insert_goal_event = function(match_events_id,whoscored_match_event_id,cb){
	excute(mysql.format('SELECT * FROM `whoscored_goals` WHERE event_id = ?',[whoscored_match_event_id]),function(rows){
		if(rows.length){
			var row = rows[0];
			excute(mysql.format('INSERT INTO `goal_events` SET ?',{
				event_id:match_events_id,
				penalty : row.penalty,
				owngoal : row.owngoal,
			}),cb)
			
		}
	})
},
preExcuteFunc = [get_match,get_team,get_player],
afterInsertMatchEventsCalls = [insert_whoscored_event_event,insert_goal_event],
migrate = function(cb){
	console.log('start create tables');
	return Promise.resolve().then(function(){
		console.log('complete create tables');
		var players,teams;
		return excute('SELECT whoscored_player_id FROM `whoscored_player_player`').then(function(row){
			players = _.map(row,function(item){
				return item.whoscored_player_id;
			})
			return excute('SELECT whoscored_team_id FROM `whoscored_team_team`');
		}).then(function(row){
			teams = _.map(row,function(item){
				return item.whoscored_team_id;
			})
			return excute('SELECT * FROM `whoscored_match_events` WHERE team_id IN ? AND player_id IN ?',[[teams],[players]]);
		}).then(function(whoscored_match_events){
			if(whoscored_match_events.length){
				whoscored_match_events.reduce(function(sequence, whoscored_match_event){
					var team_id = whoscored_match_event.team_id,
					match_id = whoscored_match_event.match_id;
					sequence.then(function(){
						return excute('SELECT * FROM `whoscored_matches` WHERE match_id = ? AND (team1_id = ? OR team2_id = ?)',[match_id,team_id,team_id])
					}).then(function(whoscored_match){
						if(whoscored_match.length){
							whoscored_match = whoscored_match[0];
							team1_id = whoscored_match.team1_id;
							team2_id = whoscored_match.team2_id;
							return excute(mysql.format(''))
						}
					})
				},Promise.resolve())
			}
		}).then(function(){
			console.log('complete insert match_event');
		})
	})
}
module.exports.migrate = migrate;