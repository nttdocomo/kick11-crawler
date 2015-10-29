var cheerio = require('cheerio'),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
_ = require('underscore'),
Crawler = require("simplecrawler"),
excute = require('../../promiseExcute'),
Team = require('../../model/transfermarkt.co.uk/team'),
Player = require('../../model/transfermarkt.co.uk/player'),
Nation = require('../../model/transfermarkt.co.uk/nation'),
Competition = require('../../model/transfermarkt.co.uk/competition'),
Transfer = require('../../model/transfermarkt.co.uk/transfer'),
insert_match_by_competition = require('../../fn/transfermarkt/match/insert_match_by_competition'),
difference = require('./utils').difference,
host = 'http://www.transfermarkt.co.uk',
fetchedUrls = [],
//crawler = new Crawler('www.transfermarkt.co.uk','/');
/*Crawler.crawl("http://www.transfermarkt.co.uk/", function(queueItem){
    console.log("Completed fetching resource:", queueItem.url);
});*/
//crawler.proxyHostname = 'http://127.0.0.1';
//crawler.proxyPort = 8888;
//crawler = Crawler.crawl("http://www.transfermarkt.co.uk/");
crawler = new Crawler("www.transfermarkt.co.uk", "/");
//crawler.discoverResources = false;
/*crawler.useProxy = true;
crawler.proxyHostname = '127.0.0.1';
crawler.proxyPort = '11080';*/
crawler.maxConcurrency = 1;
crawler.interval = 600;
//crawler.timeout = 30000;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.124 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
	console.log("Completed fetching resource:", queueItem.path);
    var decoder = new StringDecoder('utf8'),
    next;
    if(/^\/\S+?\/startseite\/verein\/\d+?$/i.test(queueItem.path)){//competition
    	next = this.wait();
    	Nation.get_nation_by_team(cheerio.load(decoder.write(responseBuffer))).then(function(){
    		return Team.get_team(cheerio.load(decoder.write(responseBuffer)))
    	}).then(function(){
    		next();
    	})
    };
    if(/^\/\S+\/profil\/spieler\/\d{1,9}$/.test(queueItem.path)){//competition
    	next = this.wait();
    	Nation.get_nation_by_player_profile(cheerio.load(decoder.write(responseBuffer))).then(function(){
            Nation.get_nation_by_player_transfer(cheerio.load(decoder.write(responseBuffer)));
        }).then(function(){
    		return Player.get_player(cheerio.load(decoder.write(responseBuffer)))
    	}).then(function(){
    		return Team.get_team_by_transfers(cheerio.load(decoder.write(responseBuffer)))
    	}).then(function(){
    		return Transfer.get_trasfer_from_transfers(cheerio.load(decoder.write(responseBuffer)))
    	}).then(function(){
    		next();
    	}).catch(function(err){
	    	console.log(err);
	    })
    };
    //合同
    if(/^\/\S+\/korrektur\/spieler\/\d{1,6}$/.test(queueItem.path)){
		next = this.wait();
		Transfer.get_trasfer_from_korrektur(cheerio.load(decoder.write(responseBuffer))).then(function(){
			next();
		})
    };
    if(/^\/\S+\/gesamtspielplan\/wettbewerb\/[\w|\d]+?(\/saison_id\/\d{4})?$/.test(queueItem.path)){
    	next = this.wait();
    	Nation.get_nation_by_competition(cheerio.load(decoder.write(responseBuffer))).then(function(){
            return Team.get_team_by_match_plan(cheerio.load(decoder.write(responseBuffer)))
        }).then(function(){
            //console.log('team ok')
	    	return insert_match_by_competition(decoder.write(responseBuffer))
    	}).then(function(){
    		next()
    	})
    };
    if(/^\/\S+\/startseite\/wettbewerb\/[\w|\d]+?(\/saison_id\/\d{4})?$/.test(queueItem.path)){
    	next = this.wait();
    	Nation.get_nation_by_competition(cheerio.load(decoder.write(responseBuffer))).then(function(){
	    	return Competition.get_competition(decoder.write(responseBuffer))
    	}).then(function(){
    		next()
    	})
    };

    /*if(/^\/\S+\/transfers\/spieler\/\d{1,6}$/.test(queueItem.path)){
		next = this.wait();
		Transfer.get_trasfer_from_transfers(cheerio.load(decoder.write(responseBuffer))).then(function(){
			next();
		})
    };*/
}).on('complete',function(){
	console.log('complete');
	process.exit();
}).on('fetcherror',function(queueItem, response){
	console.log('fetcherror ' + queueItem.path)
	crawler.queueURL(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
	console.log('fetchtimeout ' + queueItem.path)
	crawler.queueURL(host + queueItem.path);
}).on('fetchclienterror',function(queueItem, errorData){
	console.log('fetchclienterror ' + queueItem.path)
	console.log(errorData)
	crawler.queueURL(host + queueItem.path);
}).addFetchCondition(function(parsedURL) {
	if((/^\/\S+?\/startseite\/verein\/\d+?$/i.test(parsedURL.path) || 
	/^\/\S+\/profil\/spieler\/\d{1,9}$/.test(parsedURL.path) || 
	/^\/\S+\/korrektur\/spieler\/\d{1,6}$/.test(parsedURL.path) || 
	/^\/\S+\/gesamtspielplan\/wettbewerb\/[\w|\d]+?(\/saison_id\/\d{4})?$/.test(parsedURL.path) || 
	/^\/\S+\/startseite\/wettbewerb\/[\w|\d]+?(\/saison_id\/\d{4})?$/i.test(parsedURL.path)/* || 
	/^\/\S+\/transfers\/spieler\/\d{1,6}$/.test(parsedURL.path)*/) && !/^\/end\-of\-career\/startseite\/verein\/\d+?$/.test(parsedURL.path) && !/^\/(unattached|unknown|\-tm)\/startseite\/verein\/\d+?$/.test(parsedURL.path)){
		if(fetchedUrls.indexOf(parsedURL.path) == -1){//if url not in fetchedUrl
			fetchedUrls.push(parsedURL.path)//push it into to avoid fetch twice
			return true
		}
		return false;
	}
	return false;
	///unknown/startseite/verein/75
});
//crawler.queueURL(host + '/1-bundesliga/gesamtspielplan/wettbewerb/L1/saison_id/2015');
//crawler.queueURL(host + '/championship/gesamtspielplan/wettbewerb/GB2/saison_id/2015');
crawler.queueURL(host + '/');
crawler.start();
//crawler.queue.add('http', 'www.transfermarkt.co.uk', '20', '/');
//crawler.queueURL(host);
//crawler.start();