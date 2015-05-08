var excute = require('../../../promiseExcute'),mysql = require('mysql'),
Promise = require('rsvp').Promise,
/*
迁移逻辑
1.将transfermarket_team中id=owner_id并且id不在transfermarket_club里的数据筛选出来
2.将筛选出来的数据插入transfermarket_club中
*/
migrate_clubs = function(cb){
	console.log('start to migrate clubs');
	console.log('start to migrate transfermarket_clubs');
	var values = [];
	return excute('SELECT * FROM transfermarket_team WHERE id = owner_id AND id NOT IN (SELECT `id` FROM `transfermarket_club`)').then(function(teams){
		console.log(teams.length)
		if(teams.length){
			return teams.reduce(function(sequence,team){
				return sequence.then(function(){
					/*values.push({
						id:team.id,
						club_name: team.team_name,
						profile_uri:team.profile_uri,
						nation_id:team.nation_id
					})*/
					values.push([team.id, team.team_name, team.profile_uri, team.nation_id])
					/*excute(mysql.format('INSERT INTO transfermarket_club SET ?', {
						id:team.id,
						club_name: team.team_name,
						profile_uri:team.profile_uri,
						nation_id:team.nation_id
					}))*/
				})
				
			},Promise.resolve())
		}
	}).then(function(){
		//console.log(mysql.format('INSERT INTO transfermarket_club (id, club_name, profile_uri, nation_id) VALUES ?', [values]))
		if(values.length){
			return excute(mysql.format('INSERT INTO transfermarket_club (id, club_name, profile_uri, nation_id) VALUES ?', [values]));
		}
	},function(err){
		console.log(err)
	}).then(function(){
		console.log('complete migrate transfermarket_clubs');
		console.log('complete');
		console.log('start to migrate clubs');
		return excute('SELECT * FROM transfermarket_club WHERE club_ref_id = 0').then(function(clubs){
			console.log('complete select clubs')
			if(clubs.length){
				console.log('there is '+clubs.length+' clubs to migrate')
				return clubs.reduce(function(sequence,club){
					return sequence.then(function(){
						return excute(mysql.format('SELECT nation_ref_id FROM transfermarket_nation WHERE id = ? AND nation_ref_id != 0',[club.nation_id]))
					}).then(function(nation){
						if(nation.length){
							return excute(mysql.format('INSERT INTO club SET ?', {
								name: club.club_name,
								nation_id:nation[0].nation_ref_id
							})).then(function(result){
								return excute(mysql.format("UPDATE transfermarket_club SET club_ref_id = ? WHERE id = ?", [result.insertId,club.id]));
							})
						}
					})
				},Promise.resolve())
			}
		}).then(function(){
			console.log('complete migrate clubs');
		})
	})
	/*migrate_transfermarket_clubs(function(){
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
	});*/
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
	excute('SELECT * FROM transfermarket_team WHERE id = owner_id AND id NOT IN (SELECT `id` FROM `transfermarket_club`)').then(function(teams){
		if(teams.length){
			return teams.reduce(function(sequence,team){
				return sequence.then(function(){
					excute(mysql.format('INSERT INTO transfermarket_club SET ?', {
						id:team.id,
						club_name: team.team_name,
						profile_uri:team.profile_uri,
						nation_id:team.nation_id
					}))
				})
				
			},Promise.resolve())
		}
		console.log('complete migrate transfermarket_clubs');
		cb();
	})
}
module.exports.migrate_clubs = migrate_clubs;
module.exports.get_club_by_id = function(id,cb){
	excute(mysql.format('SELECT club_ref_id FROM transfermarket_club WHERE id = ? AND club_ref_id != 0',[id]),cb)
};
//migrate_clubs();