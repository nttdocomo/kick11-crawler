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
Match.get_match = function(data){
    return excute(mysql.format('SELECT 1 FROM `whoscored_match` WHERE id = ? LIMIT 1',[data.id])).then(function(row){
    	var team1_id,team2_id;
    	if(!row.length){
    		return excute(mysql.format('SELECT team_id FROM `whoscored_team_team` WHERE whoscored_team_id = ? LIMIT 1',[data.team1_id])).then(function(row){
    			team1_id = row[0].team_id;
    			return excute(mysql.format('SELECT team_id FROM `whoscored_team_team` WHERE whoscored_team_id = ? LIMIT 1',[data.team2_id]))
    		}).then(function(){
    			team2_id = row[0].team_id;
    			return excute(mysql.format('SELECT 1 FROM `match` WHERE team1_id = ? AND team2_id = ? AND play_at = ? LIMIT 1',[team1_id,team2_id,data.play_at]))
    		}).then(function(row){
    			if(!row.length){
    				return excute(mysql.format('INSERT INTO `match` SET ?',_.extend(_.pick(data,'play_at','score1','score2'),{
    					team1_id:team1_id,
    					team2_id:team2_id
    				})))
    			}
    		}).then(function(){}).catch(function(){

    		})
    	}
    });
};
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