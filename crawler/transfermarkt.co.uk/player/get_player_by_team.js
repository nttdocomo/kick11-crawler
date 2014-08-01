/**
 * @author nttdocomo
 */
var http = require("http"), cheerio = require('cheerio'),connection = require("../db"), mysql = require('mysql'),StringDecoder = require('string_decoder').StringDecoder,Team = require('../team/model'),
Player = require('./model'),
trim = require('../utils').trim,
pool  = require('../pool'),
Crawler = require("simplecrawler"),
host = 'http://www.transfermarkt.co.uk',
crawler = new Crawler('www.transfermarkt.co.uk');
crawler.maxConcurrency = 10;
crawler.interval = 500;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.customHeaders = {
	Cookie:'__qca=P0-912270038-1403184571295; 22ea10c3df12eecbacbf5e855c1fc2b3=4b2f77b042760e0b6c4403263173b81a02199e1da%3A4%3A%7Bi%3A0%3Bs%3A6%3A%22561326%22%3Bi%3A1%3Bs%3A9%3A%22nttdocomo%22%3Bi%3A2%3Bi%3A31536000%3Bi%3A3%3Ba%3A0%3A%7B%7D%7D; POPUPCHECK=1406040912765; PHPSESSID=kjuus3jlq0md5vhhq0hn2p7571; __utma=1.264986923.1403184483.1406010530.1406012399.139; __utmb=1.1.10.1406012399; __utmc=1; __utmz=1.1405646456.117.3.utmcsr=transfermarkt.com|utmccn=(referral)|utmcmd=referral|utmcct=/wettbewerbe/national/wettbewerbe/26'
};
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8'),sql,
    $ = cheerio.load(decoder.write(responseBuffer)),
    team,player;
    if(/^\/\S+?\/startseite\/verein\/\d+?(\/saison_id\/\d{4})?$/i.test(queueItem.path)){
	    team = new Team($);
	    //team.save_team_player(pool)
	    //team.update_team_player(pool)
	    team.get_player_url().forEach(function(url){
	    	if(/^\/\S+\/nationalmannschaft\/spieler\/\d{1,6}$/.test(url)){
	    		url = url.replace(/nationalmannschaft/,'profil')
	    	};
	    	crawler.queueURL(host + url);
	    });
    	//team.save(pool);
    }
    if(/^\/\S+\/profil\/spieler\/\d{1,6}$/.test(queueItem.path)){
	    player = new Player($);
	    player.save(pool);
    }
}).on('complete',function(){
	console.log('complete');
}).on('fetcherror',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
}).on('fetchclienterror',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
});
pool.getConnection(function(err, connection) {
	//connection.query("SELECT id, profile_uri FROM transfermarket_team WHERE id IN (13,131,367,368,418,621,681,714,897,940,993,1049,1050,1084,1531,1533,3302,3368,3709,16795)", function(err,rows) {
	connection.query("SELECT profile_uri FROM transfermarket_team WHERE id = 631", function(err,rows) {
	    if (err) throw err;
	    for (var i = rows.length - 1; i >= 0; i--) {
		    var path = rows[i].profile_uri;
		    path = path.replace(/(^\/\S+?\/startseite\/verein\/\d+?)(\/saison_id\/\d{4})?$/,'$1')
	    	crawler.queueURL(host + path);
	    };
	    connection.release();
	    crawler.start();
	});
});