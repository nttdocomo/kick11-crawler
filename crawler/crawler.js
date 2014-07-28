/**
 * @author nttdocomo
 */
var http = require("http");
var fs = require('fs');

var url = "http://s3.amazonaws.com/massrel-pub/fifa14/fifa14-all-data.json";
var data = "";

var parsePlayer = function(players){
	for(var i = 0,len = players.length; i < len; i++){
		var player = players[i]
	};
	fs.writeFile('./players.json',resultBuffer,function(err){
        if(err) throw err;
        console.log('has finished');
    });
};

// 创建一个请求
var req = http.request(url, function(res) {
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
		parsePlayer(JSON.parse(data).players);
	});
});

// 发送请求
req.end(); 