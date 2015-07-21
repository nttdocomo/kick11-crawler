/**
 * @author nttdocomo
 */
var cheerio = require('cheerio'), StringDecoder = require('string_decoder').StringDecoder,
excute = require('../../../promiseExcute'),mysql = require('mysql'),
fs = require('fs'),
url = require('url'),
Competition = require('../competition/model'),
Team = require('./model'),
Crawler = require("simplecrawler"),
host = 'http://www.transfermarkt.co.uk',
crawler = new Crawler('www.transfermarkt.co.uk');
crawler.maxConcurrency = 1;
crawler.interval = 600;
crawler.timeout = 10000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder,
    next;
    if(/^\/\S+?\/startseite\/wettbewerb\/\S+?$/i.test(queueItem.path) || /^\/\S+?\/startseite\/pokalwettbewerb\/\S+?$/i.test(queueItem.path)){//competition
    	decoder = new StringDecoder('utf8');
    	next = this.wait();
    	var competition = new Competition(cheerio.load(decoder.write(responseBuffer)));
    	console.log('competition '+ competition.competition_name + ' got!');
    	competition.save_team().then(function(){
    		next();
    	})/*.get_teams_url().forEach(function(url){
    		crawler.queueURL(host + url.replace(/(^\/\S+?\/startseite\/verein\/\d+?)\/saison_id\/\d{4}$/,'$1'));
    	});
    	competition.save_competition_team();*/
    };
    /*if(/^\/\S+?\/startseite\/verein\/\d+?$/i.test(queueItem.path)){//competition
    	decoder = new StringDecoder('utf8');
    	next = this.wait();
    	var team = new Team(cheerio.load(decoder.write(responseBuffer)));
    	team.save().then(function(){
    		next();
    	})
    };*/
}).on('complete',function(){
	console.log('complete');
}).on('fetcherror',function(queueItem, response){
	console.log('fetcherror ' + queueItem.path)
	crawler.queueURL(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
	console.log('fetchtimeout ' + queueItem.path)
	crawler.queueURL(host + queueItem.path);
}).on('fetchclienterror',function(queueItem, response){
	console.log('fetchclienterror ' + queueItem.path)
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
excute("SELECT uri FROM transfermarket_competition").then(function(competitions) {
	console.log('there are '+ competitions.length + ' to crawle');
	if(competitions.length){
	    for (var i = competitions.length - 1; i >= 0; i--) {
	    	crawler.queueURL(host + competitions[i].uri);
	    };
	}
	crawler.start();
});