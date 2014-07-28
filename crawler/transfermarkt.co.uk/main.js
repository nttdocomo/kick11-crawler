/**
 * @author nttdocomo
 */
var http = require("http"), fs = require('fs'), cheerio = require('cheerio'), url = require('url'), path = require('path'),
connection = require("./db"), mysql = require('mysql'),StringDecoder = require('string_decoder').StringDecoder,
Player = require('./player/model'),
Team = require('./team/model'),
Competition = require('./competition/model'),
pool  = mysql.createPool({
	connectionLimit : 1,
	host : 'localhost',
	user : 'root',
	database : 'kickeleven',
	password : ''
});
var Crawler = require("simplecrawler");
var crawler = new Crawler("www.transfermarkt.co.uk");
crawler.maxConcurrency = 10;
crawler.interval = 600;
crawler.timeout = 5000;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.start();
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
	console.log(queueItem.path);
    console.log('fetchcomplete');
    var decoder = new StringDecoder('utf8');
    if(/^\/\S+\/profil\/spieler\/\d{1,6}$/.test(queueItem.path)){
		var player = new Player(cheerio.load(decoder.write(responseBuffer)));
		console.log('get player ' + player.full_name);
	    player.save(pool);
	    player.update_nation_id(pool);
    };
    if(/^\/\S+?\/startseite\/verein\/\d+?(\/\S+)?$/i.test(queueItem.path)){//club
		var team = new Team(cheerio.load(decoder.write(responseBuffer)));
		console.log('get team ' + team.team_name);
	    team.save(pool);
	    team.save_team_player(pool)
    };
    if(/^\/\S+?\/startseite\/wettbewerb\/[A-Z\d]+?$/i.test(queueItem.path)){//competition
    	var competition = new Competition(cheerio.load(decoder.write(responseBuffer)));
    	console.log('get competition ' + competition.competition_name);
    	competition.save(pool);
    	competition.update_uri(pool);
    	competition.update_nation_id(pool);
    	competition.save_competition_team(pool);
    };
    /*if(/^\/wettbewerbe\/national\/wettbewerbe\/\d{1,}$/i.test(queueItem.path)){//club
    	utils.get_nation_info(cheerio.load(decoder.write(responseBuffer)));
    }*/
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
	return !(/[\.png|\.css|\.js](\?\S+)?$/i.test(parsedURL.path)) && 
	(/^\/\S+\/profil\/spieler\/\d{1,6}$/.test(parsedURL.path) || 
	/^\/\S+?\/startseite\/verein\/\d+?$/i.test(parsedURL.path)) || 
	/^\/\S+?\/startseite\/wettbewerb\/[A-Z\d]+?$/i.test(parsedURL.path);/* || 
	/^\/wettbewerbe\/national\/wettbewerbe\/\d{1,}$/i.test(parsedURL.path)) && !(/(\&[a-z]+?\;)+?/i.test(parsedURL.path))*/
    //return !(/[\.png|\.css|\.js](\?\S+)?$/i.test(parsedURL.path));
});
