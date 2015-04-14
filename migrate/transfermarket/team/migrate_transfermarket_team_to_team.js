var excute = require('../../../promiseExcute'),mysql = require('mysql'),
asyncLoop = require('../../../asyncLoop'),
Promise = require('rsvp').Promise,
migrate_transfermarket_team_to_team = function(cb){
	console.log('start to migrate teams');
	excute('SELECT * FROM transfermarket_team WHERE team_ref_id = 0').then(function(teams){
		console.log('complete select teams');
		return teams.reduce(function(sequence,team,index){
			console.log('proccess '+index+' team' +team.id);
			return sequence.then(function(){
				console.log('select '+index+' team' +team.id);
				return excute(mysql.format('SELECT club_ref_id FROM transfermarket_club WHERE id = ? AND club_ref_id != 0',[team.id]))
			}).then(function(club){
				if(club.length){
					console.log('INSERT '+index+' team' +team.id);
					return excute(mysql.format('INSERT INTO team SET ?', {
						team_name: team.team_name,
						owner_id:club[0].club_ref_id,
						type:team.type
					})).then(function(result){
						console.log('UPDATE '+index+' team' +team.id);
						excute(mysql.format("UPDATE transfermarket_team SET team_ref_id = ? WHERE id = ?", [result.insertId,team.id]))
					}).catch(function(err){
						console.log(err)
					});
				}
			})
		},Promise.resolve());
	}).then(function(){
		console.log('All done!')
		cb();
	})
	/*excute('SELECT * FROM transfermarket_team WHERE team_ref_id = 0',function(teams){//获取team_ref_id未0的队伍
		if(teams.length){
			asyncLoop(teams.length,function(loop){
				var team = teams[loop.iteration()];
				excute(mysql.format('SELECT club_ref_id FROM transfermarket_club WHERE id = ? AND club_ref_id != 0',[club_id]),function(club){
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
		} else {
			console.log('there is not team to migrate');
			cb()
		}
	})*/
}
//module.exports.migrate_transfermarket_team_to_team = migrate_transfermarket_team_to_team;
migrate_transfermarket_team_to_team()