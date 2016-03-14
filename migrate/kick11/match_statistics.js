var mysql = require('mysql'),
_ = require('underscore'),
excute = require('../../promiseExcute'),
get_missing_ids = function(table){
	return excute(mysql.format('SELECT id,playerId,teamId,matchId FROM ?? ORDER BY id ASC',[table])).then(function(rows){
        console.log(rows.length)
        return rows.reduce(function(sequence,row,i){
            return sequence.then(function(){
                var oldId = row.id,
                id = i+1,
                whoscored_player_id,
                whoscored_team_id,
                whoscored_match_id;
                return excute(mysql.format('UPDATE ?? SET id = ? WHERE id = ?',[table,id,oldId])).then(function(){
                    return excute(mysql.format('SELECT whoscored_player_id FROM ?? WHERE player_id = ? LIMIT 1',['whoscored_player_player',row.playerId]))
                }).then(function(rows){
                    if(!rows.length){
                        return Promise.resolve();
                    }
                    whoscored_player_id = rows[0].whoscored_player_id;
                    return excute(mysql.format('SELECT whoscored_team_id FROM ?? WHERE team_id = ? LIMIT 1',['whoscored_team_team',row.teamId])).then(function(rows){
                        if(!rows.length){
                            return Promise.resolve();
                        }
                        whoscored_team_id = rows[0].whoscored_team_id;
                        return excute(mysql.format('SELECT whoscored_match_id FROM ?? WHERE match_id = ? LIMIT 1',['whoscored_match_match',row.matchId])).then(function(rows){
                            if(!rows.length){
                                return Promise.resolve();
                            }
                            whoscored_match_id = rows[0].whoscored_match_id;
                            return excute(mysql.format('SELECT id FROM ?? WHERE playerId = ? AND teamId = ? AND matchId = ? LIMIT 1',['whoscored_match_player_statistics',whoscored_player_id,whoscored_team_id,whoscored_match_id])).then(function(rows){
                                if(rows.length){
                                    return excute(mysql.format('UPDATE ?? SET match_player_statistics_id = ? WHERE whoscored_match_player_statistics_id = ?',['whoscored_match_player_statistics_relation',id,rows[0].id]))
                                } else {
                                    return Promise.resolve();
                                }
                            })
                        })
                    })
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