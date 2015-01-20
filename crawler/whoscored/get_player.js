/**
 * @author nttdocomo
 */
var excute = require('../../excute'),mysql = require('mysql'),asyncLoop = require('../../asyncLoop');
module.exports = function(content,fn){
    var matchCentre2 = JSON.parse(content);
    if(matchCentre2 !== null){
        var away = matchCentre2.away,
        home = matchCentre2.home,
        players = home.players.concat(away.players);
        players.forEach(function(player){
            var player_id = player.playerId;
            if(!fn(player_id)){
                excute(mysql.format('SELECT 1 FROM whoscored_player WHERE id = ? LIMIT 1',[player_id]),function(rows){
                    if(rows.length){
                        excute(mysql.format('UPDATE `whoscored_player` SET ? WHERE id = ?',[{
                            name:player.name,
                            height:player.height,
                            weight:player.weight
                        },player_id]));
                        //excute(mysql.format('UPDATE whoscored_player SET ? WHERE id = ?',[{name:playerIdNameDictionary[id]},id]))
                    } else {
                        excute(mysql.format('INSERT INTO whoscored_player SET ?',{
                            id:player_id,
                            name:player.name,
                            height:player.height,
                            weight:player.weight
                        }))
                    }
                });
            }
        })
    }
};