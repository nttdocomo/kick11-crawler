/**
 * @author nttdocomo
 */
const pool = require('./pool');
module.exports = function (sql){
	return new Promise(function(resolve,reject){
		pool.getConnection(function(err, connection) {
			if(err){
				console.log(sql)
			}
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