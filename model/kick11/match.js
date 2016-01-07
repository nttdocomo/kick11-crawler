/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
difference = require('../../utils').difference,
Model = require('../../model'),
Match = Model.extend({
	tableName:'match',
    is_exist:function(){
		return excute(mysql.format('SELECT * FROM `matchs` WHERE team1_id = ? AND team2_id = ? AND play_at = ?',[this.get('team1_id'), this.get('team2_id'), this.get('play_at')]))
    },
	needToUpdate:function(data,row){
		this._super(data,row);
		var diff;
		if(!_.isEqual(data,row)){
			diff = difference(row,data);
			return diff;
    		//return excute(mysql.format('UPDATE `transfermarket_team` SET ? WHERE id = ?',[diff,id]))
		}
		return false;
	}
});
Match.excute = excute;
Match.table = 'match';
Match.all = function(){
	console.log(this.table)
    return excute('SELECT * FROM '+this.table+' ORDER BY play_at ASC');
};
Match.save_from_whoscored = function(data){
	var team1_id,team2_id,play_at = data.play_at;
	return excute(mysql.format('SELECT * FROM `match` WHERE team'))excute(mysql.format('SELECT team_id FROM whoscored_team_team WHERE whoscored_team_id = ? LIMIT 1',[data.team1_id]))
	.then(function(result){
		team1_id = result[0].team_id;
		return excute(mysql.format('SELECT team_id FROM whoscored_team_team WHERE whoscored_team_id = ? LIMIT 1',[data.team2_id]));
	}).then(function(result){
		team2_id = result[0].team_id
		var match = new Match({
			team1_id:team1_id,
			team2_id:team2_id,
			play_at:play_at,
			score1:data.score1,
			score2:data.score2
		})
		return match.save();
	}).then(function(){
		return excute(mysql.format('SELECT event_id FROM `event_team` WHERE team_id = ? LIMIT 1',[team1_id])).then(function(event_team){
			if(event_team.length){
				return excute(mysql.format('SELECT id FROM `event_standings` WHERE event_id = ? LIMIT 1',[event_team[0].event_id])).then(function(event_standings){
					if(!event_standings.length){
						return excute(mysql.format('INSERT INTO `event_standings` SET ?',{
							event_id:event.id
						})).then(function(result){
							return result.insertId
						})
					}
					return event_standings[0].id
				}).then(function(event_standing_id){
					return excute(mysql.format('SELECT 1 FROM `event_standing_entries` WHERE event_standing_id = ? AND team_id = ? LIMIT 1',[event_standing_id,team1_id]))
				}).then(function(){
					if()
				})
			}
		})
	}).then(function(row){
	})catch(function(err){
		console.log(err);
		return Promise.resolve()
	});
};
module.exports.model = Match;