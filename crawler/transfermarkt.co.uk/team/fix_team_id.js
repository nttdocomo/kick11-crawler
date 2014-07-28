/**
 * @author nttdocomo
 */
var http = require("http"), cheerio = require('cheerio'),connection = require("../db"), mysql = require('mysql'),StringDecoder = require('string_decoder').StringDecoder;
connection.connect();
var Crawler = require("simplecrawler"),
host = 'http://www.transfermarkt.co.uk',
trim = function(text){
	return text.replace(/^\s+(.+?)\s+$/,'$1');
},
crawler = new Crawler('www.transfermarkt.co.uk');
crawler.maxConcurrency = 5;
crawler.interval = 300;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
	console.log(queueItem.path);
    console.log('fetchcomplete');
    var decoder = new StringDecoder('utf8'),sql,
    $ = cheerio.load(decoder.write(responseBuffer)),
    is_club_team = !$('#verknupftevereine > img').attr('class'),
    team_name = trim($('.spielername-profil').text().replace(/^\s+(.+?)\s+$/,'$1')),
    club_url = $('#submenue > li').eq(1).find('a').attr('href'),
	team_id = club_url.replace(/^\/\S+?\/startseite\/verein\/(\d+?)(\/\S+)?$/,'$1'),
    nation_id = $('[data-placeholder="Country"]').val(),
    club_id = $('#verknupftevereine > img').attr('src') && $('#verknupftevereine > img').attr('src').replace(/^\/\S+?\/(\d{1,6})\.png/,'$1');
	sql = mysql.format("UPDATE transfermarkt_team SET id = ? WHERE id = ?",[team_id,team_id]);
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
connection.query("SELECT profile_uri FROM `transfermarkt_team` WHERE profile_uri IS NOT NULL", function(err,rows) {
    if (err) throw err;
    for (var i = rows.length - 1; i >= 0; i--) {
    	crawler.queueURL(host + rows[i].profile_uri);
    };
    crawler.start();
});
