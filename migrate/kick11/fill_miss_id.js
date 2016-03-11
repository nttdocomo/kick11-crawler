var mysql = require('mysql'),
_ = require('underscore'),
excute = require('../../promiseExcute'),
get_missing_ids = function(table){
	return excute(mysql.format('SELECT playerId,teamId,matchId FROM ??',['match_player_statistics'])).then(function(rows){
        console.log(rows.length)
        return rows.reduce(function(sequence,row,i){
            var player_id = row.playerId,
            team_id = row.teamId,
            match_id = row.matchId,
            whoscored_player_id,
            whoscored_team_id,
            whoscored_match_id;
            return sequence.then(function(){
                return excute(mysql.format('SELECT whoscored_player_id FROM ?? WHERE player_id = ? LIMIT 1',['whoscored_player_player',player_id])).then(function(rows){
                    whoscored_player_id = rows[0].whoscored_player_id;
                })
            })
        },Promise.resolve())
    }).then(function(){
    	process.exit();
    }).catch(function(err){
    	console.log(err)
    	process.exit();
    })
};
get_missing_ids('match_player_statistics');
module.exports = get_missing_ids;