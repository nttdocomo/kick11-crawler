/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql');
module.exports = function(matchCentre2, match_id){
    var away = matchCentre2.away,
    home = matchCentre2.home,
    //teamId
    players = away.players.concat(home.players);
    return players.reduce(function(sequence, player){
        return sequence.then(function(){
            var team_id = player.field == "away" ? away.teamId : home.teamId;
            return excute(mysql.format('SELECT 1 FROM whoscored_registration WHERE match_id = ? AND player_id = ? LIMIT 1',[match_id,player.playerId])).then(function(rows){
                if(!rows.length){
                    return excute(mysql.format('INSERT INTO `whoscored_registration` SET ?',{
                        match_id:match_id,
                        player_id:player.playerId,
                        shirt_no:player.shirtNo,
                        team_id:team_id,
                        is_first_eleven:player.isFirstEleven ? true:false,
                        is_man_of_the_match:player.isManOfTheMatch
                    }));
                } else {
                    return excute(mysql.format('UPDATE `whoscored_registration` SET ? WHERE match_id = ? AND player_id = ?',[{
                        shirt_no:player.shirtNo,
                        team_id:team_id,
                        is_first_eleven:player.isFirstEleven ? true:false,
                        is_man_of_the_match:player.isManOfTheMatch
                    },match_id,player.playerId]));
                }
            })
        })
    },Promise.resolve())
};