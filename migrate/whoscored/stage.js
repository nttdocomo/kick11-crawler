var excute = require('../../promiseExcute'),
mysql = require('mysql'),
migrate = function(cb){
	console.log('start to migrate');
	return excute('SELECT * FROM `whoscored_stages`')
	.then(function(stages){
		if(stages.length){
			return stages.reduce(function(sequence, stage){
				excute(mysql.format('SELECT DISTINCT team1_id'))
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