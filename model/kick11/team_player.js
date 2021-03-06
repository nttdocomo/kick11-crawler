/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
realtime_team_player = function(){
	//查询所有球员的id
	return excute(mysql.format('SELECT id FROM `player`')).then(function(players){
		return players.reduce(function(sequence, player){
			return sequence.then(function(){
				return update_team_player_by_player_id(player.id)
			})
		},Promise.resolve())
	})
};
update_team_player_by_player_id = function(player_id){
	var player_id = player_id,team_id;
	return excute(mysql.format('SELECT taking_team_id FROM `transfer` WHERE player_id = ? AND transfer_date < CURRENT_DATE() ORDER BY transfer_date DESC LIMIT 1',[player_id])).then(function(transfer){
		team_id = transfer[0].taking_team_id;
		console.log('team_id|player_id\n'+[team_id,player_id].join('|'))
		//查询teamplayer里该球员的最新记录
		return excute(mysql.format('SELECT * FROM `teamplayer` WHERE player_id = ? AND event_id IS NULL LIMIT 1',[player_id]))
	}).then(function(teamplayer){
		//如果有这条记录
		if(teamplayer.length){
			//并且记录里球队和最新转会里的不一致
			if(teamplayer[0].team_id != team_id){
				return excute(mysql.format('UPDATE `teamplayer` SET ? WHERE id = ?',[{
					team_id:team_id
				},teamplayer.id]))
			}
			return Promise.resolve();
		}
		return excute(mysql.format('INSERT INTO `teamplayer` SET ?',[{
			player_id:player_id,
			team_id:team_id
		}]))
	})
}
module.exports.realtime_team_player = realtime_team_player;
module.exports.update_team_player_by_player_id = update_team_player_by_player_id;