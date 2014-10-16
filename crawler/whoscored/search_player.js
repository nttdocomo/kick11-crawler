/**
 * @author nttdocomo
 */
var http = require("http"), cheerio = require('cheerio'),excute = require('../transfermarkt.co.uk/excute'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),moment = require('moment'),pool  = require('../transfermarkt.co.uk/pool'),
Crawler = require("simplecrawler");
host = 'http://www.whoscored.com';
crawler = new Crawler('www.whoscored.com');
crawler.maxConcurrency = 2;
crawler.interval = 300;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8'),$ = cheerio.load(decoder.write(responseBuffer)),table = $('.search-result').find("h2:contains('Players:')"),player_id,player_name;
    if(table.length){
    	player_id = table.next().find('tr').eq(1).find('td').eq(0).find('a').attr('href').replace(/\S+?\/(\d+?)\/$/,"$1")
    	player_name = table.next().find('tr').eq(1).find('td').eq(0).find('a').text();
    	pool.getConnection(function(err, connection) {
			connection.query("SELECT id FROM player WHERE name = ?", [player_name], function(err,rows) {
			    if (err) throw err;
			    connection.release();
			    if(rows.length){
			    	if(rows.length == 1){
				    	var sql = mysql.format("INSERT INTO player_player (player1_id,player2_id) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM player_player WHERE player1_id = ?)", [[rows[0].id,player_id],rows[0].id]);
						pool.getConnection(function(err, connection) {
							connection.query(sql, function(err) {
							    if (err) throw err;
							    connection.release();
							});
						});
			    	} else {
				    	rows.forEach(function(row){
				    		console.log([player_name,row.id,player_id].join('-----'));
				    		moreThanOnePlayer.push(player_id);
				    	})
			    	}
			    } else {
			    	unfoundId.push(player_id)
			    }
			});
		});
    } else {
    	unfoundPath.push(queueItem.path)
    }
}).on('complete',function(){
	console.log('complete');
	console.log(unfoundPath)
	console.log(unfoundId)
}).on('fetcherror',function(queueItem, response){
	console.log('fetcherror')
	crawler.queueURL(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
	console.log('fetchtimeout')
	crawler.queueURL(host + queueItem.path);
}).on('fetchclienterror',function(queueItem, errorData){
	console.log('fetchclienterror')
	crawler.queueURL(host + queueItem.path);
	console.log(queueItem.path)
});
excute("CREATE TABLE IF NOT EXISTS `whoscored_player_player` (\
	`id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
	`whoscored_player_id` int(10) unsigned NOT NULL,\
	`player_id` int(10) unsigned NOT NULL,\
	PRIMARY KEY (`id`)\
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;");
excute("SELECT name FROM player WHERE id NOT IN (SELECT player_id FROM whoscored_player_player)", function(rows) {
    if (err) throw err;
    connection.release();
    rows.forEach(function(player){
    	//console.log(player.name.split(' ').join('+'))
    	crawler.queueURL(host + '/Search/?t='+player.name.split(' ').join('+'));
    })
    crawler.start();
});
//crawler.queueURL(host + '/Search/?t=Willy+Caballero');
//crawler.start();