var cheerio = require('cheerio'),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
_ = require('underscore'),
team_id = process.argv[2],
Crawler = require("simplecrawler"),
excute = require('../../promiseExcute'),
Team = require('../../model/transfermarkt.co.uk/team'),
Player = require('../../model/transfermarkt.co.uk/player'),
Nation = require('../../model/transfermarkt.co.uk/nation'),
Transfer = require('../../model/transfermarkt.co.uk/transfer'),
difference = require('./utils').difference,
host = 'http://www.transfermarkt.co.uk',
fetchedUrls = [],
crawler = new Crawler("www.transfermarkt.co.uk", "/");
//crawler.discoverResources = false;
crawler.useProxy = true;
crawler.proxyHostname = '127.0.0.1';
crawler.proxyPort = '11080';
crawler.maxConcurrency = 1;
crawler.interval = 600;
crawler.listenerTTL = 100000;
//crawler.timeout = 30000;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.124 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
	console.log("Completed fetching resource:", queueItem.path);
    var decoder = new StringDecoder('utf8'),$,
    next;
    if(/^\/\S+?\/startseite\/verein\/\d+?$/i.test(queueItem.path)){//competition
        next = this.wait();
        $ = cheerio.load(decoder.write(responseBuffer));
        $('a.spielprofil_tooltip').each(function(i,el){
            crawler.queueURL(host + $(el).attr('href'));
        })
        Nation.get_nation_by_team($).then(function(){
            return Team.get_team($)
        }).then(function(){
            next();
        })
    };
    if(/^\/\S+\/profil\/spieler\/\d{1,9}$/.test(queueItem.path)){//competition
        next = this.wait();
        $ = cheerio.load(decoder.write(responseBuffer));
        crawler.queueURL(host + queueItem.path.replace(/^\/\S+\/profil\/spieler\/(\d{1,9})$/,'$1'));
        Nation.get_nation_by_player_transfer($)/*.then(function(){
            Nation.get_nation_by_player_transfer(cheerio.load(decoder.write(responseBuffer)));
        })*/.then(function(){
            return Player.get_player($)
        }).then(function(){
            return Team.get_team_by_transfers($)
        }).then(function(){
            return Transfer.get_trasfer_from_transfers($)
        }).then(function(){
            next();
        }).catch(function(err){
            console.log(err);
        })
    };
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
crawler.queueURL(host + '/jumplist/startseite/verein/'+team_id);
crawler.start();