var excute = require('../../excute'),asyncLoop = require('../../asyncLoop'),mysql = require('mysql'),
get_player = function(player,cb){
	excute(mysql.format('SELECT id FROM `player` WHERE name = ? AND date_of_birth = ?',[player.name,player.date_of_birth]),cb)
},
migrate = function(cb){
	console.log('start to insert whoscored_player_player');
	excute('SELECT * FROM `whoscored_player` WHERE id NOT IN (SELECT whoscored_player_id FROM `whoscored_player_player`)',function(players){
		if(players.length){
			asyncLoop(players.length, function(loop){
				var whoscored_player = players[loop.iteration()];
				get_player(whoscored_player,function(player){
					if(player.length){
						player = player[0];
						excute(mysql.format('INSERT INTO `whoscored_player_player` SET ?',{
							whoscored_player_id:whoscored_player.id,
							player_id:player.id
						}),function(){
							loop.next();
						})
					} else {
						loop.next();
					}
				});
			}, function(){
				console.log('complete insert whoscored_player_player');
				cb()
			})
		}
	})
}
module.exports.migrate = migrate;