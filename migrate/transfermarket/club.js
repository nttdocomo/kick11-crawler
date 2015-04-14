var excute = require('../../excute'),mysql = require('mysql'),
migrate_clubs = function(cb){
	migrate_transfermarket_clubs(function(){
		excute('SELECT * FROM transfermarket_club WHERE club_ref_id = 0',function(clubs){
			if(clubs.length){
				clubs.forEach(function(club){
					get_nation(club.nation_id,function(nation){
						if(nation.length){
							excute(mysql.format('INSERT INTO club SET ?', {
								id:team.id,
								name: club.club_name,
								nation_id:nation[0].nation_ref_sid
							}),function(result){
								mysql.format("UPDATE transfermarket_club SET club_ref_id = ? WHERE id = ?", [result.insertId,club.id])
							})
						}
					})
				})
			}
			console.log('complete migrate clubs');
			cb();
		})
	});
},
get_nation = function(nation_id,cb){
	excute(mysql.format('SELECT nation_ref_id FROM transfermarket_nation WHERE id = ? AND nation_ref_id != 0',[nation_id]),cb);
},
migrate = function(cb){
	console.log('start to migrate clubs');
	migrate_clubs(cb)
},
migrate_transfermarket_clubs = function(cb){
	console.log('start to migrate transfermarket_clubs');
	excute('SELECT * FROM transfermarket_team WHERE id = owner_id AND id NOT IN (SELECT `id` FROM `transfermarket_club`)',function(teams){
		if(teams.length){
			teams.forEach(function(team){
				excute(mysql.format('INSERT INTO transfermarket_club SET ?', {
					id:team.id,
					club_name: team.team_name,
					profile_uri:team.profile_uri,
					nation_id:team.nation_id
				}))
			})
		}
		console.log('complete migrate transfermarket_clubs');
		cb();
	})
}
module.exports.migrate = migrate;
module.exports.get_club_by_id = function(id,cb){
	excute(mysql.format('SELECT club_ref_id FROM transfermarket_club WHERE id = ? AND club_ref_id != 0',[id]),cb)
};