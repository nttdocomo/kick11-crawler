/**
 * @author nttdocomo
 */
var fs = require('fs'),mysql = require('mysql'),
excute  = require('../transfermarkt.co.uk/excute'),StringDecoder = require('string_decoder').StringDecoder;
/*charaterMap = {'á':'a',
'ä':'a',
'à':'a',
'Á':'A',
'í':'i',
'î':'i',
'ö':'o',
'ó':'o',
'Ö':'O',
'é':'e',
'ë':'e',
'ê':'e',
'è':'e',
'É':'E',
'ü':'u',
'ñ':'n'};
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
});*/
excute("CREATE TABLE IF NOT EXISTS `fm_player` (\
	`id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
	`fm_player_id` int(10) unsigned NOT NULL,\
	`player_id` int(10) unsigned NOT NULL,\
	PRIMARY KEY (`id`)\
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;");
fs.readFile('./22222.csv',function(err,data){
	var decoder = new StringDecoder('utf8'),
	lines = decoder.write(data).split(/\r\n/);
	excute("SELECT name,id FROM player WHERE id NOT IN (SELECT player_id FROM `fm_player`)",function(rows) {
		var inserts = [];
	    rows.forEach(function(player){
	    	var name = player.name;
			lines.forEach(function(line,i){
				if(i>0 && line){
					var result = line.split(/\;/),
					player_name = result[0].replace(/"/g,'').replace(/(\w+?),\s(\w+)/g,'$2 $1'),
					id = result[2].replace(/"/g,'');
					if(player_name == name){
						inserts.push([id,player.id]);
						//excute(mysql.format("INSERT INTO `fm_player` SET ?",{fm_player_id:id,player_id:player.id}));
						//console.log(mysql.format("INSERT INTO `fm_player` SET ?",{fm_player_id:id,player_id:player.id}))
						return false;
					}
				}
			});
	    })
		excute(mysql.format("INSERT INTO `fm_player`(fm_player_id,player_id) VALUES ?",[inserts]));
	})
})