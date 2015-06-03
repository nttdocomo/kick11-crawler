var spawn = require('child_process').spawn;
module.exports = function (command, args, options){
	return new Promise(function(resolve,reject){
		var child_process = spawn(command, args, options)
		child_process.on('exit', function (code,signal) {
		    resolve(code,signal)
		});
		child_process.on('error',function(code,signal){
		    reject(code,signal)
		    child_process.kill(signal);
		});

	    child_process.stdout.setEncoding('utf8');
	    child_process.stdout.on('data', function (data) {
	        console.log('stdout: ' + data);
	    });
	    child_process.stderr.on('data', function (data) {
	    	console.log('stderr: ' + data);
	    });
	})
}