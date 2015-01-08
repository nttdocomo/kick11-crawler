var excute = require('../../excute'),mysql = require('mysql'),
migrate = function(cb){
	console.log('start to migrate teams');
	excute('SELECT * FROM transfermarket_team WHERE team_ref_id = 0',function(teams){
		if(teams.length){
			teams.forEach(function(team){
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
			})
		}
		console.log('complete migrate teams');
		cb();
	})
}
get_club = function(club_id,cb){
	excute(mysql.format('SELECT club_ref_id FROM transfermarket_club WHERE id = ? AND club_ref_id != 0',[club_id]),cb)
}
module.exports.migrate = migrate;