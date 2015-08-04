var url = require('url'),
excute = require('../../promiseExcute'),
mysql = require('mysql'),
StringDecoder = require('string_decoder').StringDecoder,
_ = require('underscore'),
getMatchCentrePlayerStatistics = function(queueItem,content,response){
    var decoder = new StringDecoder('utf8'),
	unknow_columns = [],
	query = url.parse(queueItem.url,true).query,
	matchId = query.matchId,
	teamId = query.teamIds,
	matchCentrePlayerStatistics = JSON.parse(content),
	playerTableStats = matchCentrePlayerStatistics.playerTableStats;
	return excute('SHOW COLUMNS FROM whoscored_match_player_statistics').then(function(result){
		console.log('get columns of whoscored_match_player_statistics')
		var columns = _.map(result,function(column){
			return column.Field;
		})
		return playerTableStats.reduce(function(sequence,playerTableStat){
			console.log('loop playerTableStats')
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
    		return excute(mysql.format('SELECT id FROM whoscored_player WHERE id = ?',[playerTableStat.playerId])).then(function(row){
				console.log('loop playerTableStats')
    			if(!row.length){
    				console.log('player ' + playerTableStat.playerId + ' is not in the database. insert!')
    				return excute(mysql.format('INSERT INTO whoscored_player SET ?',{
		                id:playerTableStat.playerId,
		                name:playerTableStat.name,
		            }))
    			}
    		}).then(function(){
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
		    	var playerId = playerTableStat.playerId;
		    	if(!playerTableStat.teamId){
		    		playerTableStat.teamId = teamId
		    	}
		    	if(!playerTableStat.matchId){
		    		playerTableStat.matchId = matchId
		    	}
		    	excute(mysql.format('SELECT playerId,teamId,matchId FROM whoscored_match_player_statistics WHERE playerId = ? AND teamId = ? AND matchId = ?',[item.playerId,item.teamId,item.matchId])).then(function(statistic){
		    		if(statistic){
			    		return excute(mysql.format('UPDATE whoscored_match_player_statistics SET ? WHERE teamId = ? AND playerId = ? AND matchId = ?',[playerTableStat,teamId,playerId,matchId]))
			    	} else {
			    		return excute(mysql.format('INSERT INTO whoscored_match_player_statistics SET ?',playerTableStat))
			    	}
		    	})
    		})
		},Promise.resolve())
	})
};
module.exports = getMatchCentrePlayerStatistics;