/**
 * @author nttdocomo
 */
var http = require("http"), cheerio = require('cheerio'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),moment = require('moment'),
Transfer = require('./model'),Crawler = require("simplecrawler"),
Team = require('../team/model'),
pool  = require('../pool'),
host = 'http://www.transfermarkt.co.uk';
crawler = new Crawler('www.transfermarkt.co.uk');
crawler.maxConcurrency = 10;
crawler.interval = 300;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.customHeaders = {
	Cookie:'__qca=P0-912270038-1403184571295; 22ea10c3df12eecbacbf5e855c1fc2b3=4b2f77b042760e0b6c4403263173b81a02199e1da%3A4%3A%7Bi%3A0%3Bs%3A6%3A%22561326%22%3Bi%3A1%3Bs%3A9%3A%22nttdocomo%22%3Bi%3A2%3Bi%3A31536000%3Bi%3A3%3Ba%3A0%3A%7B%7D%7D; POPUPCHECK=1406040912765; PHPSESSID=kjuus3jlq0md5vhhq0hn2p7571; __utma=1.264986923.1403184483.1406010530.1406012399.139; __utmb=1.1.10.1406012399; __utmc=1; __utmz=1.1405646456.117.3.utmcsr=transfermarkt.com|utmccn=(referral)|utmcmd=referral|utmcct=/wettbewerbe/national/wettbewerbe/26'
}
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
var transfers = [];
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8');
    if(/^\/\S+?\/startseite\/verein\/\d+?$/i.test(queueItem.path)){//competition
    	var team = new Team(cheerio.load(decoder.write(responseBuffer)));
    	team.save()
    };
}).on('complete',function(){
	console.log('complete');
}).on('fetcherror',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
}).on('fetchclienterror',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
});
/*crawler.queueURL(host + '/cristiano-ronaldo/transfers/spieler/8198');
crawler.start();*/
pool.getConnection(function(err, connection) {
	connection.query("SELECT DISTINCT taking_team_id FROM transfermarket_transfer WHERE taking_team_id NOT IN (SELECT id FROM `transfermarket_team`)", function(err,rows) {
	    if (err) throw err;
	    connection.release();
	    for (var i = rows.length - 1; i >= 0; i--) {
	    	crawler.queueURL(host + '/arsenal-fc/startseite/verein/' + rows[i].taking_team_id);
	    };
	});
});
pool.getConnection(function(err, connection) {
	connection.query("SELECT DISTINCT releasing_team_id FROM transfermarket_transfer WHERE releasing_team_id NOT IN (SELECT id FROM `transfermarket_team`)", function(err,rows) {
	    if (err) throw err;
	    connection.release();
	    for (var i = rows.length - 1; i >= 0; i--) {
	    	crawler.queueURL(host + '/arsenal-fc/startseite/verein/' + rows[i].releasing_team_id);
	    };
	    crawler.start();
	});
});