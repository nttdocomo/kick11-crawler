/**
 * @author nttdocomo
 */
var http = require("http"), pool = require('../pool');
pool.getConnection(function(err, connection) {
	connection.query("SELECT id, profile_uri FROM `transfermarket_team`", function(err,rows) {
	    if (err) throw err;
	    connection.release();
	    rows.forEach(update_profile_uri)
	});
});
function update_profile_uri(row){
	pool.getConnection(function(err, connection) {
		connection.query("UPDATE `transfermarket_team` SET profile_uri = ? WHERE id = ?", [row.profile_uri.replace(/(^\/\S+?\/startseite\/verein\/\d+?)(\/saison_id\/\d{4})?$/,'$1'),row.id], function(err) {
		    if (err) throw err;
		    connection.release();
		});
	});
}