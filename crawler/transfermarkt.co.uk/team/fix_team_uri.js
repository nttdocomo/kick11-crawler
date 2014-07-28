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
    console.log('fetchcomplete');
    var decoder = new StringDecoder('utf8'),
    $ = cheerio.load(decoder.write(responseBuffer)),
    club_url = $('#submenue > li').eq(1).find('a').attr('href').replace(/(\S+)\/\S+\/\d{4}$/,'$1')
    team_id = club_url.replace(/^\/\S+?\/startseite\/verein\/(\d+?)(\/\S+)?$/,'$1'),
	sql = mysql.format("UPDATE transfermarkt_team SET profile_uri = ? WHERE id = ? AND profile_uri IS NULL",[club_url,team_id]);
	connection.query(sql, function(err, result) {
	    if (err) throw err;
	    console.log(result.changedRows)
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
connection.query("SELECT id FROM `transfermarkt_team` WHERE profile_uri IS NULL", function(err,rows) {
    if (err) throw err;
    for (var i = rows.length - 1; i >= 0; i--) {
    	crawler.queueURL(host + '/1-fc-saarbrucken/startseite/verein/' + rows[i].id);
    };
    crawler.start();
});