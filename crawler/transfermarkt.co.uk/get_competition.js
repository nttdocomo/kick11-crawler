/**
 * @author nttdocomo
 */
var http = require("http"), fs = require('fs'), cheerio = require('cheerio'), url = require('url'), path = require('path'),
connection = require("./db"), mkdirs = require("./mkdirs");
connection.connect();
var competition_types = [],competitions = [],uniq_type={};
get_comprtition_type = function($){
	var competition_type;
	$('.items > tbody > tr').each(function(index,element){
		var $element = $(element);
		if($element.hasClass('odd') || $element.hasClass('even')){
			competitions.push([$element.find('a[title]').attr('title'),$element.find('a[title]').attr('href').replace(/.+?\/(\w+)$/,'$1'),competition_type,$element.find('.zentriert > img').attr('title')]);
		} else {
			/*console.log($element.hasClass('odd') || $element.hasClass('even'));
			console.log($element.find(' > td').text());*/
			competition_type = $element.find(' > td').text();
			if(!uniq_type[competition_type]){
				competition_types.push([competition_type]);
				uniq_type[competition_type] = 1;
			}
		}
	});
},
get_or_read_file = function(request_url,callback){
	var options = {
		hostname:'www.transfermarkt.co.uk',
		path: '/wettbewerbe/national',
	    headers: {
	        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36'
	    },
	    agent:false
	};
	options.path = request_url;
	var folder_path = request_url.replace(/^\/(\w+?\/\w+?)\?\S+?\=(\d+?)$/,'$1'),
	file_path = request_url.replace(/^\/(\w+?\/\w+?)\?\S+?\=(\d+?)$/,'$1/$2.html'),
	data = "";
	/*console.log(request_url);
	console.log(folder_path);
	console.log(file_path);*/
	fs.readFile(file_path,{encoding:"utf8"},function(err, data){
    	if (err) {
        	var req = http.get(options, function(res) {
				// 设置显示编码
				res.setEncoding("utf8");
				// 数据是 chunked 发送，意思就是一段一段发送过来的
				// 我们使用 data 给他们串接起来
				res.on('data', function(chunk) {
					data += chunk;
				});
				// 响应完毕时间出发，输出 data
				res.on('end', function() {
					// dealData(data);
					callback(data);
					mkdirs(folder_path, 0776, function() {
						fs.open(file_path, 'w', 0666, function(e, fd) {
							if (e) {
								console.log('错误信息：' + e);
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
				});
			}).on('error', function(e) {
				console.log("Got error: " + e.message);
			});
			req.end();
		} else {
			console.log('a');
			callback(data);
		}
    });
},
request_page = function(){
	var i = 15,j=0;
	for(var k = 1; k < 16; k++){
		get_or_read_file('/wettbewerbe/national?ajax=yw1&page=' + k,function(data){
        	get_comprtition_type(cheerio.load(data));
        	i--;
        	var sql,query;
        	if(!i){
				connection.query("INSERT INTO transfermarkt_competition_type (type_name) VALUES ?", [competition_types], function(err) {
				    if (err) throw err;
				    if(j == 1){
				    	connection.end();
				    }
				    j++;
				});
				connection.query("INSERT INTO transfermarkt_competition (competition_name,competition_id,competition_type,nation_name) VALUES ?", [competitions], function(err) {
				    if (err) throw err;
				    if(j == 1){
				    	connection.end();
				    }
				    j++;
				});
        	}
		});
	}
};
request_page();
