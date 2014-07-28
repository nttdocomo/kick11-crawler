/**
 * @author nttdocomo
 */
var http = require("http"), cheerio = require('cheerio'),StringDecoder = require('string_decoder').StringDecoder,
Player = require('./model'),Crawler = require("simplecrawler"),
pool  = require('../pool'),
host = 'http://www.transfermarkt.co.uk';
crawler = new Crawler('www.transfermarkt.co.uk');
crawler.maxConcurrency = 10;
crawler.interval = 300;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8'),
    player;
    if(/^\/\S+\/profil\/spieler\/\d{1,6}$/.test(queueItem.path)){
	    player = new Player(cheerio.load(decoder.write(responseBuffer)));
	    player.update(pool);
    }
}).on('complete',function(){
	console.log('complete');
});
pool.getConnection(function(err, connection) {
	connection.query("SELECT profile_uri FROM transfermarket_player WHERE height IS NULL ORDER BY id DESC", function(err,rows) {
	    if (err) throw err;
	    for (var i = rows.length - 1; i >= 0; i--) {
		    var path = rows[i].profile_uri;
	    	crawler.queueURL(host + path);
	    };
	    connection.release();
	    crawler.start();
	});
});
