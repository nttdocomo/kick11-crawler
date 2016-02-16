/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
url = require('url'),
mysql = require('mysql'),
_ = require('underscore'),
difference = require('../../utils').difference,
BaseModel = require('../../model'),
Model = BaseModel.extend({
    is_exist:function(){
		return excute(mysql.format('SELECT * FROM `'+this.constructor.table+'` WHERE teamId = ? AND playerId = ? AND matchId = ?',[this.get('teamId'), this.get('playerId'), this.get('matchId')]))
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
Model.excute = excute;
Model.table = 'match_player_statistics';
Model.all = function(){
	console.log(this.table)
    return excute('SELECT * FROM '+this.table+' ORDER BY play_at ASC');
};
Model.getMatchCentrePlayerStatistics = function(whoscored_match_player_statistic){
    var team_id,match_id,player_id,whoscored_match_player_statistics_id = whoscored_match_player_statistic.id;
    return excute(mysql.format('SELECT team_id FROM `whoscored_team_team` WHERE whoscored_team_id = ? LIMIT 1',[whoscored_match_player_statistic.teamId])).then(function(row){
        team_id = row[0].team_id;
        return excute(mysql.format('SELECT match_id FROM `whoscored_match_match` WHERE whoscored_match_id = ? LIMIT 1',[whoscored_match_player_statistic.matchId]))
    }).then(function(row){
        match_id = whoscored_match_player_statistic.matchId = row[0].match_id;
        return excute(mysql.format('SELECT player_id FROM `whoscored_player_player` WHERE whoscored_player_id = ? LIMIT 1',[whoscored_match_player_statistic.playerId]))
    }).then(function(row){
        player_id = whoscored_match_player_statistic.playerId = row[0].player_id;
        return excute(mysql.format('SELECT id FROM `match_player_statistics` WHERE playerId = ? AND teamId = ? AND matchId = ? LIMIT 1',[player_id,team_id,match_id]))
    }).then(function(row){
        whoscored_match_player_statistic.teamId = team_id;
        if(!row.length){
            return excute(mysql.format('INSERT INTO `match_player_statistics` SET ?',whoscored_match_player_statistic)).then(function(result){
                return result.insertId
            })
        } else {
            return excute(mysql.format('UPDATE `match_player_statistics` SET ? WHERE playerId = ? AND teamId = ? AND matchId = ?',[whoscored_match_player_statistic,player_id,team_id,match_id])).then(function(){
                return row[0].id
            })
        }
    }).then(function(match_player_statistics_id){
        return excute(mysql.format('SELECT 1 FROM `whoscored_match_player_statistics_relation` WHERE whoscored_match_player_statistics_id = ? LIMIT 1',[whoscored_match_player_statistics_id])).then(function(row){
            if(!row.length){
                return excute(mysql.format('INSERT INTO `whoscored_match_player_statistics_relation` SET ?',{
                    whoscored_match_player_statistics_id:whoscored_match_player_statistics_id,
                    match_player_statistics_id:match_player_statistics_id
                }))
            }
            return Promise.resolve();
        }) 
    }).catch(function(err){
        console.log(err)
    	return Promise.resolve();
    })
};
module.exports = Model;