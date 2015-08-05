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
	init:function(match,date){
		this._super();
		var match_id = match[1],
	    stage_id = match[0],
	    team1_id = match[4],
	    team2_id = match[8],
	    play_at = moment.tz([date,match[3]].join(' '),"Europe/London").utc().format('YYYY-MM-DD HH:mm'),
	    score = match[12],
	    values = {
	    	'id':match_id,
	        'team1_id':team1_id,
	        'team2_id':team2_id,
	        'play_at':play_at,
	        'stage_id':stage_id
	    };
	    if(score != 'vs'){
	        values.score1 = score.split(/\s\:\s/)[0];
	        values.score2 = score.split(/\s\:\s/)[1];
	    }
		console.log(match_id + ' get!')
	    _.extend(this.attributes,values);
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
			diff.updated_at = moment.utc().format('YYYY-MM-DD HH:mm:ss')
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