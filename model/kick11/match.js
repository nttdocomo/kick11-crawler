/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
difference = require('../../utils').difference,
Model = require('../../model'),
Match = Model.extend({
	tableName:'matchs',
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
Match.table = 'matchs';
Match.all = function(){
	console.log(this.table)
    return excute('SELECT * FROM '+this.table+' ORDER BY play_at ASC');
};
module.exports.model = Match;