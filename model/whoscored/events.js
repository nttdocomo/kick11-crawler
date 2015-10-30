/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
difference = require('../transfermarkt.co.uk/utils').difference,
Model = require('../../model'),
Event = Model.extend({
    tableName:'whoscored_match_events',
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
Event.table = 'whoscored_match_events';
Event.all = function(){
    return excute('SELECT * FROM whoscored_matches ORDER BY play_at ASC');
};
Event.get_event_by_tournament = function($){
    var options = $('#seasons').find("option");
    options = _.map(options,function(option){
        return option;
    })
    return options.reduce(function(sequence,option){
        var id = $(option).val().replace(/^\/\S+\/(\d+?)$/,'$1'),
        name = $(option).text(),
        year = name.replace(/(\d{4})\/\d{4}/,'$1');
        return sequence.then(function(){
            return excute(mysql.format('SELECT 1 FROM `whoscored_season` WHERE id = ?',[id]))
            return excute(mysql.format('SELECT 1 FROM `whoscored_event` WHERE id = ?',[id]))
        }).then(function(row){
            if(row.length){
                return excute(mysql.format('UPDATE `whoscored_event` SET ? WHERE id = ?',[{
                    name:name,
                    year:year
                },id]))
            } else {
                return excute(mysql.format('INSERT INTO `whoscored_event` SET ?',[{
                    id:id,
                    name:name,
                    year:year
                },id]))
            }
        })
    },Promise.resolve())
};
module.exports.get_match_by_id = function(id){
    return excute(mysql.format('SELECT 1 FROM whoscored_match_events WHERE id = ?',[id]));
};
module.exports.get_events = function(matchCentre2, match_id){
    var matchCentre2 = JSON.parse(matchCentre2),
    playerIdNameDictionary = matchCentre2.playerIdNameDictionary,
    events = matchCentre2.events;
    if(events.length){
        return events.reduce(function(sequence,event){
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
                };
                var data = {
                    id : eventId,
                    player_id:player_id,
                    match_id:match_id,
                    team_id:team_id,
                    minute:minute,
                    offset:offset,
                    updated_at:moment.utc().format('YYYY-MM-DD hh:mm:ss')
                };
                var match_event = new Event(data);
                return match_event.save();
            })
        },Promise.resolve())
    }
};
module.exports = Event;