var excute = require('../../excute'),mysql = require('mysql'),
asyncLoop = require('../../asyncLoop'),
migrate = function(cb){
	console.log('start to migrate teams');
	excute('SELECT * FROM transfermarket_team WHERE team_ref_id = 0',function(teams){
		if(teams.length){
			asyncLoop(teams.length,function(loop){
				var team = teams[loop.iteration()];
				get_club(team.owner_id,function(club){
					if(club.length){
						excute(mysql.format('INSERT INTO team SET ?', {
							team_name: team.team_name,
							owner_id:club[0].club_ref_id,
							type:team.type
						}),function(result){
							excute(mysql.format("UPDATE transfermarket_team SET team_ref_id = ? WHERE id = ?", [result.insertId,team.id]))
						})
					}
				})
			},function(){
				console.log('complete migrate teams');
				cb()
			})
		}
	})
}
get_club_not_have_club_ref_id = function(club_id,cb){
	excute(mysql.format('SELECT club_ref_id FROM transfermarket_club WHERE id = ? AND club_ref_id != 0',[club_id]),cb)
}
module.exports.migrate = migrate;