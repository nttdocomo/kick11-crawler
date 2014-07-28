/**
 * @author nttdocomo
 */
var fs = require('fs'),path = require('path');
var mkdirs = function(dirpath, mode, callback) {
	fs.exists(dirpath, function(exists) {
		if (exists) {
			callback(dirpath);
		} else {
			//尝试创建父目录，然后再创建当前目录
			mkdirs(path.dirname(dirpath), mode, function() {
				fs.mkdir(dirpath, mode, callback);
			});
		}
	});
};
module.exports = mkdirs;