var excute = require('../../excute'),asyncLoop = require('../../asyncLoop'),mysql = require('mysql'),
get_team = function(match,cb){
	excute(mysql.format('SELECT whoscored_team_id,team_id FROM whoscored_team_team WHERE whoscored_team_id IN (?)',[[match.team1_id,match.team2_id]]),cb)
},
get_match = function(match,cb){
	get_team(match,function(teams){
		var team1 = _.find(teams,function(team){
			return team.id == match.team1_id
		}),
		team2 = _.find(teams,function(team){
			return team.id == match.team2_id
		}),
		team1_id = team1.team_id,
		team2_id = team2.team_id;
		excute(mysql.format('SELECT id FROM `matchs` WHERE team1_id = ? AND team2_id = ? AND play_at = ?',[team1_id,team2_id,match.play_at]),cb)
	})
},
migrate = function(cb){
	console.log('start to insert whoscored_match_match');
	excute('SELECT * FROM `whoscored_match` WHERE id NOT IN (SELECT whoscored_match_id FROM `whoscored_match_match`)',function(matches){
		if(matches.length){
			asyncLoop(matches.length, function(loop){
				var whoscored_match = matches[loop.iteration()];
				get_match(whoscored_match,function(team){
					if(match.length){
						var match = match[0];
						excute(mysql.format('INSERT INTO `whoscored_match_match` SET ?',{
							whoscored_match_id:whoscored_match.id,
							match_id:match.id
						}),function(){
							loop.next();
						})
					} else {
						loop.next();
					}
				});
			}, function(){
				console.log('complete insert whoscored_match_match');
				cb()
			})
		}
	})
}
module.exports.migrate = migrate;