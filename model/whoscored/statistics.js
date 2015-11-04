/**
 * @author nttdocomo
 */
var mysql = require('mysql'),
url = require('url'),
_ = require('underscore'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
excute = require('../../promiseExcute'),
difference = require('../../crawler/transfermarkt.co.uk/utils').difference,
Player = require('./player'),
Model = require('../../model'),
Statistics = Model.extend({
    tableName:'whoscored_match_player_statistics',
    is_exist:function(){
        var data = this.attributes;
        return excute(mysql.format('SELECT 1 FROM whoscored_match_player_statistics WHERE playerId = ? AND teamId = ? AND matchId = ?',[data.playerId,data.teamId,data.matchId]));
    },
    needToUpdate:function(data,row){
        this._super(data,row);
        console.log('needToUpdate')
        var diff;
        if(!_.isEqual(data,row)){
            diff = difference(row,data);
            return diff;
            //return excute(mysql.format('UPDATE `transfermarket_team` SET ? WHERE id = ?',[diff,id]))
        }
        return false;
    },
    update:function(data,id){
        console.log(data);
        console.log('update '+[data.playerId,data.teamId,data.matchId].join('----'));
        data.updated_at = moment.utc().format('YYYY-MM-DD HH:mm:ss');
        return excute(mysql.format('UPDATE `'+this.tableName+'` SET ? WHERE playerId = ? AND teamId = ? AND matchId = ?',[data,data.playerId,data.teamId,data.matchId]))
    },
    insert:function(data){
        console.log('insert '+[data.playerId,data.teamId,data.matchId].join('----'))
        return this._super(data);
    }
});
Statistics.excute = excute;
Statistics.table = 'whoscored_match_player_statistics';
Statistics.all = function(){
    return excute('SELECT * FROM whoscored_match_player_statistics');
};
var getMatchCentrePlayerStatistics = function(queueItem,content){
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
            var alter_sql = [],
            playerId = playerTableStat.playerId,
            name = playerTableStat.name;
            delete playerTableStat.name;
            delete playerTableStat.incidents;
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
            if(!playerTableStat.teamId){
                playerTableStat.teamId = teamId;
            }
            if(!playerTableStat.matchId){
                playerTableStat.matchId = matchId;
            }
            player = new Player({
                id:playerId,
                name:name
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
                            return excute('ALTER TABLE whoscored_match_player_statistics ADD '+column+' varchar(30) DEFAULT NULL').then(function(){
                                excute('ALTER TABLE match_player_statistics ADD '+column+' varchar(30) DEFAULT NULL')
                            })
                        }
                        if(typeof(playerTableStat[column]) == 'number'){
                            return excute('ALTER TABLE whoscored_match_player_statistics ADD '+column+' smallint UNSIGNED DEFAULT 0').then(function(){
                                excute('ALTER TABLE match_player_statistics ADD '+column+' smallint UNSIGNED DEFAULT 0')
                            })
                        }
                        if(typeof(playerTableStat[column]) == 'boolean'){
                            return excute('ALTER TABLE whoscored_match_player_statistics ADD '+column+' boolean DEFAULT 0').then(function(){
                                excute('ALTER TABLE match_player_statistics ADD '+column+' boolean DEFAULT 0')
                            })
                        }
                    })
                },Promise.resolve())
            }).then(function(){
                console.log('save')
                return excute(mysql.format('SELECT id FROM `whoscored_match_player_statistics` WHERE playerId = ? AND teamId = ? AND matchId = ? LIMIT 1',[playerTableStat.playerId,playerTableStat.teamId,playerTableStat.matchId])).then(function(row){
                    if(row.length){
                        return excute(mysql.format('INSERT INTO `whoscored_match_player_statistics` SET ?',playerTableStat)).then(function(result){
                            return result.insertId;
                        })
                    }
                    return row[0].id
                }).then(function(whoscored_match_player_statistics_id){
                    var team_id,match_id,player_id;
                    return excute(mysql.format('SELECT team_id FROM `whoscored_team_team` WHERE whoscored_team_id = ? LIMIT 1',[playerTableStat.teamId]))).then(function(){
                        team_id = playerTableStat.teamId = row[0].team_id;
                        return excute(mysql.format('SELECT match_id FROM `whoscored_match_match` WHERE whoscored_match_id = ? LIMIT 1',[playerTableStat.matchId])))
                    }).then(function(row){
                        match_id = playerTableStat.matchId = row[0].match_id;
                        return excute(mysql.format('SELECT player_id FROM `whoscored_player_player` WHERE whoscored_player_id = ? LIMIT 1',[playerId])))
                    }).then(function(row){
                        player_id = playerTableStat.playerId = row[0].player_id;
                        return excute(mysql.format('SELECT id FROM `match_player_statistics` WHERE playerId = ? AND teamId = ? AND matchId = ? LIMIT 1',[player_id,team_id,match_id])))
                    }).then(function(row){
                        if(!row.length){
                            return excute(mysql.format('INSERT INTO `match_player_statistics` SET ?',playerTableStat)).then(function(result){
                                return result.insertId
                            })
                        }
                        return row[0].id
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
                    })
                });
            }).catch(function(err){
                console.log(err)
            })
        },Promise.resolve())
    }).catch(function(err){
        console.log(err)
    })
};
module.exports.getMatchCentrePlayerStatistics = getMatchCentrePlayerStatistics;
module.exports.model = Statistics;