var excute = require('../../promiseExcute'),
mysql = require('mysql'),
Match = require('../../model/whoscored/matches');
module.exports = function(){
    return excute('SELECT whoscored_team_id FROM whoscored_team_team').then(function(row){
        console.log('whoscored_team length:' + row.length)
        var team_id = row.map(function(item,i){
            return item.whoscored_team_id
        })
        console.log('team_id length:' + team_id.length)
        return excute(mysql.format('SELECT * FROM `whoscored_match` WHERE id NOT IN (SELECT whoscored_match_id FROM `whoscored_match_match`) AND team1_id IN (?) AND team2_id IN (?)',[team_id,team_id]))
    }).then(function(whoscored_matches){
        console.log('whoscored_match length:' + whoscored_matches.length)
        if(whoscored_matches.length){
            return whoscored_matches.reduce(function(sequence,match,i){
                return sequence.then(function(){
                    return Match.migrate_match(match).catch(function(err){
                        console.log(err)
                        return Promise.resolve()
                    })
                })
            },Promise.resolve())
        }
        return Promise.resolve();
    })
}