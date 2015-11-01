/**
 * @author nttdocomo
 */
var mysql = require('mysql'),pool = require('./pool');
module.exports = function (sql){
	return new Promise(function(resolve,reject){
		pool.getConnection(function(err, connection) {
			connection.query(sql, function(err,result) {
			    connection.release();
			    if (err) {
			    	reject(err);
			    	//throw err;
			    } else {
			    	resolve(result)
			    }
			});
		});
	})
}