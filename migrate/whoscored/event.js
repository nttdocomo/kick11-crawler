var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
MatchEvent = require('../../model/kick11/event'),
migrate = function(){
	var players,teams;
	console.log('event migrate started!')
	return excute('SELECT whoscored_player_id FROM `whoscored_player_player`').then(function(row){
		players = _.map(row,function(item){
			return item.whoscored_player_id;
		})
		return excute('SELECT whoscored_team_id FROM `whoscored_team_team`');
	}).then(function(row){
		teams = _.map(row,function(item){
			return item.whoscored_team_id;
		})
		return excute(mysql.format('SELECT * FROM `whoscored_match_events` WHERE team_id IN ? AND player_id IN ?',[[teams],[players]]));
	}).then(function(whoscored_match_events){
		console.log('there is '+whoscored_match_events.length+' to migrate')
		if(whoscored_match_events.length){
			return whoscored_match_events.reduce(function(sequence, whoscored_match_event){
				var team_id = whoscored_match_event.team_id,
				match_id = whoscored_match_event.match_id;
				return sequence.then(function(){
					return excute(mysql.format('SELECT * FROM `whoscored_matches` WHERE id = ? AND (team1_id = ? OR team2_id = ?)',[match_id,team_id,team_id]))
				}).then(function(whoscored_match){
					if(whoscored_match.length){
						whoscored_match = whoscored_match[0];
						var whoscored_team1_id = whoscored_match.team1_id,
						whoscored_team2_id = whoscored_match.team2_id,
						play_at = whoscored_match.play_at,
						team1_id,
						team2_id;
						return excute(mysql.format('SELECT * FROM `whoscored_team_team` WHERE whoscored_team_id = ?',[whoscored_team1_id])).then(function(row){
							if(row.length){
								team1_id = row[0].team_id;
								return excute(mysql.format('SELECT * FROM `whoscored_team_team` WHERE whoscored_team_id = ?',[whoscored_team2_id]));
							}
							return Promise.resolve();
						}).then(function(row){
							if(row && row.length){
								team2_id = row[0].team_id;
								if(team1_id && team2_id){
									return excute(mysql.format('SELECT * FROM `matchs` WHERE team1_id = ? AND team2_id = ? AND play_at = ?',[team1_id,team2_id,play_at]));
								}
							}
							return Promise.resolve();
						}).then(function(row){
							if(row && row.length){
								match_id = row[0].id
								var data = _.clone(whoscored_match_event);
								delete data.id;
								delete data.updated_at;
								delete data.created_at;
								data.match_id = match_id;
								var match_event = new MatchEvent(data);
								return match_event.save();
							}
							return Promise.resolve();
						})
					} else {
						return Promise.resolve();
					}
				})
			},Promise.resolve())
		} else {
			return Promise.resolve();
		}
	}).then(function(){
		console.log('complete insert match_event');
	})
}
module.exports.migrate = migrate;