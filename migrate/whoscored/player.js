var excute = require('../../promiseExcute'),
mysql = require('mysql'),
get_player = function(player){
	return excute(mysql.format('SELECT id FROM `player` WHERE name = ? AND date_of_birth = ?',[player.name,player.date_of_birth]))
},
migrate = function(cb){
	console.log('start to insert whoscored_player_player');
	return excute('SELECT * FROM `whoscored_player` WHERE id NOT IN (SELECT whoscored_player_id FROM `whoscored_player_player`)').then(function(players){
		console.log('there are ' + players.length + ' players!');
		if(players.length){
			return players.reduce(function(sequence, whoscored_player){
				return sequence.then(function(){
					return get_player(whoscored_player).then(function(player){
						if(player.length){
							player = player[0];
							return excute(mysql.format('INSERT INTO `whoscored_player_player` SET ?',{
								whoscored_player_id:whoscored_player.id,
								player_id:player.id
							}))
						}
					});
				})
			},Promise.resolve())
		}
	})
};
module.exports.migrate = migrate;