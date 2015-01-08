var excute = require('../../excute'),asyncLoop = require('../../asyncLoop'),mysql = require('mysql'),_=require('underscore'),
migrate = function(cb){
	console.log('start to migrate transfers');
	excute('SELECT * FROM transfermarket_transfer WHERE transfer_ref_id = 0',function(transfers){
		console.log('there are '+transfers.length+' to insert')
		if(transfers.length){
			var clone_transfers = transfers.slice();
			asyncLoop(transfers.length, function(loop){
				var transfer = transfers[loop.iteration()];
				get_team(transfers[loop.iteration()],function(teams){
					if(teams.length == 2){
						var taking_team = _.find(teams,function(team){
							return team.id == transfer.taking_team_id
						}),
						releasing_team = _.find(teams,function(team){
							return team.id == transfer.releasing_team_id
						}),
						taking_team_id = taking_team.team_ref_id,
						releasing_team_id = releasing_team.team_ref_id;
						(function(transfer,taking_team_id,releasing_team_id){
							get_player(transfer,function(player){
								if(player.length){
									player_id = player[0].player_ref_id;
									excute(mysql.format('INSERT INTO transfer SET ?', {
										taking_team_id: taking_team_id,
										releasing_team_id:releasing_team_id,
										player_id:player_id,
										season:transfer.season,
										transfer_date:transfer.transfer_date,
										transfer_sum:transfer.transfer_sum,
										loan:transfer.loan
									}),function(result){
										excute(mysql.format("UPDATE transfermarket_transfer SET transfer_ref_id = ? WHERE id = ?", [result.insertId,transfer.id]),function(){
											loop.next();
										})
									})
								}
							})
						})(transfer,taking_team_id,releasing_team_id)
					} else {
						loop.next();
					}
				})
			}, function(){
				console.log('complete migrate transfers');
				cb()
			})
			/*transfers.forEach(function(transfer){
				get_team(transfer,function(teams){
					var count = 0;
					if(teams.length == 2){
						var taking_team = _.find(teams,function(team){
							return team.id == transfer.taking_team_id
						}),
						releasing_team = _.find(teams,function(team){
							return team.id == transfer.releasing_team_id
						}),
						taking_team_id = taking_team.team_ref_id,
						releasing_team_id = releasing_team.team_ref_id;
						(function(transfer,taking_team_id,releasing_team_id){
							get_player(transfer,function(player){
								if(player.length){
									count++;
									player_id = player[0].player_ref_id;
									excute(mysql.format('INSERT INTO transfer SET ?', {
										taking_team_id: taking_team_id,
										releasing_team_id:releasing_team_id,
										player_id:player_id,
										season:transfer.season,
										transfer_date:transfer.transfer_date,
										transfer_sum:transfer.transfer_sum,
										loan:transfer.loan
									}),function(result){
										mysql.format("UPDATE transfermarket_transfer SET transfer_ref_id = ? WHERE id = ?", [result.insertId,transfer.id],function(){
											count--;
											if(!count){
												console.log(count)
											}
										})
									})
								}
							})
						})(transfer,taking_team_id,releasing_team_id)
					}
				})
			})*/
		} else {
			console.log('complete migrate transfers');
			cb();
		}
	})
}
get_player = function(transfer,cb){
	excute(mysql.format('SELECT player_ref_id FROM transfermarket_player WHERE id = ? AND player_ref_id != 0',[transfer.player_id]),cb)
}
get_team = function(transfer,cb){
	excute(mysql.format('SELECT id,team_ref_id FROM transfermarket_team WHERE team_ref_id != 0 AND id IN (?)',[[transfer.taking_team_id,transfer.releasing_team_id]]),cb)
}
module.exports.migrate = migrate;