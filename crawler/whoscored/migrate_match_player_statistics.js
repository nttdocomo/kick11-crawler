var excute = require('../../promiseExcute'),
MatchPlayerStatistic = require('../../model/kick11/statistic');
module.exports = function(){
    return excute('SELECT * FROM `whoscored_match_player_statistics` WHERE id NOT IN (SELECT whoscored_match_player_statistics_id FROM `whoscored_match_player_statistics_relation`)').then(function(whoscored_match_player_statistics){
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