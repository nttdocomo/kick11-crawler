var excute = require('../../promiseExcute'),
mysql = require('mysql'),_=require('underscore'),
get_team = function(match){
	return excute(mysql.format('SELECT whoscored_team_id,team_id FROM whoscored_team_team WHERE team_id IN ?',[[[match.team1_id,match.team2_id]]]))
},
get_match = function(match){
	return get_team(match).then(function(teams){
		if(teams.length == 2){
			var team1 = _.find(teams,function(team){
				return team.team_id == match.team1_id
			}),
			team2 = _.find(teams,function(team){
				return team.team_id == match.team2_id
			}),
			team1_id = team1.whoscored_team_id,
			team2_id = team2.whoscored_team_id;
			return excute(mysql.format('SELECT id FROM `whoscored_matches` WHERE team1_id = ? AND team2_id = ? AND play_at = ?',[team1_id,team2_id,match.play_at]))
		}
	})
},
migrate = function(cb){
	console.log('start to insert whoscored_match_match');
	return excute('SELECT * FROM `matchs` WHERE id NOT IN (SELECT match_id FROM `whoscored_match_match`)').then(function(matches){
		if(matches.length){
			return matches.reduce(function(sequence, match){
				return sequence.then(function(){
					return get_match(match).then(function(whoscored_match){
						if(whoscored_match.length){
							var whoscored_match = whoscored_match[0];
							return excute(mysql.format('INSERT INTO `whoscored_match_match` SET ?',{
								whoscored_match_id:whoscored_match.id,
								match_id:match.id
							}))
						}
					});
				})
			},Promise.resolve())
		}
	}).then(function(){
		console.log('complete insert whoscored_match_match');
	});
};
module.exports.migrate = migrate;