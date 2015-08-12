/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
difference = require('../transfermarkt.co.uk/utils').difference,
Player = require('./player').model,
Model = require('../../model'),
Statistics = Model.extend({
    tableName:'whoscored_match_player_statistics',
    is_exist:function(){
        return excute(mysql.format('SELECT 1 FROM whoscored_match_player_statistics WHERE playerId = ? AND teamId = ? AND matchId = ?',[this.playerId,this.teamId,this.matchId])).then(function(row){
            return row.length;
        })
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
Statistics.excute = excute;
Statistics.table = 'whoscored_match_player_statistics';
Statistics.all = function(){
    return excute('SELECT * FROM whoscored_match_player_statistics');
};
var getMatchCentrePlayerStatistics = function(queueItem,content,response){
    var unknow_columns = [],
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
            var playerId = playerTableStat.playerId;
            if(!playerTableStat.teamId){
                playerTableStat.teamId = teamId;
            }
            if(!playerTableStat.matchId){
                playerTableStat.matchId = matchId;
            }
            var statistics = new Statistics(playerTableStat),
            player = new Player({
                id:playerTableStat.playerId,
                name:playerTableStat.name
            });
            return sequence.then(function(){
                return player.save();
                /*return excute(mysql.format('SELECT id FROM whoscored_player WHERE id = ?',[playerTableStat.playerId])).then(function(row){
                    console.log('loop playerTableStats')
                    if(!row.length){
                        console.log('player ' + playerTableStat.playerId + ' is not in the database. insert!')
                        return excute(mysql.format('INSERT INTO whoscored_player SET ?',{
                            id:playerTableStat.playerId,
                            name:playerTableStat.name,
                        }))
                    }
                })*/
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
                return statistics.save();
                /*return excute(mysql.format('SELECT playerId,teamId,matchId FROM whoscored_match_player_statistics WHERE playerId = ? AND teamId = ? AND matchId = ?',[item.playerId,item.teamId,item.matchId])).then(function(statistic){
                    if(statistic){
                        return excute(mysql.format('UPDATE whoscored_match_player_statistics SET ? WHERE teamId = ? AND playerId = ? AND matchId = ?',[playerTableStat,teamId,playerId,matchId]))
                    } else {
                        return excute(mysql.format('INSERT INTO whoscored_match_player_statistics SET ?',playerTableStat))
                    }
                })*/
            })
        },Promise.resolve())
    })
};
module.exports.getMatchCentrePlayerStatistics = getMatchCentrePlayerStatistics;
module.exports.model = Statistics;