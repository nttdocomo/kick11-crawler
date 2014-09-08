/**
 * @author nttdocomo
 */
var pool = require('./pool');
module.exports = function (sql,callback){
	pool.getConnection(function(err, connection) {
		connection.query(sql, function(err,result) {
		    if (err) throw err;
		    connection.release();
		    callback && callback(result);
		});
	});
}