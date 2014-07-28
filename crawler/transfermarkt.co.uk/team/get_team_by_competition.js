/**
 * @author nttdocomo
 */
var cheerio = require('cheerio'), StringDecoder = require('string_decoder').StringDecoder,
pool  = require('../pool'),
fs = require('fs'),
url = require('url'),
urls = [];
Competition = require('../competition/model'),
Team = require('./model'),
Crawler = require("simplecrawler"),
host = 'http://www.transfermarkt.co.uk',
crawler = new Crawler('www.transfermarkt.co.uk');
crawler.maxConcurrency = 10;
crawler.interval = 600;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder;
    if(/^\/\S+?\/startseite\/wettbewerb\/\S+?$/i.test(queueItem.path) || /^\/\S+?\/startseite\/pokalwettbewerb\/\S+?$/i.test(queueItem.path)){//competition
    	decoder = new StringDecoder('utf8');
    	var competition = new Competition(cheerio.load(decoder.write(responseBuffer)));
    	competition.get_teams_url().forEach(function(url){
    		crawler.queueURL(host + url.replace(/(^\/\S+?\/startseite\/verein\/\d+?)\/saison_id\/\d{4}$/,'$1'));
    	});
    	competition.save_competition_team(pool);
    };
    if(/^\/\S+?\/startseite\/verein\/\d+?$/i.test(queueItem.path)){//competition
    	decoder = new StringDecoder('utf8');
    	var team = new Team(cheerio.load(decoder.write(responseBuffer)));
    	team.save(pool)
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
	connection.query("SELECT uri FROM transfermarket_competition WHERE competition_id = 'L1'", function(err,rows) {
	    if (err) throw err;
	    connection.release();
	    for (var i = rows.length - 1; i >= 0; i--) {
	    	crawler.queueURL(host + rows[i].uri);
	    };
		crawler.start();
	});
});