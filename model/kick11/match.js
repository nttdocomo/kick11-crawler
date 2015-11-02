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
	return excute(mysql.format('SELECT * FROM `match`'))excute(mysql.format('SELECT team_id FROM whoscored_team_team WHERE whoscored_team_id = ? LIMIT 1',[data.team1_id]))
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
	}).catch(function(err){
		console.log(err);
		return Promise.resolve()
	});
};
module.exports.model = Match;