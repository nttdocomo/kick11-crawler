/**
 * @author nttdocomo
 */
var excute = require('../../excute'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),
moment = require('moment'),moment_tz = require('moment-timezone');
module.exports = function(matches,date){
	return matches.map(function(match){
		var stage_id = match[0],
            match_id = match[1],
            team1_id = match[4],
            team1_name = match[5],
            team2_id = match[8],
            team2_name = match[9],
            play_at = moment.tz([date,match[3]].join(' '),"Europe/London").utc().format('YYYY-MM-DD HH:mm'),
            score = match[12];
            excute(mysql.format('INSERT INTO whoscored_teams (id,name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_teams WHERE id = ?)', [[team1_id,team1_name],team1_id]));
            excute(mysql.format('INSERT INTO whoscored_teams (id,name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_teams WHERE id = ?)', [[team2_id,team2_name],team2_id]));
            excute(mysql.format('SELECT 1 FROM whoscored_matches WHERE id = ? LIMIT 1',[match_id]),function(rows){
                var values = {
                    'team1_id':team1_id,
                    'team2_id':team2_id,
                    'play_at':play_at,
                    'stage_id':stage_id
                };
                if(score != 'vs'){
                    values.score1 = score.split(/\s\:\s/)[0];
                    values.score2 = score.split(/\s\:\s/)[1];
                }
                if(!rows.length){
                    values.id = match_id;
                    excute(mysql.format('INSERT INTO whoscored_matches  SET ?', values));
                } else {
                    excute(mysql.format('UPDATE whoscored_matches  SET ? WHERE id = ?', [values,match_id]));
                }
            });
        return '/MatchesFeed/'+match_id+'/MatchCentre2';
	})
};