/**
 * @author nttdocomo
 */
var fs = require('fs'), cheerio = require('cheerio'),excute = require('../transfermarkt.co.uk/excute'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),moment = require('moment'),moment_tz = require('moment-timezone'),
pool  = require('../transfermarkt.co.uk/pool'),moment = require('moment'),
input_match_id = process.argv[2],
host = 'http://www.whoscored.com';
module.exports = function(queueItem, responseBuffer, response, match_id){
    var decoder = new StringDecoder('utf8'),
    matchCentre2 = JSON.parse(decoder.write(responseBuffer));
    if(matchCentre2 !== null){
        var playerIdNameDictionary = matchCentre2.playerIdNameDictionary,
        events = matchCentre2.events,
        goals_events = events.filter(function(event){
            return event.type.value == 16;
        })
        for (id in playerIdNameDictionary) {
            excute(mysql.format('SELECT 1 FROM whoscored_player WHERE id = ? LIMIT 1',[id]),function(rows){
                if(rows.length){
                    excute(mysql.format('UPDATE whoscored_player SET ? WHERE id = ?',[{name:playerIdNameDictionary[id]},id]))
                } else {
                    excute(mysql.format('INSERT INTO whoscored_player (id,name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_player WHERE id = ?)',[[id,playerIdNameDictionary[id]],id]))
                }
            });
        };
        goals_events.forEach(function(event){
            var eventId = event.id,
            minute = event.minute,
            team_id = event.teamId,
            player_id = event.playerId,
            player_name = playerIdNameDictionary[player_id],
            period = event.period,
            offset = 0;
            if(period.value == 1 && minute > 45){
                offset = minute - 45
                minute = 45;
            }
            if(period.value == 2 && minute > 90){
                offset = minute - 90
                minute = 90;
            }
            /*excute(mysql.format('SELECT 1 FROM whoscored_player WHERE id = ? LIMIT 1',[player_id]),function(rows){
                if(rows.length){
                    excute(mysql.format('UPDATE whoscored_player SET ? WHERE id = ?',[{name:player_name},player_id]))
                } else {
                    excute(mysql.format('INSERT INTO whoscored_player SET ?',{id:player_id,name:player_name}))
                }
            });*/
            //INSERT EVENT
            excute(mysql.format('SELECT 1 FROM whoscored_match_events WHERE id = ? LIMIT 1',[eventId]),function(rows){
                var goal = {};
                if(event.hasOwnProperty('isOwnGoal') && event.isOwnGoal){
                    goal.owngoal = event.isOwnGoal;
                }
                if(rows.length){
                    excute(mysql.format('UPDATE whoscored_match_events SET ? WHERE id = ?',[{
                        player_id:player_id,
                        match_id:match_id,
                        team_id:team_id,
                        minute:minute,
                        offset:offset,
                        updated_at:moment.utc().format('YYYY-MM-DD hh:mm:ss')
                    },eventId]));
                    goal.updated_at = moment.utc().format('YYYY-MM-DD hh:mm:ss');
                    excute(mysql.format('UPDATE whoscored_goals SET ? WHERE event_id = ?',[goal,eventId]))
                } else {
                    excute(mysql.format('INSERT INTO whoscored_match_events SET ?',{
                        id:eventId,
                        player_id:player_id,
                        match_id:match_id,
                        team_id:team_id,
                        minute:minute,
                        offset:offset,
                        created_at:moment.utc().format('YYYY-MM-DD hh:mm:ss')
                    }));
                    goal.event_id = eventId;
                    goal.created_at = moment.utc().format('YYYY-MM-DD hh:mm:ss')
                    excute(mysql.format('INSERT INTO whoscored_goals SET ?',goal))
                }
            });
        })
    }
};