/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
difference = require('../../utils').difference,
BaseModel = require('../../model'),
Model = BaseModel.extend({
    tableName:'whoscored_registration',
    is_exist:function(){
        return excute(mysql.format('SELECT 1 FROM '+this.tableName+' WHERE match_id = ? AND player_id = ? LIMIT 1',[match_id,player.playerId])).then(function(row){
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
Model.excute = excute;
Model.get_uncomplete_matches = function(){
    return excute('SELECT id,play_at AS play_date FROM whoscored_match WHERE score1 IS NULL AND score2 IS NULL ORDER BY play_at ASC');
};
Model.all = function(){
    return excute('SELECT * FROM whoscored_match ORDER BY play_at ASC');
};
Model.get_registration = function(matchCentre2, whoscored_match_id){
    var away = matchCentre2.away,
    home = matchCentre2.home,
    players = away.players.concat(home.players);
    return excute(mysql.format('SELECT match_id FROM `whoscored_match_match` WHERE whoscored_match_id = ? LIMIT 1',[whoscored_match_id])).then(function(row){
        var match_id;
        if(row.length){
            match_id = row[0].match_id;
        }
        return players.reduce(function(sequence, player){
            var team_id = player.field == "away" ? away.teamId : home.teamId,
            player_id = player.playerId,
            data = {
                match_id:whoscored_match_id,
                player_id:player_id,
                shirt_no:player.shirtNo,
                team_id:team_id,
                is_first_eleven:player.isFirstEleven ? true:false,
                is_man_of_the_match:player.isManOfTheMatch
            },
            //registration = new Model(data);
            promise = sequence.then(function(){
                return excute(mysql.format('SELECT id FROM `whoscored_match_registration` WHERE match_id = ? AND player_id = ? LIMIT 1',[match_id,player.playerId]))
                /*var team_id = player.field == "away" ? away.teamId : home.teamId;
                return registration.save();*/
            }).then(function(row){
                if(!row.length){
                    return excute(mysql.format('INSERT INTO `whoscored_match_registration` SET ?',data))
                }
                return Promise.resolve();
            })
            if(row.length){
                match_id = data.match_id = row[0].match_id;
                promise.then(function(){
                    return excute(mysql.format('SELECT player_id FROM `whoscored_player_player` WHERE whoscored_player_id = ? LIMIT 1',[player_id]))
                }).then(function(row){
                    player_id = data.player_id = row[0].player_id;
                    return excute(mysql.format('SELECT team_id FROM `whoscored_team_team` WHERE whoscored_team_id = ? LIMIT 1',[team_id]))
                }).then(function(row){
                    team_id = data.team_id = row[0].team_id;
                    return excute(mysql.format('SELECT 1 FROM `match_registration` WHERE team_id = ? AND player_id = ? AND match_id = ? LIMIT 1',[team_id,player_id,match_id]))
                }).then(function(row){
                    if(!row.length){
                        return excute(mysql.format('INSERT INTO `match_registration` SET ?',data))
                    }
                    return Promise.resolve();
                })
            }
            return promise
        },Promise.resolve())
    })
};
module.exports = Model