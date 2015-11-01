/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
difference = require('../../utils').difference,
Model = require('../../model'),
Event = Model.extend({
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
Event.table = 'whoscored_event';
Event.get_seasons_by_tournament = function($,tournament_id){
    var options = $('#seasons').find("option");
    options = _.map(options,function(option){
        return option;
    })
    return options.reduce(function(sequence,option){
        var id = $(option).val().replace(/^\/\S+\/(\d+?)$/,'$1'),
        name = $(option).text(),
        year = name.replace(/(\d{4})\/\d{4}/,'$1');
        return sequence.then(function(){
            return excute(mysql.format('SELECT id FROM `whoscored_season` WHERE name = ?',[name]))
        }).then(function(season){
            if(season.length){
                return excute(mysql.format('SELECT 1 FROM `whoscored_event` WHERE id = ?',[id])).then(function(row){
                    if(row.length){
                        return excute(mysql.format('UPDATE `whoscored_event` SET ? WHERE id = ?',[{
                            tournament_id:tournament_id,
                            season_id:season[0].id
                        },id]))
                    } else {
                        return excute(mysql.format('INSERT INTO `whoscored_event` SET ?',{
                            id:id,
                            tournament_id:tournament_id,
                            season_id:season[0].id
                        }))
                    }
                })
            } else {
                return excute(mysql.format('INSERT INTO `whoscored_season` SET ?',{
                    name:name,
                    year:year
                })).then(function(result){
                    return excute(mysql.format('SELECT 1 FROM `whoscored_event` WHERE id = ?',[id])).then(function(row){
                        if(row.length){
                            return excute(mysql.format('UPDATE `whoscored_event` SET ? WHERE id = ?',[{
                                tournament_id:tournament_id,
                                season_id:result.insertId
                            },id]))
                        } else {
                            return excute(mysql.format('INSERT INTO `whoscored_event` SET ?',{
                                id:id,
                                tournament_id:tournament_id,
                                season_id:result.insertId
                            }))
                        }
                    })
                })
            }
        }).catch(function(err){
            console.log(err)
        })
    },Promise.resolve())
};
Event.get_event_by_tournament = function(events){
    return events.reduce(function(sequence, item){
        var event = new Season({
            id:item[6]
        })
        return sequence.then(function(){
            return event.save();
        });
    },Promise.resolve())
};
module.exports = Event;