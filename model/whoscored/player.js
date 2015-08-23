/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
difference = require('../../crawler/transfermarkt.co.uk/utils').difference,
Model = require('../../model'),
Player = Model.extend({
    tableName:'whoscored_player',
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
Player.excute = excute;
Player.table = 'whoscored_player';
Player.all = function(){
    return excute('SELECT * FROM whoscored_player ORDER BY play_at ASC');
};
Player.get_player = function(matchCentre2){
    var matchCentre2 = JSON.parse(matchCentre2),
    away = matchCentre2.away,
    home = matchCentre2.home,
    players = home.players.concat(away.players);
    return players.reduce(function(sequence, player){
        var data = {
            id :player.playerId,
            name:player.name,
            height:player.height,
            weight:player.weight
        },
        person = new Player(data);
        return sequence.then(function(){
            return person.save();
        })
    },Promise.resolve())
};
module.exports = Player;