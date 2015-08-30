/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
difference = require('../../utils').difference,
Model = require('../../model'),
Event = Model.extend({
    is_exist:function(){
		return excute(mysql.format('SELECT * FROM ?? WHERE season_id = ? AND competition_id = ?',[this.constructor.table,this.get('team_id'), this.get('player_id')]))
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
Event.excute = excute;
Event.table = 'transfermarkt_event';
Event.all = function(){
    return excute('SELECT * FROM '+this.table+' ORDER BY play_at ASC');
};
module.exports = Event;