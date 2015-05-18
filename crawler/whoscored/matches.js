/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql');
module.exports.get_match_by_id = function(id){
    return excute(mysql.format('SELECT 1 FROM whoscored_matches WHERE id = ?',[id]));
};