/**
 * @author nttdocomo
 */
var http = require("http"), fs = require('fs'), cheerio = require('cheerio'), url = require('url'), path = require('path'),
mysql = require('mysql'),
connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database: 'kickeleven',
  password : ''
});

connection.connect();
mkdirs = function(dirpath, mode, callback) {
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

var request_url = "http://www.transfermarkt.co.uk/wettbewerbe/national/wettbewerbe/2";
var data = "";

var options = {
	hostname:'www.transfermarkt.co.uk',
	path: '/wettbewerbe/national/wettbewerbe/2',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36'
    }
};
var parseNation = function($) {
	var options = $('#land_select_breadcrumb').children();
	var values = [];
	options.each(function(index, element) {
		var id = $(element).val(), name = $(element).text();
		if(name && id){
			values.push([name,parseInt(id)]);
		}
	});
	var sql = "INSERT INTO transfermarkt_nation (name, nation_id) VALUES ?";
	var query = connection.query(sql, [values], function(err) {
	    if (err) throw err;
	    connection.end();
	});
};

// 创建一个请求
var req = http.get(options, function(res) {
	// 设置显示编码
	res.setEncoding("utf8");
	var url_parts = url.parse(request_url),
	folder_path = url_parts.path.replace(/^\//,''),
	file_path = folder_path + '/index.html';
	// 数据是 chunked 发送，意思就是一段一段发送过来的
	// 我们使用 data 给他们串接起来
	res.on('data', function(chunk) {
		data += chunk;
	});
	// 响应完毕时间出发，输出 data
	res.on('end', function() {
		// dealData(data);
		mkdirs(folder_path, 0776, function() {
			fs.open(file_path, 'w', 0666, function(e, fd) {
				if (e) {
					//console.log('错误信息：' + e);
				} else {
					fs.write(fd, data, 0, 'utf8', function(e) {
						if (e) {
							console.log('出错信息：' + e);
						} else {
							fs.closeSync(fd);
						}
					});
				}
			});
		});
		parseNation(cheerio.load(data));
	});
});

// 发送请求
req.end();
