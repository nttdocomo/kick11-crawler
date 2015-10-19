var excute = require('../../excute'),asyncLoop = require('../../asyncLoop'),mysql = require('mysql'),
excute_update_transfermarket_player_player_ref_id = function(transfermarket_player,cb){
	excute(mysql.format('SELECT id FROM player WHERE name = ? AND date_of_birth = ?',[transfermarket_player.full_name,transfermarket_player.date_of_birth]),function(player){//看player里有没有匹配的记录
		if(player.length){//如果有，则更新player_ref_id
			excute(mysql.format("UPDATE transfermarkt_player SET player_ref_id = ? WHERE id = ?", [player.id,transfermarket_player.id]),cb)
		} else {
			cb()
		}
	})
},
update_transfermarket_player_player_ref_id = function(cb){
	console.log('start to update transfermarket player player_ref_id');
	excute('SELECT * FROM `transfermarkt_player` WHERE player_ref_id = 0',function(players){//获取没有player_ref_id的记录
		if(players.length){
			asyncLoop(players.length, function(loop){
				excute_update_transfermarket_player_player_ref_id(players[loop.iteration()],function(){
					loop.next();
				});
			}, function(){
				console.log('complete update transfermarket player player_ref_id');
				cb()
			})
			/*players.forEach(function(player){
				excute_update_transfermarket_player_player_ref_id(player,cb);
			})*/
		} else {
			console.log('complete update transfermarket player player_ref_id');
			cb()
		}
	})
},
insert_player = function(player,cb){
	excute(mysql.format('INSERT INTO player SET ?', {
		name: player.full_name,
		date_of_birth:player.date_of_birth,
		height:player.height,
		foot:player.foot
	}),function(result){
		excute(mysql.format("UPDATE transfermarkt_player SET player_ref_id = ? WHERE id = ?", [result.insertId,player.id]),cb)
	})
},
migrate = function(cb){
	console.log('start to migrate players');
	update_transfermarket_player_player_ref_id(function(){
		excute('SELECT * FROM `transfermarkt_player` WHERE player_ref_id = 0',function(players){
			if(players.length){
				asyncLoop(players.length, function(loop){
					insert_player(players[loop.iteration()],function(){
						loop.next();
					});
				}, function(){
					console.log('complete migrate_player');
					cb()
				})
				/*players.forEach(function(player){
					count++;
					insert_player(player,cb);
				})*/
			} else {
				console.log('complete migrate_player');
				cb()
			}
			//console.log('complete migrate_player');
		})
	})
}
module.exports.migrate = migrate;