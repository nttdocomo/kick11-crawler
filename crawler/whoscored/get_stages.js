/**
 * @author nttdocomo
 */
var excute = require('../../excute'),mysql = require('mysql');
module.exports = function(stages,fn){
    stages.forEach(function(stage){
        var stage_id = stage[0],
        tournament_id = stage[4],
        season_id = stage[6];
        if(!fn(stage_id)){
            excute(mysql.format('INSERT INTO whoscored_stages SET ?', {
                id:stage_id,
                tournament_id:tournament_id,
                season_id:season_id
            }));
        }
        /*excute(mysql.format('INSERT INTO whoscored_regions (id,name,short_name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_regions WHERE id = ?)', [[region_id,region_name,region_short_name],region_id]));
        excute(mysql.format('INSERT INTO whoscored_tournaments (id,region_id,name,short_name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_tournaments WHERE id = ?)', [[tournament_id,region_id,tournament_name,tournament_short_name],tournament_id]));
        excute(mysql.format('INSERT INTO whoscored_seasons (id) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_seasons WHERE id = ?)', [[season_id],season_id]));
        excute(mysql.format('INSERT INTO whoscored_stages (id,tournament_id,season_id) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_stages WHERE id = ?)', [[stage_id,tournament_id,season_id],stage_id]));*/
    })
};