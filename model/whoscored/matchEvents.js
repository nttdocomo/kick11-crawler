/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
difference = require('../../utils').difference,
EventType = require('./matchEventType');
Model = require('../../model'),
Event = Model.extend({
    tableName:'whoscored_match_event',
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
Event.excute = excute;
Event.table = 'whoscored_match_event';
Event.all = function(){
    return excute('SELECT * FROM whoscored_match ORDER BY play_at ASC');
};
module.exports.get_match_by_id = function(id){
    return excute(mysql.format('SELECT 1 FROM whoscored_match_events WHERE id = ?',[id]));
};
Event.save = function(data){
    return excute(mysql.format('SELECT 1 FROM ?? WHERE id = ? LIMIT 1',[Event.table,data.id])).then(function(row){
        if(!row.length){
            /*console.log(data.id)
            console.log(mysql.format('INSERT INTO ?? SET ?',[Event.table,data]))*/
            return excute(mysql.format('INSERT INTO ?? SET ?',[Event.table,data]))
        }
        return Promise.resolve();
    })
}
Event.get_events = function(matchCentre2, match_id){
    var playerIdNameDictionary = matchCentre2.playerIdNameDictionary,
    events = matchCentre2.events;
    if(events.length){
        return events.reduce(function(sequence,event){
            if(/\d+\.\d/.test(event.id)){
                return sequence;
            }
            var eventId = event.id,
            minute = event.minute,
            team_id = event.teamId,
            player_id = event.playerId,
            player_name = playerIdNameDictionary[player_id],
            period = event.period,
            event_type_value = event.type.value,
            match_event_type_id,
            offset = 0;
            if(period.value == 1 && minute > 45){
                offset = minute - 45
                minute = 45;
            }
            if(period.value == 2 && minute > 90){
                offset = minute - 90
                minute = 90;
            };
            var data = {
                id : eventId,
                player_id:player_id,
                match_id:match_id,
                team_id:team_id,
                minute:minute,
                offset:offset,
                updated_at:moment.utc().format('YYYY-MM-DD hh:mm:ss'),
                event_type_id:event_type_value
            };
            return sequence.then(function(){
                return EventType.get_event_type(event.type)
            }).then(function(){
                return Event.save(data);
            }).then(function(){
                return excute(mysql.format('SELECT player_id FROM `whoscored_player_player` WHERE whoscored_player_id = ? LIMIT 1',[player_id]))
                //return excute(mysql.format('SELECT id FROM `match_event` WHERE whoscored_match_event_id = ? LIMIT 1',[eventId]))
            }).then(function(row){
                if(!row.length){
                    return Promise.resolve();
                }
                player_id = row[0].player_id;
                return excute(mysql.format('SELECT team_id FROM `whoscored_team_team` WHERE whoscored_team_id = ? LIMIT 1',[team_id])).then(function(row){
                    if(!row.length){
                        return Promise.resolve();
                    }
                    team_id = row[0].team_id;
                    return excute(mysql.format('SELECT match_id FROM `whoscored_match_match` WHERE whoscored_match_id = ? LIMIT 1',[match_id])).then(function(row){
                        if(!row.length){
                            return Promise.resolve();
                        }
                        match_id = row[0].match_id;
                        return excute(mysql.format('SELECT match_event_type_id FROM `whoscored_match_event_type_relation` WHERE whoscored_match_event_type_id = ? LIMIT 1',[event_type_value])).then(function(row){
                            if(!row.length){
                                return Promise.resolve();
                            }
                            match_event_type_id = row[0].match_event_type_id;
                            return excute(mysql.format('SELECT id FROM `match_event` WHERE player_id = ? AND team_id = ? AND match_id = ? LIMIT 1',[player_id,team_id,match_id])).then(function(row){
                                if(!row.length){
                                    data.player_id = player_id;
                                    data.match_id = match_id;
                                    data.team_id = team_id;
                                    data.event_type_id = match_event_type_id;
                                    return excute(mysql.format('INSERT INTO `match_event` SET ?',data)).then(function(result){
                                        return result.insertId;
                                    })
                                }
                                return row[0].id
                            }).then(function(match_event_id){
                                return excute(mysql.format('SELECT 1 FROM `whoscored_match_event_match_event` WHERE whoscored_match_event_id = ? AND match_event_id = ? LIMIT 1',[eventId,match_event_id])).then(function(row){
                                    if(!row.length){
                                        return excute(mysql.format('INSERT INTO `whoscored_match_event_match_event` SET ?',{
                                            whoscored_match_event_id:eventId,
                                            match_event_id:match_event_id
                                        }))
                                    }
                                    return Promise.resolve();
                                })
                            })
                        })
                    })
                })
            }).catch(function(err){
                console.log(err)
                return Promise.resolve()
            })
        },Promise.resolve())
    }
    return Promise.resolve();
};
module.exports = Event;
