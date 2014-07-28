/**
 * @author nttdocomo
 */
var http = require("http"), cheerio = require('cheerio'),Crawler = require("simplecrawler"),StringDecoder = require('string_decoder').StringDecoder;
var mysql = require('mysql');
var pool  = mysql.createPool({
	connectionLimit : 2,
	host : 'localhost',
	user : 'root',
	database : 'kickeleven',
	password : ''
});
pool.getConnection(function(err, connection) {
	var host = 'http://www.transfermarkt.co.uk'
	crawler = new Crawler('www.transfermarkt.co.uk');
	crawler.maxConcurrency = 10;
	crawler.interval = 300;
	crawler.timeout = 5000;
	crawler.discoverResources = false;
	crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
	crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
		console.log(queueItem.path);
	    console.log('fetchcomplete');
	    var decoder = new StringDecoder('utf8'),
	    $ = cheerio.load(decoder.write(responseBuffer)),
	    team_id = $('#submenue > li').eq(1).find('a').attr('href').replace(/^\/\S+?\/startseite\/verein\/(\d+?)(\/\S+)?$/,'$1');
		$('#yw1 >table > tbody > tr').each(function(index,element){
			var player_id = $(element).find('td').eq(1).find('.spielprofil_tooltip').attr('id');
			pool.getConnection(function(err, connection) {
				var sql = mysql.format("INSERT INTO transfermarket_team_player (team_id, player_id) SELECT ? FROM dual WHERE NOT EXISTS(SELECT team_id,player_id FROM transfermarket_team_player WHERE team_id = ? AND player_id = ?)", [[team_id,player_id],team_id,player_id]);
				connection.query(sql, function(err) {
				    if (err) throw err;
				    connection.release()
				});
			});
		})
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
		return !(/[\.png|\.css|\.js](\?\S+)?$/i.test(parsedURL.path)) && /^\/\S+?\/startseite\/verein\/\d+?$/i.test(parsedURL.path);
	});
	connection.query("SELECT profile_uri FROM `transfermarkt_team` WHERE profile_uri IS NOT NULL ORDER BY id DESC", function(err,rows) {
	    if (err) throw err;
	    for (var i = rows.length - 1; i >= 0; i--) {
	    	crawler.queueURL(host + rows[i].profile_uri);
	    };
	    crawler.start();
	});
});