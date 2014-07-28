/**
 * @author nttdocomo
 */
var http = require("http"), fs = require('fs'), cheerio = require('cheerio'), url = require('url'), path = require('path'),
connection = require("db"), mkdirs = require("mkdirs");
connection.connect();
var options = {
	hostname:'www.transfermarkt.co.uk',
	path: '/wettbewerbe/national/wettbewerbe/2',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36'
    },
    agent:false
};
connection.query('SELECT name, nation_id FROM transfermarkt_nation;', function(err, rows, fields) {
    if (err) throw err;
    var values = [];
    for(var k = 0; k < rows.length; k++){
    	// 创建一个请求
    	(function(i){
    		var nation_name = rows[i].name, nation_id = rows[i].nation_id,
	    	content = "",
	    	request_url = '/wettbewerbe/national/wettbewerbe/'+nation_id,
			folder_path = request_url.replace(/^\//,''),
			file_path = folder_path + '/index.html',
			save = function(){
				var value = parseNationTeam(cheerio.load(content));
				for(var j = 0; j < value.length; j++){
					value[j].push(nation_id)
				}
				values = values.concat(value);
				var sql = "INSERT INTO transfermarkt_team (team_name, team_id, order_by,type,nation_id) VALUES ?";
				if(i == (rows.length - 1)){
					console.log(values);
					var query = connection.query(sql, [values], function(err) {
					    if (err) throw err;
					    connection.end();
					});
				}
			};
	    	options.path = request_url;
	    	console.log(file_path);
            fs.readFile(file_path,{encoding:"utf8"},function(err, data){
            	if (err) {
            		console.error(err);
		        	var req = http.get(options, function(res) {
						// 设置显示编码
						res.setEncoding("utf8");
						// 数据是 chunked 发送，意思就是一段一段发送过来的
						// 我们使用 data 给他们串接起来
						res.on('data', function(chunk) {
							content += chunk;
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
							save();
						});
					});
					req.end();
				} else {
	            	content = data;
	            	save();
				}
            });
    	})(k);
    }
});
var parseNationTeam = function($) {
	var options = $('.relevante-wettbewerbe-auflistung').find('a'),values = [];
	options.each(function(index, element) {
		var id = $(element).attr('href').match(/\/(\d+?)$/)[1], name = $(element).attr('title');
		if(name && id){
			values.push([name,parseInt(id),index,1]);
		}
	});
	return values;
};
