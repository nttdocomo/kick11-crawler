/**
 * @author nttdocomo
 */
var http = require("http"), fs = require('fs'), cheerio = require('cheerio'), url = require('url'), path = require('path'),
connection = require("./db"), mysql = require('mysql'), mkdirs = require("./mkdirs");
connection.connect();
var get_clubs = function($){
	var competition = $('.spielername-profil').text().replace(/^\s+|\s+$/g,''),clubs = [];
	//nation_name = $('.flagge .flaggenrahmen').attr('title');
	var $item = $('.items').first();
	$item.find('> tbody > tr').each(function(index,element){
		var $element = $(element).children().first().find('a'),
		club_id = $element.attr('href').replace(/\S+\/(\d{1,})\/\S+\/\d{4}$/g,'$1');
		//sql = mysql.format("INSERT INTO transfermarkt_club (club_name,club_id,competition,uri) SELECT ? FROM dual WHERE NOT EXISTS(SELECT club_id FROM transfermarkt_club WHERE club_id = ?)", [[$element.attr('title'),club_id,competition],club_id,$element.attr('href')]);
		var sql = mysql.format("UPDATE transfermarkt_club SET uri = ? WHERE club_id = ?", [$element.attr('href'),club_id]);
		//console.log(sql);
		connection.connect();
		connection.query(sql, function(err) {
		    if (err) throw err;
		    connection.end();
		});
		//clubs.push([$element.attr('title'),$element.attr('href').replace(/\S+\/(\d{1,})\/\S+\/\d{4}$/g,'$1'),competition]);
	});
	//return clubs;
},
get_or_read_file = function(request_url,callback){
	var options = {
		hostname:'www.transfermarkt.co.uk',
		path: '/wettbewerbe/national',
	    headers: {
	        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36'
	    },
	    agent:false
	},
	folder_path = request_url.replace(/^\//,''),
	file_path = folder_path + '/index.html',
	content = "";
	options.path = request_url;
	fs.readFile(file_path,{encoding:"utf8"},function(err, data){
    	if (err) {
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
					callback(content);
					mkdirs(folder_path, 0776, function() {
						fs.open(file_path, 'w', 0666, function(e, fd) {
							if (e) {
								console.log('错误信息：' + e);
							} else {
								fs.write(fd, content, 0, 'utf8', function(e) {
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
			callback(data);
		}
    });
};
connection.query('SELECT competition_name, competition_id FROM transfermarkt_competition;', function(err, rows, fields) {
    if (err) throw err;
    var values = [];
    for(var k = 0; k < rows.length; k++){
    	// 创建一个请求
    	(function(i){
    		var competition_name = rows[i].competition_name, competition_id = rows[i].competition_id,
	    	request_url = '/'+competition_name.replace(/(\s+?\-\s+?)|(\.\s)|\s|\./g,'-').replace(/'/g,'').toLowerCase()+'/startseite/wettbewerb/'+competition_id+'/saison_id/2013';
			get_or_read_file(request_url,function(data){
				get_clubs(cheerio.load(data));
			});
    	})(k);
    }
    connection.end();
});
