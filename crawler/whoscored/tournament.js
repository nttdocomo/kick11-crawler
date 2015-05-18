/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql');
module.exports.get_tournament_by_id = function(id){
    return excute(mysql.format('SELECT 1 FROM whoscored_tournaments WHERE id = ?',[id]));
};