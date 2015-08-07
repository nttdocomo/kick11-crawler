/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
difference = require('../transfermarkt.co.uk/utils').difference,
Model = require('../../model'),
model = Model.extend({
	tableName:'whoscored_matches',
	init:function(data){
		this._super();
		console.log(match_id + ' get!')
	    _.extend(this.attributes,data);
	},
	save:function(){
		var me = this;
		return this._super(this.attributes);
	},
	needToUpdate:function(data,row){
		this._super(data,row);
		var diff;
		if(!_.isEqual(data,row)){
			console.log(data.id + 'need to update');
			diff = difference(row,data);
			return diff;
    		//return excute(mysql.format('UPDATE `transfermarket_team` SET ? WHERE id = ?',[diff,id]))
		}
		return false;
	}
});
module.exports.get_match_by_id = function(id){
    return excute(mysql.format('SELECT 1 FROM whoscored_matches WHERE id = ?',[id]));
};
module.exports.get_uncomplete_matches = function(){
    return excute('SELECT id,play_at FROM whoscored_matches WHERE score1 IS NULL AND score2 IS NULL');
};
module.exports.model = model;