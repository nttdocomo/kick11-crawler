/**
 * @author nttdocomo
 */
var excute = require('../../excute'),mysql = require('mysql'),asyncLoop = require('../../asyncLoop');
module.exports = function(content, match_id){
    var matchCentre2 = JSON.parse(content);
    if(matchCentre2 !== null){
        var away = matchCentre2.away,
        home = matchCentre2.home,
        //teamId
        players = away.players.concat(home.players);
        asyncLoop(players.length, function(loop){
            var player = players[loop.iteration()],
            team_id = player.field == "away" ? away.teamId : home.teamId;
            excute(mysql.format('INSERT INTO `whoscored_registration` SET ?',{
                match_id:match_id,
                player_id:player.playerId,
                shirt_no:player.shirtNo,
                team_id:team_id,
                is_first_eleven:player.isFirstEleven ? true:false,
                is_man_of_the_match:player.isManOfTheMatch
            }),function(){
                loop.next()
            });
        },function(){})
    }
};