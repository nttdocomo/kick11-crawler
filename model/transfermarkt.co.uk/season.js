/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
difference = require('../../utils').difference,
Model = require('../../model'),
Season = Model.extend({
    is_exist:function(){
		return excute(mysql.format('SELECT * FROM ?? WHERE id = ? LIMIT 1',[this.constructor.table,this.get('id')]))
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
Season.excute = excute;
Season.table = 'transfermarkt_season';
Season.all = function(){
    return excute('SELECT * FROM '+this.table+' ORDER BY play_at ASC');
};
module.exports = Season;