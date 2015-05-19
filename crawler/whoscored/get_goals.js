/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
moment = require('moment'),
moment_tz = require('moment-timezone');
module.exports = function(matchCentre2, match_id){
    var playerIdNameDictionary = matchCentre2.playerIdNameDictionary,
    events = matchCentre2.events,
    goals_events = events.filter(function(event){
        return event.type.value == 16;
    })
    return goals_events.reduce(function(sequence,event){
        return sequence.then(function(){
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
            return excute(mysql.format('SELECT 1 FROM whoscored_match_events WHERE id = ? LIMIT 1',[eventId])).then(function(rows){
                var goal = {};
                if(event.hasOwnProperty('isOwnGoal') && event.isOwnGoal){
                    goal.owngoal = event.isOwnGoal;
                }
                if(rows.length){
                    return excute(mysql.format('UPDATE whoscored_match_events SET ? WHERE id = ?',[{
                        player_id:player_id,
                        match_id:match_id,
                        team_id:team_id,
                        minute:minute,
                        offset:offset,
                        updated_at:moment.utc().format('YYYY-MM-DD hh:mm:ss')
                    },eventId])).then(function(){
                        goal.updated_at = moment.utc().format('YYYY-MM-DD hh:mm:ss');
                        return excute(mysql.format('UPDATE whoscored_goals SET ? WHERE event_id = ?',[goal,eventId]))
                    });
                } else {
                    return excute(mysql.format('INSERT INTO whoscored_match_events SET ?',{
                        id:eventId,
                        player_id:player_id,
                        match_id:match_id,
                        team_id:team_id,
                        minute:minute,
                        offset:offset,
                        created_at:moment.utc().format('YYYY-MM-DD hh:mm:ss')
                    })).then(function(){
                        goal.event_id = eventId;
                        goal.created_at = moment.utc().format('YYYY-MM-DD hh:mm:ss')
                        return excute(mysql.format('INSERT INTO whoscored_goals SET ?',goal))
                    });
                }
            });
        })
    },promise.resolve())
};