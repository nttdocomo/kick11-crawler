/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
difference = require('../../crawler/transfermarkt.co.uk/utils').difference,
Model = require('../../model'),
Match = Model.extend({
	table:'whoscored_match',
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
Match.table = 'whoscored_match';
Match.get_uncomplete_matches = function(){
    return excute('SELECT id,play_at AS play_date FROM whoscored_match WHERE score1 IS NULL AND score2 IS NULL ORDER BY play_at ASC');
};
Match.all = function(){
    return excute('SELECT * FROM whoscored_match ORDER BY play_at ASC');
};
module.exports.get_match_by_id = function(id){
    return excute(mysql.format('SELECT 1 FROM whoscored_match WHERE id = ?',[id]));
};
module.exports = Match;