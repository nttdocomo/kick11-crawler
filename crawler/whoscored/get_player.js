/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql');
module.exports = function(matchCentre2){
    var away = matchCentre2.away,
    home = matchCentre2.home,
    players = home.players.concat(away.players);
    return players.reduce(function(sequence, player){
        return sequence.then(function(){
            return excute(mysql.format('SELECT 1 FROM whoscored_player WHERE id = ? LIMIT 1',[player_id])).then(function(rows){
                var data = {
                    name:player.name,
                    height:player.height,
                    weight:player.weight
                }
                if(rows.length){
                    return excute(mysql.format('UPDATE `whoscored_player` SET ? WHERE id = ?',[data,player.playerId]));
                    //excute(mysql.format('UPDATE whoscored_player SET ? WHERE id = ?',[{name:playerIdNameDictionary[id]},id]))
                } else {
                    data.id = player.playerId;
                    return excute(mysql.format('INSERT INTO whoscored_player SET ?',data))
                }
            });
        })
    },Promise.resolve())
};