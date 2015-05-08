/**
 * @author nttdocomo
 */
var cheerio = require('cheerio'), StringDecoder = require('string_decoder').StringDecoder,
excute = require('../../../promiseExcute'),mysql = require('mysql'),
fs = require('fs'),
url = require('url'),
promiseCrawler = require('../../../crawler'),
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
    	competition.save_competition_team();
    };
    if(/^\/\S+?\/startseite\/verein\/\d+?$/i.test(queueItem.path)){//competition
    	decoder = new StringDecoder('utf8');
    	var team = new Team(cheerio.load(decoder.write(responseBuffer)));
    	team.save()
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
excute("SELECT uri FROM transfermarket_competition WHERE competition_ref_id != 0").then(function(competitions) {
	if(competitions.length){
	    for (var i = competitions.length - 1; i >= 0; i--) {
	    	console.log(competitions[i].uri)
	    	crawler.queueURL(host + competitions[i].uri);
	    };
	}
	crawler.start();
});