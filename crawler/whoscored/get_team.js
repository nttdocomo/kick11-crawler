/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
asyncLoop = require('../../asyncLoop');
module.exports = function(match,fn){
    var team1_id = match[4],
    team1_name = match[5],
    team2_id = match[8],
    team2_name = match[9];
    if(!fn(team1_id)){
        return excute(mysql.format('INSERT INTO whoscored_teams (id,name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_teams WHERE id = ?)', [[team1_id,team1_name],team1_id]));
    }
    if(!fn(team2_id)){
        return excute(mysql.format('INSERT INTO whoscored_teams (id,name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_teams WHERE id = ?)', [[team2_id,team2_name],team2_id]));
    }
};