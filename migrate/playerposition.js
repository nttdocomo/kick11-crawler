/**
 * @author nttdocomo
 */
var mysql = require('mysql'),
var pool = require('../crawler/transfermarkt.co.uk/pool'),
excute  = require('../crawler/transfermarkt.co.uk/excute');
module.exports = function(){
	function getPlayerProfile(){
		var sql = "SELECT player_ref_id,position FROM `transfermarket_player` WHERE player_ref_id != 0";
		pool.getConnection(function(err, connection) {
			connection.query(sql, function(err,rows) {
			    if (err) throw err;
			    connection.release();
			    rows.forEach(getPositionId)
			});
		});
	}
	function getPositionId(result){
		var sql = mysql.format("SELECT id FROM `position` WHERE name = ?",[result.position]);
		pool.getConnection(function(err, connection) {
			connection.query(sql, function(err,rows) {
			    if (err) throw err;
			    connection.release();
			    if(rows.length){
			    	getPlayerPosition(result.player_ref_id,rows[0].id);
			    }
			});
		});
	}
	function getPlayerPosition(player_id,position_id){
		var sql = mysql.format("SELECT 1 FROM `player2position` WHERE player_id = ? AND position_id = ?",[player_id,position_id]);
		pool.getConnection(function(err, connection) {
			connection.query(sql, function(err,rows) {
			    if (err) throw err;
			    connection.release();
			    if(!rows.length){
			    	inserPlayerPosition(player_id,position_id)
			    }
			});
		});
	}
	function inserPlayerPosition(player_id,position_id){
		excute(mysql.format("INSERT INTO `player2position` SET ?",{
    		'player_id':player_id,
    		'position_id':position_id
    	}));
	}
	getPlayerProfile();
};