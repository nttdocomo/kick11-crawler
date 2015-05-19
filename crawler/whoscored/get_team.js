/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
team = require('./team');
module.exports = function(match){
    var team1_id = match[4],
    team1_name = match[5],
    team2_id = match[8],
    team2_name = match[9];
    return team.get_team_by_id(team1_id).then(function(rows){
        if(!rows.length){
            return excute(mysql.format('INSERT INTO whoscored_teams SET ?', {
                id:team1_id,
                name:team1_name
            }));
        }
    }).then(function(){
        return team.get_team_by_id(team2_id)
    }).then(function(rows){
        if(!rows.length){
            return excute(mysql.format('INSERT INTO whoscored_teams SET ?', {
                id:team2_id,
                name:team2_name
            }));
        }
    })
};