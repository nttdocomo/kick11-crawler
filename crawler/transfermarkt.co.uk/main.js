var cheerio = require('cheerio'),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
Crawler = require("simplecrawler"),
excute = require('../../promiseExcute'),
Team = require('./page/team'),
Player = require('./page/player'),
host = 'http://www.transfermarkt.co.uk',
fetchedUrls = [],
//crawler = new Crawler('www.transfermarkt.co.uk','/');
/*Crawler.crawl("http://www.transfermarkt.co.uk/", function(queueItem){
    console.log("Completed fetching resource:", queueItem.url);
});*/
//crawler.proxyHostname = 'http://127.0.0.1';
//crawler.proxyPort = 8888;
//crawler.discoverResources = false;
crawler = Crawler.crawl("http://www.transfermarkt.co.uk/");
/*crawler.maxConcurrency = 1;
crawler.interval = 600;
crawler.timeout = 30000;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.124 Safari/537.36';*/
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
	console.log("Completed fetching resource:", queueItem.url);
    var decoder,
    next;
    if(/^\/\S+?\/startseite\/verein\/\d+?$/i.test(queueItem.path)){//competition
    	decoder = new StringDecoder('utf8');
    	next = this.wait();
    	var team = new Team(cheerio.load(decoder.write(responseBuffer)));
    	excute(mysql.format('SELECT 1 FROM `transfermarket_team` WHERE id = ?',[team.get_id()])).then(function(row){
    		if(row.length){
		    	return excute(mysql.format('UPDATE `transfermarket_team` SET ? WHERE id = ?',[{
		    		team_name:team.get_name(),
		    		id:team.get_id(),
		    		nation_id:team.get_nation_id(),
		    		profile_uri:team.get_url()
		    	},team.get_id()]))
    		} else {
		    	return excute(mysql.format('INSERT INTO `transfermarket_team` SET ?',{
		    		team_name:team.get_name(),
		    		id:team.get_id(),
		    		nation_id:team.get_nation_id(),
		    		profile_uri:team.get_url()
		    	}))
    		}
    	}).then(function(){
    		next();
    	})
    };
    if(/^\/\S+\/profil\/spieler\/\d{1,9}$/.test(queueItem.path)){//competition
    	decoder = new StringDecoder('utf8');
    	next = this.wait();
    	var player = new Player(cheerio.load(decoder.write(responseBuffer)));
    	excute(mysql.format('SELECT 1 FROM `transfermarket_player` WHERE id = ?',[player.get_id()])).then(function(row){
    		if(row.length){
    			return excute(mysql.format('UPDATE `transfermarket_player` SET ? WHERE id = ?',[{
		    		full_name:player.get_name(),
		    		name_in_native_country:player.get_name_in_native_country(),
		    		date_of_birth:player.get_nation_id(),
		    		height:player.get_height(),
		    		market_value:player.get_market_value(),
		    		foot:player.get_foot(),
		    		position:player.get_position(),
		    		profile_uri:player.get_url(),
		    		id:player.get_id(),
		    		nation_id:player.get_nation_id(),
		    	},player.get_id()]))
    		} else {
    			return excute(mysql.format('INSERT INTO `transfermarket_player` SET ?',{
		    		full_name:player.get_name(),
		    		name_in_native_country:player.get_name_in_native_country(),
		    		date_of_birth:player.get_nation_id(),
		    		height:player.get_height(),
		    		market_value:player.get_market_value(),
		    		foot:player.get_foot(),
		    		position:player.get_position(),
		    		profile_uri:player.get_url(),
		    		id:player.get_id(),
		    		nation_id:player.get_nation_id(),
		    	}))
    		}
    	}).then(function(){
    		next();
    	})
    };
}).on('complete',function(){
	console.log('complete');
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
	if(/^\/\S+?\/startseite\/verein\/\d+?$/i.test(parsedURL.path) || /^\/\S+\/profil\/spieler\/\d{1,9}$/.test(parsedURL.path)){
		if(fetchedUrls.indexOf(parsedURL.path) == -1){//if url not in fetchedUrl
			fetchedUrls.push(parsedURL.path)//push it into to avoid fetch twice
			return true
		}
		return false;
	}
	return false;
});

//crawler.queue.add('http', 'www.transfermarkt.co.uk', '20', '/');
//crawler.queueURL(host);
//crawler.start();