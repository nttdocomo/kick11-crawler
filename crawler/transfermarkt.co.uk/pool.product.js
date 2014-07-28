/**
 * @author nttdocomo
 */
var mysql = require('mysql');
module.exports = mysql.createPool({
	connectionLimit : 1,
	host : 'localhost',
	user : 'root',
	database : 'kickeleven',
	password : '82Gz827m'
});