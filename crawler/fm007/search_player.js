/**
 * @author nttdocomo
 */
var http = require("http"), fs = require('fs'),cheerio = require('cheerio'),mysql = require('mysql'),Crawler = require("simplecrawler"), iconv = require('iconv-lite'),
excute  = require('../transfermarkt.co.uk/excute'),
host = 'http://www.fm007.cn',
crawler = new Crawler('www.fm007.cn');
crawler.maxConcurrency = 5;
crawler.interval = 500;
crawler.timeout = 10000;
crawler.discoverResources = false;
crawler.customHeaders = {
	'Origin':'http://www.fm007.cn',
	'Referer':'http://www.fm007.cn/plus/advancedsearch.php',
	Cookie:'__jsluid=04e253bbc893f601e1096b4b0b31d2f3; bdshare_firstime=1410320794889; PHPSESSID=bf7048e9d2c411dec27ffdfe71883239; Hm_lvt_2a3619f63b6e3da4ff55beb8426793ab=1410320794; Hm_lpvt_2a3619f63b6e3da4ff55beb8426793ab=1410334745; _ga=GA1.2.1390366866.1410320795'
}
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.103 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var $ = cheerio.load(iconv.decode(responseBuffer, 'GBK'));
	//console.log(decoder.write(responseBuffer));
    var id = $('.name.ico_player_tit').text().replace(/^UID\.(\d{1,10}).+/,'$1').replace(/\n/ig,'').replace(/\s/ig,''),
    name = $('.name.ico_player_tit').text().replace(/^UID\.\d{1,10}\s\-\s(.+?)\s\-.+/,'$1').replace(/\n/ig,'').replace(/\s{2,}/ig,'');
    //console.log([id,name].join('-'))
    excute(mysql.format("SELECT id FROM player WHERE name = ?",[name]),function(result){
    	if(result.length && result.length == 1 && id != '0'){
    		excute(mysql.format("INSERT INTO `fm_player` SET ?",{fm_player_id:id,player_id:result[0].id}))
    	}
    })
}).on('complete',function(){
	console.log('complete');
}).on('fetcherror',function(queueItem, response){
	console.log('fetcherror')
	//crawler.queueURL(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
	//console.log('fetchtimeout');
	//crawler.queueURL(host + queueItem.path);
}).on('fetchclienterror',function(queueItem, errorData){
	console.log('fetchclienterror')
	//crawler.queueURL(host + queueItem.path);
});
excute("CREATE TABLE IF NOT EXISTS `fm_player` (\
	`id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
	`fm_player_id` int(10) unsigned NOT NULL,\
	`player_id` int(10) unsigned NOT NULL,\
	PRIMARY KEY (`id`)\
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;");
excute("SELECT name FROM player WHERE id NOT IN (SELECT player_id FROM `fm_player`)",function(rows) {
    rows.forEach(function(player){
    	crawler.queueURL(host + '/player/'+player.name.split(' ').join('-') + '.html');
    })
    crawler.start();
})
/*
crawler.queueURL(host + '/player/'+'Aaron Lennon'.split(' ').join('-') + '.html');
crawler.start();
var post_data = querystring.stringify({
	'mid':17,
	'dopost':'search',
	'name' : 'Aaron Lennon'
});
var options = {
	hostname: 'www.fm007.cn',
	port: 80,
	path: '/plus/advancedsearch.php',
	method: 'POST',
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': post_data.length,
		'Host':'www.fm007.cn',
		'Origin':'http://www.fm007.cn',
		'Referer':'http://www.fm007.cn/plus/advancedsearch.php',
		'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.103 Safari/537.36'
	}
};
var content = '';
var req = http.request(options, function(res) {
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
		content += chunk;
	});
	res.on('end', function () {
		var $ = cheerio.load(content),
		$results = $('.table_s1').find('table tr');
		if($results.length && $results.length == 1){
			console.log($results.find('td').first().find('a').attr('href'));
			crawler.queueURL(host + $results.find('td').first().find('a').attr('href'));
		}
		crawler.start();
	});
});

req.on('error', function(e) {
	console.log('problem with request: ' + e.message);
});
req.write(post_data);
req.end();*/
//crawler.queueURL(host + '/Search/?t=Willy+Caballero');