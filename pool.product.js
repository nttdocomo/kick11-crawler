/**
 * @author nttdocomo
 */
var mysql = require('mysql');
module.exports = mysql.createPool({
	connectionLimit : 1,
	host : '10.96.78.32',
	user : 'root',
	database : 'database_development',
	password : 'password'
})