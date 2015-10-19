/**
 * @author nttdocomo
 */
var mysql = require('mysql'),
pool = require('../crawler/transfermarkt.co.uk/pool'),
excute  = require('../crawler/transfermarkt.co.uk/excute');
module.exports = function(){
	function getPlayerProfile(){
		excute("SELECT player_ref_id,position FROM `transfermarkt_player` WHERE player_ref_id != 0",function(result){
			result.forEach(getPositionId)
		});
	}
	function getPositionId(result){
		var sql = mysql.format("SELECT id FROM `position` WHERE name = ?",[result.position]);
		excute(sql,function(result){
		    if(result.length){
		    	getPlayerPosition(result.player_ref_id,result[0].id);
		    }
		});
	}
	function getPlayerPosition(player_id,position_id){
		var sql = mysql.format("SELECT 1 FROM `player2position` WHERE player_id = ? AND position_id = ?",[player_id,position_id]);
		excute(sql,function(result){
			if(!result.length){
		    	inserPlayerPosition(player_id,position_id)
		    }
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