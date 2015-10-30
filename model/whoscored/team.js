/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
Model = require('../../model'),
_ = require('underscore'),
mysql = require('mysql'),
difference = require('../../crawler/transfermarkt.co.uk/utils').difference,
Team = Model.extend({
	table:'whoscored_team',
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
})
Team.table = 'whoscored_team';
Team.get_team_by_id = function(id){
    return excute(mysql.format('SELECT 1 FROM whoscored_team WHERE id = ?',[id]));
};
module.exports = Team;