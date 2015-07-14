var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
get_team = function(match){
	console.log(mysql.format('SELECT whoscored_team_id,team_id FROM whoscored_team_team WHERE team_id IN ?',[[[match.team1_id,match.team2_id]]]))
	return excute(mysql.format('SELECT whoscored_team_id,team_id FROM whoscored_team_team WHERE team_id IN ?',[[[match.team1_id,match.team2_id]]]))
},
get_match = function(match){
	return get_team(match).then(function(teams){
		console.log(teams.length)
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
	return excute('SELECT * FROM `whoscored_matches` WHERE id NOT IN (SELECT whoscored_match_id FROM `whoscored_match_match`)').then(function(whoscored_matches){
		console.log('there are ' + whoscored_matches.length + ' matches!');
		if(whoscored_matches.length){
			return whoscored_matches.reduce(function(sequence, whoscored_match){
				return sequence.then(function(){
					var team1_id,team2_id;
					return excute(mysql.format('SELECT team_id FROM whoscored_team_team WHERE whoscored_team_id = ?',[whoscored_match.team1_id])).then(function(result){
						if(result.length){
							team1_id = result.team_id
						}
						return excute(mysql.format('SELECT team_id FROM whoscored_team_team WHERE whoscored_team_id = ?',[whoscored_match.team2_id]));
					}).then(function(result){
						if(result.length){
							team2_id = result.team_id
						}
						if(team1_id && team2_id){
							console.log([team1_id,team2_id].join(':'))
							//return excute(mysql.format('SELECT * FROM `matchs` WHERE team1_id = ? AND team2_id = ?',[team1_id, team2_id]))
						}
					});
				})
			},Promise.resolve())
		}
	})
	/*return excute('SELECT * FROM `matchs` WHERE id NOT IN (SELECT match_id FROM `whoscored_match_match`)').then(function(matches){
		console.log('there are ' + matches.length + ' matches!');
		if(matches.length){
			return matches.reduce(function(sequence, match){
				return sequence.then(function(){
					return excute(mysql.format('SELECT whoscored_team_id,team_id FROM whoscored_team_team WHERE team_id IN ?',[[[match.team1_id,match.team2_id]]])).then(function(teams){
						if(teams.length == 2){
							var team1 = _.find(teams,function(team){
								return team.team_id == match.team1_id
							});
							var team2 = _.find(teams,function(team){
								return team.team_id == match.team2_id
							});
							team1_id = team1.whoscored_team_id,
							team2_id = team2.whoscored_team_id;
							return excute(mysql.format('SELECT id FROM `whoscored_matches` WHERE team1_id = ? AND team2_id = ? AND play_at = ?',[team1_id,team2_id,match.play_at]))
						}
					}).then(function(whoscored_match){
						console.log(whoscored_match.length)
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
	});*/
};
module.exports.migrate = migrate;
migrate();