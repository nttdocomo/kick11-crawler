/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),
moment = require('moment'),moment_tz = require('moment-timezone');
module.exports = function(match,date){
    var stage_id = match[0],
    match_id = match[1],
    team1_id = match[4],
    team2_id = match[8],
    play_at = moment.tz([date,match[3]].join(' '),"Europe/London").utc().format('YYYY-MM-DD HH:mm'),
    score = match[12];
    return excute(mysql.format('SELECT 1 FROM whoscored_matches WHERE id = ? LIMIT 1',[match_id])).then(function(rows){
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
            return excute(mysql.format('INSERT INTO whoscored_matches  SET ?', values));
        } else {
            return excute(mysql.format('UPDATE whoscored_matches  SET ? WHERE id = ?', [values,match_id]));
        }
    });
};