/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
Model = require('../../model'),
moment = require('moment'),
_ = require('underscore'),
mysql = require('mysql'),
team_player = function(){
	return excute(mysql.format('SELECT id FROM `player`')).then(function(players){
		return players.reduce(function(sequence, player){
			var player_id = player.id;
			return sequence.then(function(){
				return excute(mysql.format('SELECT taking_team_id FROM `transfer` WHERE player_id = ? AND transfer_date < CURRENT_DATE() ORDER BY transfer_date DESC LIMIT 1',[player_id]))
			}).then(function(transfer){
				var team_id = transfer[0].taking_team_id;
				console.log('team_id|player_id\n'+[team_id,player_id].join('|'))
			})
		},Promise.resolve())
	})
};
module.exports.team_player = team_player;
team_player()