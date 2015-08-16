var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
Match = require('../../model/kick11/match').model,
migrate = function(){
	console.log('start to insert whoscored_match_match');
	return excute('SELECT whoscored_team_id FROM whoscored_team_team').then(function(row){
		if(row.length){
			var teams = _.map(row,function(item){
				return item.whoscored_team_id
			})
		}
		return excute(mysql.format('SELECT * FROM `whoscored_matches` WHERE team1_id IN ? AND team2_id IN ? ORDER BY play_at DESC',[[teams],[teams]]));
	}).then(function(whoscored_matches){
		console.log('there are ' + whoscored_matches.length + ' matches!');
		if(whoscored_matches.length){
			return whoscored_matches.reduce(function(sequence, whoscored_match){
				var team1_id,team2_id,match,play_at = whoscored_match.play_at;
				//console.log(whoscored_match.id + '----' + whoscored_match.play_at);
				return sequence.then(function(){
					return excute(mysql.format('SELECT team_id FROM whoscored_team_team WHERE whoscored_team_id = ? LIMIT 1',[whoscored_match.team1_id]))
				}).then(function(result){
					if(result.length){
						team1_id = result[0].team_id;
						return excute(mysql.format('SELECT team_id FROM whoscored_team_team WHERE whoscored_team_id = ? LIMIT 1',[whoscored_match.team2_id]));
					}
					return Promise.resolve()
				}).then(function(result){
					if(result && result.length){
						team2_id = result[0].team_id
						//console.log([team1_id,team2_id,play_at].join('--'))
						if(team1_id && team2_id){
							//console.log([team1_id,team2_id,play_at].join('--'))
							match = new Match({
								team1_id:team1_id,
								team2_id:team2_id,
								play_at:play_at,
								score1:whoscored_match.score1,
								score2:whoscored_match.score2
							})
							return match.save();
						}
					}
					return Promise.resolve()
				});
			},Promise.resolve())
		}
		return Promise.resolve()
	})
};
module.exports.migrate = migrate;
//migrate();