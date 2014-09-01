/**
 * @author nttdocomo
 */
var http = require("http"), mysql = require('mysql'),
pool  = require('../pool'),
sql = "INSERT INTO `player2position`(player_id,position_id) SELECT transfermarket_player.player_ref_id,position.id FROM `position` JOIN `transfermarket_player` ON transfermarket_player.position = position.name WHERE CONCAT(transfermarket_player.player_ref_id,'-',position.id) NOT IN (SELECT CONCAT(player_id,'-',position_id) FROM `player2position`) AND transfermarket_player.player_ref_id != 0";
pool.getConnection(function(err, connection) {
	connection.query(sql, function(err,result) {
	    if (err) throw err;
	    connection.release();
	    console.log('deleted ' + result.affectedRows + ' rows');
	});
});