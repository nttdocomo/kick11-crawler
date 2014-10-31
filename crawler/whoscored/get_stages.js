/**
 * @author nttdocomo
 */
var fs = require('fs'), cheerio = require('cheerio'),excute = require('../transfermarkt.co.uk/excute'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),
moment = require('moment'),moment_tz = require('moment-timezone');
module.exports = function(stages,date){
	stages.forEach(function(stage){
		var stage_id = stage[0],
        region_id = stage[1],
        region_short_name = stage[2],
        region_name = stage[3],
        tournament_id = stage[4],
        tournament_short_name = stage[5],
        tournament_name = stage[7],
        season_id = stage[6];
        excute(mysql.format('INSERT INTO whoscored_regions (id,name,short_name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_regions WHERE id = ?)', [[region_id,region_name,region_short_name],region_id]));
        excute(mysql.format('INSERT INTO whoscored_tournaments (id,region_id,name,short_name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_tournaments WHERE id = ?)', [[tournament_id,region_id,tournament_name,tournament_short_name],tournament_id]));
        excute(mysql.format('INSERT INTO whoscored_seasons (id) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_seasons WHERE id = ?)', [[season_id],season_id]));
        excute(mysql.format('INSERT INTO whoscored_stages (id,tournament_id,season_id) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_stages WHERE id = ?)', [[stage_id,tournament_id,season_id],stage_id]));
	})
};