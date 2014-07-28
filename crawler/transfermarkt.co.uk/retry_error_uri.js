/**
 * @author nttdocomo
 */
var http = require("http"), fs = require('fs'), cheerio = require('cheerio'), url = require('url'), path = require('path'),
connection = require("./db"), mysql = require('mysql'),utils = require("./utils"),StringDecoder = require('string_decoder').StringDecoder;
var Crawler = require("simplecrawler");
var crawler = new Crawler("www.transfermarkt.co.uk");
crawler.maxConcurrency = 10;
crawler.interval = 600;
crawler.timeout = 5000;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
connection.query('SELECT uri FROM error_uri ORDER BY RAND() LIMIT 1', function(err,rows) {
    if (err) throw err;
    crawler.initialPath = rows[0].uri;
    crawler.start();
});
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
	console.log(queueItem.path);
    console.log('fetchcomplete');
    var decoder = new StringDecoder('utf8');
    var sql = mysql.format("INSERT INTO transfermarket_fetched_path (path) SELECT ? FROM dual WHERE NOT EXISTS(SELECT path FROM transfermarket_fetched_path WHERE path = ?)", [[queueItem.path],queueItem.path]);
	connection.query(sql, function(err) {
	    if (err) throw err;
	});
	sql = mysql.format('DELETE FROM error_uri WHERE uri = ?',[queueItem.path]);
	connection.query(sql, function(err) {
	    if (err) throw err;
	});
    //console.log(decoder.write(responseBuffer));
    if(/^\/\S+\/profil\/spieler\/\d{1,6}$/.test(queueItem.path)){
    	utils.get_players_profile(cheerio.load(decoder.write(responseBuffer)));
    };
    if(/^\/\S+?\/startseite\/wettbewerb\/[A-Z\d]+?(\/\S+)?$/i.test(queueItem.path)){//competition
    	utils.get_competition_profile(cheerio.load(decoder.write(responseBuffer)));
    }
    if(/^\/\S+?\/startseite\/verein\/\d+?(\/\S+)?$/i.test(queueItem.path)){//club
    	utils.get_club_info(cheerio.load(decoder.write(responseBuffer)));
    }
    if(/^\/wettbewerbe\/national\/wettbewerbe\/\d{1,}$/i.test(queueItem.path)){//club
    	utils.get_nation_info(cheerio.load(decoder.write(responseBuffer)));
    }
}).on("fetcherror",function(queueItem, response){
    console.log('fetcherror');
	connection.query("SELECT 1 FROM transfermarket_fetched_path WHERE path = '"+queueItem.path+"' LIMIT 1", function(err,rows) {
	    if (err) throw err;
	    if(!rows.length){
				var sql = mysql.format("INSERT INTO error_uri (uri, error_code) SELECT ? FROM dual WHERE NOT EXISTS(SELECT uri FROM error_uri WHERE uri = ?)", [[queueItem.path,response.statusCode],queueItem.path]);
				connection.query(sql, function(err) {
				    if (err) throw err;
				});
	    }
	});
}).on("fetchstart",function(queueItem,requestOptions ){
	console.log('fetchstart');
}).on("fetchtimeout",function(queueItem, crawlerTimeoutValue){
	console.log(queueItem.path);
	console.log('fetchtimeout');
	connection.query("SELECT 1 FROM transfermarket_fetched_path WHERE path = '"+queueItem.path+"' LIMIT 1", function(err,rows) {
	    if (err) throw err;
	    if(!rows.length){
			var sql = mysql.format("INSERT INTO error_uri (uri, error_code) SELECT ? FROM dual WHERE NOT EXISTS(SELECT uri FROM error_uri WHERE uri = ?)", [[queueItem.path,'timeout'],queueItem.path]);
			connection.query(sql, function(err) {
			    if (err) throw err;
			});
	    }
	});
}).on("fetchclienterror",function(queueItem, errorData){
	console.log(queueItem.path);
	console.log('fetchclienterror');
	connection.query("SELECT 1 FROM transfermarket_fetched_path WHERE path = '"+queueItem.path+"' LIMIT 1", function(err,rows) {
	    if (err) throw err;
	    if(!rows.length){
			var sql = mysql.format("INSERT INTO error_uri (uri, error_code) SELECT ? FROM dual WHERE NOT EXISTS(SELECT uri FROM error_uri WHERE uri = ?)", [[queueItem.path,errorData.code],queueItem.path]);
			connection.query(sql, function(err) {
			    if (err) throw err;
			});
	    }
	});
}).addFetchCondition(function(parsedURL) {
	return !(/(\.png|\.css|\.js)(\?\S+)?$/i.test(parsedURL.path)) && 
	(/^\/\S+\/profil\/spieler\/\d{1,6}$/.test(parsedURL.path) || 
	/^\/\S+?\/startseite\/wettbewerb\/[A-Z\d]+?$/i.test(parsedURL.path) || 
	/^\/\S+?\/startseite\/verein\/\d+?$/i.test(parsedURL.path) || 
	/^\/wettbewerbe\/national\/wettbewerbe\/\d{1,}$/i.test(parsedURL.path)) && !(/(\&[a-z]+?\;)+?/i.test(parsedURL.path));
    //return !(/[\.png|\.css|\.js](\?\S+)?$/i.test(parsedURL.path));
});
