/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql');
module.exports.get_team_by_id = function(id){
    return excute(mysql.format('SELECT 1 FROM whoscored_teams WHERE id = ?',[id]));
};