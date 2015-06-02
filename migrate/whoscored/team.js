var excute = require('../../promiseExcute'),
mysql = require('mysql'),
get_team = function(team){
	return excute(mysql.format('SELECT id FROM `team` WHERE team_name = ?',[team.name]))
},
migrate = function(cb){
	console.log('start to insert whoscored_team_team');
	return excute('SELECT * FROM `whoscored_teams` WHERE id NOT IN (SELECT whoscored_team_id FROM `whoscored_team_team`)').then(function(teams){
		if(teams.length){
			return teams.reduce(function(sequence, whoscored_team){
				return sequence.then(function(){
					return get_team(whoscored_team).then(function(team){
						if(team.length){
							var team = team[0];
							return excute(mysql.format('INSERT INTO `whoscored_team_team` SET ?',{
								whoscored_team_id:whoscored_team.id,
								team_id:team.id
							}))
						}
					});
				})
			},Promise.resolve())
		}
	}).then(function(){
		console.log('complete insert whoscored_team_team');
	});
};
module.exports.migrate = migrate;