/**
 * @author nttdocomo
 */
var mysql = require('mysql'), connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	database : 'kickeleven',
	password : ''
});
module.exports = connection;