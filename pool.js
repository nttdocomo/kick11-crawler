/**
 * @author nttdocomo
 */
var mysql = require('mysql');
module.exports = mysql.createPool({
	connectionLimit : 2,
	host : 'localhost',
	user : 'root',
	database : 'kickeleven',
	password : ''
});