/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
difference = require('../../crawler/transfermarkt.co.uk/utils').difference,
update_event_standings = require('../kick11/event_standings').update_event_standings,
Model = require('../../model'),
Match = Model.extend({
	table:'whoscored_match',
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
Match.excute = excute;
Match.table = 'whoscored_match';
Match.get_whoscored_match_match = function(whoscored_match_id,match_id){
    return excute(mysql.format('SELECT 1 FROM `whoscored_match_match` WHERE whoscored_match_id = ? LIMIT 1',[whoscored_match_id])).then(function(row){
        if(!row.length){
            return excute(mysql.format('INSERT INTO `whoscored_match_match` SET ?',{
                match_id:match_id,
                whoscored_match_id:whoscored_match_id
            })) 
        }
        return Promise.resolve();
    })
}
Match.insert_whoscored_match = function(data){
    return excute(mysql.format('INSERT INTO `whoscored_match` SET ?',data))
}
Match.update_match = function(whoscored_match,match){
    var data = {
        'score1' : whoscored_match.score1,
        'score2' : whoscored_match.score2
    },sequence = excute(mysql.format('UPDATE `match` SET ? WHERE id = ?',[data,match[0].id])).then(function(){
        return Match.get_whoscored_match_match(whoscored_match.id,match[0].id)
    });
    return sequence/*.then(function(){
        return excute(mysql.format('SELECT round_id FROM `match` WHERE id = ? LIMIT 1',[match[0].id])).then(function(match){
            return excute(mysql.format('SELECT event_id FROM `round` WHERE id = ? LIMIT 1',[match.round_id]));
        }).then(function(round){

        })
    })*/.then(function(){
        return Match.event_standing(match[0].team1_id)
    }).then(function(){
        return Match.event_standing(match[0].team2_id)
    })
}
Match.insert_match = function(match){
    var team1_id,team2_id;
    return excute(mysql.format('SELECT team_id FROM `whoscored_team_team` WHERE whoscored_team_id = ? LIMIT 1',[match.team1_id])).then(function(row){
        team1_id = row[0].team_id;
        return excute(mysql.format('SELECT team_id FROM `whoscored_team_team` WHERE whoscored_team_id = ? LIMIT 1',[match.team2_id]))
    }).then(function(row){
        team2_id = row[0].team_id;
        var data = _.extend(_.pick(match,'play_at','score1','score2'),{
            team1_id:team1_id,
            team2_id:team2_id
        })
        return excute(mysql.format('INSERT INTO `match` SET ?',data)).then(function(result){
            return Match.get_whoscored_match_match(match.id,result.insertId)
        })
        //return excute(mysql.format('SELECT * FROM `match` WHERE team1_id = ? AND team2_id = ? AND play_at = ? LIMIT 1',[team1_id,team2_id,match.play_at]))
    })/*.then(function(){
        return Match.event_standing(team1_id)
    }).then(function(){
        return Match.event_standing(team2_id)
    })*/.catch(function(err){
        console.log(err)
    })
}
Match.get_match = function(match){
    return excute(mysql.format('SELECT 1 FROM `whoscored_match` WHERE id = ? LIMIT 1',[match.id])).then(function(row){
    	if(!row.length){
    		return Match.insert_match(match).then(function(){
                return Match.insert_whoscored_match(match)
            }).catch(function(){
                return Match.insert_whoscored_match(match)
    		})
    	}
        return excute(mysql.format('SELECT match_id FROM `whoscored_match_match` WHERE whoscored_match_id = ? LIMIT 1',[match.id])).then(function(row){
            if(!row.length){
                return Match.insert_match(match).catch(function(){
                    return Promise.resolve()
                })
            }
            return excute(mysql.format('SELECT * FROM `match` WHERE id = ? LIMIT 1',[row[0].match_id])).then(function(row){
                return Match.update_match(match,row)
            })
        })
    });
};
Match.event_standing = function(team_id){
    return excute(mysql.format('SELECT event_id FROM `event_team` WHERE team_id = ? LIMIT 1',[team_id])).then(function(event_team){
        console.log(event_team.length+'121212')
        if(event_team.length){
            var event_id = event_team[0].event_id;
            return excute(mysql.format('SELECT id FROM `event_standings` WHERE event_id = ? LIMIT 1',[event_id])).then(function(event_standings){
                if(!event_standings.length){
                    return excute(mysql.format('INSERT INTO `event_standings` SET ?',{
                        event_id:event_id
                    })).then(function(result){
                        return result.insertId
                    })
                }
                return event_standings[0].id
            }).then(function(event_standing_id){
                return excute(mysql.format('SELECT id FROM `event_standing_entries` WHERE event_standing_id = ? AND team_id = ? LIMIT 1',[event_standing_id,team_id])).then(function(event_standing_entries){
                    var pts = played = won = lost = drawn = goals_for = goals_against = 0;
                    return excute(mysql.format('SELECT * FROM `match` WHERE round_id IN (SELECT id FROM `round` WHERE event_id = ?) AND (team1_id = ? OR team2_id = ?) AND score1 IS NOT NULL AND score2 IS NOT NULL',[event_id,team_id,team_id])).then(function(matches){
                        return matches.reduce(function(sequence,match){
                            played += 1;
                            if(match.score1 == match.score2){
                                pts += 1;
                                drawn += 1;
                                if(match.team1_id == team_id){
                                    goals_for += match.score1;
                                    goals_against += match.score2;
                                }
                                if(match.team2_id == team_id){
                                    goals_for += match.score2;
                                    goals_against += match.score1;
                                }
                            } else {
                                console.log([match.score1,match.score2].join(':'))
                                if(match.team1_id == team_id){
                                    goals_for += match.score1;
                                    goals_against += match.score2;
                                    if(match.score1 > match.score2){
                                        pts += 3;
                                        won += 1;
                                    }
                                    if(match.score1 < match.score2){
                                        lost += 1;
                                    }
                                }
                                if(match.team2_id == team_id){
                                    goals_for += match.score2;
                                    goals_against += match.score1;
                                    if(match.score1 > match.score2){
                                        lost += 1;
                                    }
                                    if(match.score1 < match.score2){
                                        pts += 3;
                                        won += 1;
                                    }
                                }
                            }
                            return sequence;
                        },Promise.resolve())
                    }).then(function(){
                        if(event_standing_entries.length){
                            return excute(mysql.format('UPDATE `event_standing_entries` SET ? WHERE id = ?',[{
                                "team_id":team_id,
                                "pts":pts,
                                "played":played,
                                "won":won,
                                "lost":lost,
                                "drawn":drawn,
                                "goals_for":goals_for,
                                "goals_against":goals_against
                            },event_standing_entries[0].id]))
                        } else {
                            return excute(mysql.format('INSERT INTO `event_standing_entries` SET ?',{
                                "event_standing_id":event_standing_id,
                                "team_id":team_id,
                                "pts":pts,
                                "played":played,
                                "won":won,
                                "lost":lost,
                                "drawn":drawn,
                                "goals_for":goals_for,
                            }))
                        }
                    })
                }).then(function(){
                    return update_event_standings(event_standing_id)
                })
            })
        }
        return Promise.resolve()
    })
}
Match.get_uncomplete_matches = function(){
    return excute('SELECT id,play_at AS play_date FROM whoscored_match WHERE score1 IS NULL AND score2 IS NULL ORDER BY play_at ASC');
};
Match.all = function(){
    return excute('SELECT * FROM whoscored_match ORDER BY play_at ASC');
};
module.exports.get_match_by_id = function(id){
    return excute(mysql.format('SELECT 1 FROM whoscored_match WHERE id = ?',[id]));
};
module.exports = Match;