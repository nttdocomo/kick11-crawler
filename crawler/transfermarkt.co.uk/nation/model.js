/**
 * @author nttdocomo
 */
var trim = require('../utils').trim, mysql = require('mysql'),
Nation = function($){
	this.$ = $;
	this.nation_id = $('[data-placeholder="Country"]').val();
	this.nation_name = $('[data-placeholder="Country"] :selected').text();
};
Nation.prototype = {
	save:function(pool){
		var sql = mysql.format("INSERT INTO transfermarket_nation (name, id) SELECT ? FROM dual WHERE NOT EXISTS(SELECT nation_id FROM transfermarkt_nation WHERE id = ?)", [[nation_name,nation_id],nation_id]);
		pool.getConnection(function(err, connection) {
			connection.query(sql, function(err) {
			    if (err) throw err;
			    connection.release();
			});
		});
	}
}
module.exports = Nation;