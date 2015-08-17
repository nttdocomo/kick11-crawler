/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
difference = require('../../utils').difference,
Model = require('../../model'),
Statistic = Model.extend({
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
Statistic.excute = excute;
Statistic.table = 'match_player_statistics';
Statistic.all = function(){
	console.log(this.table)
    return excute('SELECT * FROM '+this.table+' ORDER BY play_at ASC');
};
Statistic.save_from_whoscored = function(content, match_id){
    var query = url.parse(queueItem.url,true).query,
	matchId = query.matchId,
	teamId = query.teamIds,
	matchCentrePlayerStatistics = JSON.parse(content),
	playerTableStats = matchCentrePlayerStatistics.playerTableStats;
    return excute('SHOW COLUMNS FROM match_player_statistics').then(function(){
		console.log('get columns of match_player_statistics')
		var columns = _.map(result,function(column){
			return column.Field;
		});
		return excute(mysql.format('SELECT * FROM `whoscored_matches` WHERE id = ? AND (team1_id = ? OR team2_id = ?)',[matchId,teamId,teamId]))
    }).then(function(whoscored_match){
    	if(whoscored_match.length){
			whoscored_match = whoscored_match[0];
			var whoscored_team1_id = whoscored_match.team1_id,
			whoscored_team2_id = whoscored_match.team2_id,
			play_at = whoscored_match.play_at,
			team1_id,
			team2_id;
			return excute(mysql.format('SELECT * FROM `whoscored_team_team` WHERE whoscored_team_id = ?',[whoscored_team1_id])).then(function(row){
				if(row.length){
					team1_id = row[0].team_id;
					if(whoscored_team1_id == teamId){
						playerTableStat.teamId = team1_id
					}
					return excute(mysql.format('SELECT * FROM `whoscored_team_team` WHERE whoscored_team_id = ?',[whoscored_team2_id]));
				}
				return Promise.resolve();
			}).then(function(row){
				if(row && row.length){
					team2_id = row[0].team_id;
					if(whoscored_team2_id == teamId){
						playerTableStat.teamId = team2_id
					}
					if(team1_id && team2_id){
						return excute(mysql.format('SELECT * FROM `matchs` WHERE team1_id = ? AND team2_id = ? AND play_at = ?',[team1_id,team2_id,play_at]));
					}
				}
				return Promise.resolve();
			}).then(function(row){
				if(row && row.length){
					matchId = row[0].id
				}
				return Promise.resolve();
			})
		}
		return Promise.resolve();
    }).then(function(result){
		if(result && result.length){
			playerTableStat.matchId = result[0].id
			return playerTableStats.reduce(function(sequence,playerTableStat){
				var alter_sql = [];
	    		//首先将值为null或者undefined的删除，因为无法判断值为数字还是字符串，如果表字段没有这个键，则无法创建列。
	    		_.each(playerTableStat, function(value,key){
	    			if (value === null || value === undefined || value === '' || value === 0 || typeof(value) === 'object') {
						// test[i] === undefined is probably not very useful here
						delete playerTableStat[key];
					} else {
						if(columns.indexOf(key) < 0){
							unknow_columns.push(key)
						}
					}
	    		})
		    	var playerId = playerTableStat.playerId;
				return sequence.then(function(){
	    			return unknow_columns.reduce(function(sequence,column){
	    				return sequence.then(function(){
	    					if(typeof(playerTableStat[column]) == 'string'){
								return excute('ALTER TABLE whoscored_match_player_statistics ADD '+column+' varchar(30) DEFAULT NULL')
							}
							if(typeof(playerTableStat[column]) == 'number'){
								return excute('ALTER TABLE whoscored_match_player_statistics ADD '+column+' smallint UNSIGNED DEFAULT 0')
							}
							if(typeof(playerTableStat[column]) == 'boolean'){
								return excute('ALTER TABLE whoscored_match_player_statistics ADD '+column+' boolean DEFAULT 0')
							}
	    				})
	    			},Promise.resolve())
	    		}).then(function(){
					return excute(mysql.format('SELECT player_id FROM `whoscored_player_player` WHERE whoscored_player_id = ?',[playerId]))
				}).then(function(row){
					if(row.length){
						playerTableStat.playerId = row[0].player_id;
						statistic = new Statistic(playerTableStat)
						return statistic.save();
					}
					return Promise.resolve()
	    		})
			},Promise.resolve())
		}
		return Promise.resolve()
	})
};
module.exports = Statistic;