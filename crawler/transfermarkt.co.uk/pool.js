/**
 * @author nttdocomo
 */
var mysql = require('mysql');
module.exports = mysql.createPool({
	connectionLimit : 1,
	host : 'localhost',
	user : 'root',
	database : 'kickeleven1.0',
	password : ''
});