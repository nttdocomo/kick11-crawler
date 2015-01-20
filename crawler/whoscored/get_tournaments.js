/**
 * @author nttdocomo
 */
 var excute = require('../../excute'),mysql = require('mysql');
module.exports = function(stages,fn){
    stages.forEach(function(stage){
        var region_id = stage[1],
        tournament_id = stage[4],
        tournament_short_name = stage[5],
        tournament_name = stage[7];
        if(!fn(tournament_id)){
            excute(mysql.format('INSERT INTO whoscored_tournaments SET ?', {
                id:tournament_id,
                region_id:region_id,
                name:tournament_name,
                short_name:tournament_short_name
            }));
        }
    })
};