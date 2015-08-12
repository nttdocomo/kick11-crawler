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
Registration = Model.extend({
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
Registration.excute = excute;
Registration.get_uncomplete_matches = function(){
    return excute('SELECT id,play_at AS play_date FROM whoscored_matches WHERE score1 IS NULL AND score2 IS NULL ORDER BY play_at ASC');
};
Registration.all = function(){
    return excute('SELECT * FROM whoscored_matches ORDER BY play_at ASC');
};
module.exports.get_registration = function(matchCentre2, match_id){
    var away = matchCentre2.away,
    home = matchCentre2.home,
    players = away.players.concat(home.players);
    return players.reduce(function(sequence, player){
        var team_id = player.field == "away" ? away.teamId : home.teamId,
        data = {
            match_id:match_id,
            player_id:player.playerId,
            shirt_no:player.shirtNo,
            team_id:team_id,
            is_first_eleven:player.isFirstEleven ? true:false,
            is_man_of_the_match:player.isManOfTheMatch
        },
        registration = new Registration(data);
        return sequence.then(function(){
            var team_id = player.field == "away" ? away.teamId : home.teamId;
            return registration.save();
        })
    },Promise.resolve())
};