var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_=require('underscore'),
Statistic = require('../../model/kick11/statistic'),
migrate = function(){
	console.log('开始复制比赛统计');
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
		return excute(mysql.format('SELECT * FROM `whoscored_match_player_statistics` WHERE teamId IN ? AND playerId IN ?',[[teams],[players]]));
	}).then(function(whoscored_match_player_statistics){
		if(whoscored_match_player_statistics.length){
			return whoscored_match_player_statistics.reduce(function(sequence, whoscored_match_player_statistic){
				var team_id = whoscored_match_player_statistic.teamId,
				match_id = whoscored_match_player_statistic.matchId;
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
								var data = _.clone(whoscored_match_player_statistic);
								delete data.id;
								delete data.updated_at;
								delete data.created_at;
								delete data.name;
								delete data.wSName;
								data.match_id = match_id;
								var statistic = new Statistic(data);
								return statistic.save();
							}
							return Promise.resolve();
						})
					}
					return Promise.resolve();
				})
			},Promise.resolve())
		}
		return Promise.resolve();
	})
};
module.exports.migrate = migrate;