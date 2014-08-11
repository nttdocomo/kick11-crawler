var trim = require('../utils').trim,connection = require("../db"), mysql = require('mysql'),moment = require('moment'),pool  = require('../pool'),
Season = function($){
	this.$ = $;
	var season = $("select[name='saison_id']").find("option:selected").text();
	if(/\d{2}\/\d{2}/.test(season)){
		season = 20 + season;
	}
	this.season = season;
};
Team.prototype = {
	save:function(callback){
		var sql = mysql.format("INSERT INTO season (name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT name FROM seasons WHERE name = ?)", [[this.season],this.season]);
		pool.getConnection(function(err, connection) {
			connection.query(sql, function(err,result) {
			    if (err) throw err;
			    connection.release();
			    this.id = result.insertId;
			    callback(result.insertId);
			});
		});
		return this.is_club_team && this.team_id == this.club_id;
	},
	get_id:function(callback){
		var me = this, sql = mysql.format("SELECT id FROM seasons WHERE name = ?", [this.season]);
		pool.getConnection(function(err, connection) {
			connection.query(sql, function(err,rows) {
			    if (err) throw err;
			    if(!rows.length){
			    	me.save(callback)
			    } else {
			    	callback(rows[0].id);
			    }
			    connection.release();
			});
		});
	}
}