/**
 * @author nttdocomo
 */
var cheerio = require('cheerio'), StringDecoder = require('string_decoder').StringDecoder,
pool  = require('../pool'),
fs = require('fs'),
url = require('url'),
crawler = require('./crawler'),
urls = [],
Competition = require('../competition/model'),
Season = require('../seasons/model'),
Team = require('./model'),
host = 'http://www.transfermarkt.co.uk';
crawler.discoverResources = false;
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder;
    if(/^\/\S+?\/startseite\/wettbewerb\/\S+?$/i.test(queueItem.path) || /^\/\S+?\/startseite\/pokalwettbewerb\/\S+?$/i.test(queueItem.path)){//competition
    	decoder = new StringDecoder('utf8');
    	var competition = new Competition(cheerio.load(decoder.write(responseBuffer)));
    	var season = new Season(cheerio.load(decoder.write(responseBuffer)));
    	season.get_id(function(){
    		competition.save(function(){
		    	competition.get_teams_url().forEach(function(url){
		    		crawler.queueURL(host + url.replace(/(^\/\S+?\/startseite\/verein\/\d+?)\/saison_id\/\d{4}$/,'$1'));
		    	});
	    	});
    	});
    	
    };
    if(/^\/\S+?\/startseite\/verein\/\d+?$/i.test(queueItem.path)){//competition
    	decoder = new StringDecoder('utf8');
    	var team = new Team(cheerio.load(decoder.write(responseBuffer)));
    	team.is_saved(function(){
    		
    	})
    	team.save(function(){
	    	team.get_player_url().forEach(function(url){
		    	if(/^\/\S+\/nationalmannschaft\/spieler\/\d{1,6}$/.test(url)){
		    		url = url.replace(/nationalmannschaft/,'profil')
		    	};
		    	crawler.queueURL(host + url);
		    });
    	});
    };
    if(/^\/\S+\/profil\/spieler\/\d{1,6}$/.test(queueItem.path)){
	    player = new Player($);
	    player.save(pool);
    };
}).on('complete',function(){
	console.log('complete');
	fs.open('urls.html', 'w', 0666, function(e, fd) {
		if (e) {
			console.log('错误信息：' + e);
		} else {
			fs.write(fd, urls.join('\n'), 0, 'utf8', function(e) {
				if (e) {
					console.log('出错信息：' + e);
				} else {
					fs.closeSync(fd);
				}
			});
		}
	});
}).on('complete',function(){
	console.log('complete');
}).on('fetcherror',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
}).on('fetchclienterror',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
}).addFetchCondition(function(parsedURL) {
	if(!(!(/(\.png|\.css|\.js)(\?\S+)?$/i.test(parsedURL.path)) && 
	(/^\/\S+?\/startseite\/wettbewerb\/\S+?$/i.test(parsedURL.path) || 
	/^\/\S+?\/startseite\/pokalwettbewerb\/\S+?$/i.test(parsedURL.path) || 
	/^\/\S+?\/startseite\/verein\/\d+?$/i.test(parsedURL.path)))){
		if(urls.indexOf(parsedURL.path) == -1){
			urls.push(parsedURL.path)
		}
	}
	
	return !(/(\.png|\.css|\.js)(\?\S+)?$/i.test(parsedURL.path)) && 
	(/^\/\S+?\/startseite\/wettbewerb\/\S+?$/i.test(parsedURL.path) || 
	/^\/\S+?\/startseite\/pokalwettbewerb\/\S+?$/i.test(parsedURL.path) || 
	/^\/\S+?\/startseite\/verein\/\d+?$/i.test(parsedURL.path));
});
pool.getConnection(function(err, connection) {
	connection.query("SELECT uri FROM transfermarket_competition WHERE competition_id = 'IT1'", function(err,rows) {
	    if (err) throw err;
	    connection.release();
	    for (var i = rows.length - 1; i >= 0; i--) {
	    	crawler.queueURL(host + rows[i].uri);
	    };
		crawler.start();
	});
});