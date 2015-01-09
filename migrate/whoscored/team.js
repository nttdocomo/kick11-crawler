var excute = require('../../excute'),asyncLoop = require('../../asyncLoop'),mysql = require('mysql'),
get_team = function(team,cb){
	excute(mysql.format('SELECT id FROM `team` WHERE team_name = ?',[team.name]),cb)
},
migrate = function(cb){
	console.log('start to insert whoscored_team_team');
	excute('SELECT * FROM `whoscored_teams` WHERE id NOT IN (SELECT whoscored_team_id FROM `whoscored_team_team`)',function(teams){
		if(teams.length){
			asyncLoop(teams.length, function(loop){
				var whoscored_team = teams[loop.iteration()];
				get_team(whoscored_team,function(team){
					if(team.length){
						var team = team[0];
						excute(mysql.format('INSERT INTO `whoscored_team_team` SET ?',{
							whoscored_team_id:whoscored_team.id,
							team_id:team.id
						}),function(){
							loop.next();
						})
					} else {
						loop.next();
					}
				});
			}, function(){
				console.log('complete insert whoscored_team_team');
				cb()
			})
		}
	})
}
module.exports.migrate = migrate;