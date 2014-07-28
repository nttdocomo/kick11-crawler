/**
 * @author nttdocomo
 */
var http = require("http"), cheerio = require('cheerio'),connection = require("../db"), mysql = require('mysql'),StringDecoder = require('string_decoder').StringDecoder;
connection.connect();
var Crawler = require("simplecrawler"),
host = 'http://www.transfermarkt.co.uk'
crawler = new Crawler('www.transfermarkt.co.uk');
crawler.maxConcurrency = 10;
crawler.interval = 600;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
	console.log(queueItem.path);
	console.log(queueItem.path.replace(/\S+?\/(\d{1,9})$/,'$1'));
    console.log('fetchcomplete');
    var decoder = new StringDecoder('utf8'),
    player_id = queueItem.path.replace(/\S+?\/(\d{1,9})$/,'$1'),
    $ = cheerio.load(decoder.write(responseBuffer)),
    height = $('.profilheader').eq(0).find('tr').eq(3).find('td').text().replace(/(\d{1})\,(\d{2})\s+m$/,'$1$2'),
    sql = mysql.format("UPDATE transfermarkt_player SET height = ? WHERE height != ? AND id = ?",[height,height,player_id]);
	connection.query(sql, function(err) {
	    if (err) throw err;
	});
	sql = mysql.format("UPDATE player SET height = ? WHERE height != ? AND id = (SELECT player_ref_id FROM `transfermarkt_player` WHERE id = ?)",[height,height,player_id]);
	connection.query(sql, function(err) {
	    if (err) throw err;
	});
}).on("fetcherror",function(queueItem, response){
    console.log('fetcherror');
}).on("fetchstart",function(queueItem,requestOptions ){
	console.log('fetchstart');
}).on("fetchtimeout",function(queueItem, crawlerTimeoutValue){
	console.log(queueItem.path);
	console.log('fetchtimeout');
}).on("fetchclienterror",function(queueItem, errorData){
	console.log(queueItem.path);
	console.log('fetchclienterror');
}).addFetchCondition(function(parsedURL) {
	return !(/[\.png|\.css|\.js](\?\S+)?$/i.test(parsedURL.path)) && /^\/\S+\/profil\/spieler\/\d{1,6}$/.test(parsedURL.path);
});
connection.query("SELECT profile_uri FROM `transfermarkt_player` WHERE height < 100 AND profile_uri IS NOT NULL ORDER BY id DESC", function(err,rows) {
    if (err) throw err;
    for (var i = rows.length - 1; i >= 0; i--) {
    	crawler.queueURL(host + rows[i].profile_uri);
    };
    crawler.start();
});