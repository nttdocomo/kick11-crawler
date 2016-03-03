var mysql = require('mysql'),
excute = require('../../promiseExcute'),
MatchPlayerStatistic = require('../../model/kick11/statistic');
module.exports = function(){
    var whoscored_match_id,whoscored_team_id,whoscored_player_id;
    return excute('SELECT whoscored_match_id FROM whoscored_match_match').then(function(row){
        whoscored_match_id = row.map(function(item){
            return item.whoscored_match_id
        })
        return excute('SELECT whoscored_team_id FROM whoscored_team_team')
    }).then(function(row){
        whoscored_team_id = row.map(function(item){
            return item.whoscored_team_id
        })
        return excute('SELECT whoscored_player_id FROM whoscored_player_player')
    }).then(function(row){
        whoscored_player_id = row.map(function(item){
            return item.whoscored_player_id
        })
        return excute(mysql.format('SELECT * FROM `whoscored_match_player_statistics` WHERE id NOT IN (SELECT whoscored_match_player_statistics_id FROM `whoscored_match_player_statistics_relation`) AND playerId IN (?) AND teamId IN (?) AND matchId IN (?)',[whoscored_player_id,whoscored_team_id,whoscored_match_id]))
    }).then(function(whoscored_match_player_statistics){
        console.log('whoscored_match_player_statistics length:' + whoscored_match_player_statistics.length)
        if(whoscored_match_player_statistics.length){
            console.log('migrate match_player_statistics')
            return whoscored_match_player_statistics.reduce(function(sequence,whoscored_match_player_statistic){
                return sequence.then(function(){
                    return MatchPlayerStatistic.getMatchCentrePlayerStatistics(whoscored_match_player_statistic)
                })
            },Promise.resolve())
        }
        return Promise.resolve()
    })
}