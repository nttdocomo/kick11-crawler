/**
 * @author nttdocomo
 */
var http = require("http"), cheerio = require('cheerio'),connection = require("../db"), mysql = require('mysql'),StringDecoder = require('string_decoder').StringDecoder,Player = require('./model'),
pool  = mysql.createPool({
	connectionLimit : 2,
	host : 'localhost',
	user : 'root',
	database : 'kickeleven',
	password : ''
}),
Crawler = require("simplecrawler"),
host = 'http://www.transfermarkt.co.uk'
crawler = new Crawler('www.transfermarkt.co.uk');
crawler.maxConcurrency = 10;
crawler.interval = 600;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
	console.log(queueItem.path);
    console.log('fetchcomplete');
    var decoder = new StringDecoder('utf8'),
    $ = cheerio.load(decoder.write(responseBuffer)),
    player = new Player($);
	console.log('get player ' + player.full_name);
	pool.getConnection(function(err, connection) {
    	player.update_date_of_birth(connection);
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
});
pool.getConnection(function(err, connection) {
	connection.query("SELECT profile_uri FROM `transfermarkt_player` WHERE date_of_birth = '0000-00-00' AND profile_uri IS NOT NULL ORDER BY id ASC", function(err,rows) {
	    if (err) throw err;
	    for (var i = rows.length - 1; i >= 0; i--) {
	    	crawler.queueURL(host + rows[i].profile_uri);
	    };
	    connection.release();
	    crawler.start();
	});
});