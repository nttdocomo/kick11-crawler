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
Goal = Model.extend({
    tableName:'whoscored_goals',
    is_exist:function(){
        return excute(mysql.format('SELECT 1 FROM '+this.tableName+' WHERE event_id = ? LIMIT 1',[this.event_id])).then(function(row){
            return row.length;
        })
    },
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
Goal.excute = excute;
Goal.table = 'whoscored_goals';
Goal.all = function(){
    return excute('SELECT * FROM whoscored_goals');
};
module.exports.get_match_by_id = function(id){
    return excute(mysql.format('SELECT 1 FROM whoscored_goals WHERE id = ?',[id]));
};
module.exports.get_goals = function(matchCentre2, match_id){
    var playerIdNameDictionary = JSON.parse(matchCentre2).playerIdNameDictionary,
    events = matchCentre2.events,
    goals_events = events.filter(function(event){
        return event.type.value == 16;
    })
    if(goals_events.length){
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
                };
                var data = {
                    event_id : eventId
                };
                if(event.hasOwnProperty('isOwnGoal') && event.isOwnGoal){
                    data.owngoal = event.isOwnGoal;
                };
                var goal = new Goal(data);
                return goal.save();
            })
        },Promise.resolve())
    }
};
module.exports = Goal;