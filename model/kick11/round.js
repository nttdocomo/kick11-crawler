/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
difference = require('../../utils').difference,
Model = require('../../model'),
Round = Model.extend({
    is_exist:function(){
		return excute(mysql.format('SELECT * FROM `'+this.constructor.table+'` WHERE team_id = ? AND player_id = ? AND match_id = ?',[this.get('team_id'), this.get('player_id'), this.get('match_id')]))
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
Round.excute = excute;
Round.table = 'rounds';
Round.all = function(){
    return excute('SELECT * FROM '+this.table+'');
};
Round.get_round_id = function(event_id,pos){
	return excute(mysql.format('SELECT id FROM ?? WHERE event_id = ? AND pos = ?', [this.table,event_id,pos])).then(function(row){
		if(row.length){
			return row[0].id
		} else {
			var round = new Round({
				event_id:event_id,
				pos:pos
			})
			return round.save().then(function(result){
				return result.insertId
			})
		}
	});
};
module.exports = Round;