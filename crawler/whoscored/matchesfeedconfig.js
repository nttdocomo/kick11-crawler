var http = require("http"),
cheerio = require('cheerio'),
excute = require('../../promiseExcute'),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
moment = require('moment-timezone'),
Crawler = require("simplecrawler"),
get_registration = require('./registration').get_registration,
whoscored_registration = require('./whoscored_registration'),
get_goals = require('./goals').get_goals,
get_player = require('../../model/whoscored/player').get_player,
Season = require('../../model/whoscored/season'),
Event = require('../../model/whoscored/event'),
Player = require('../../model/whoscored/player'),
get_events = require('../../model/whoscored/matchEvents').get_events,
getMatchesFeed = require('./getmatchesfeed'),
getMatchCentre2 = require('./getmatchcentre2'),
getStatisticsFeed = require('./getStatisticsFeed'),
//migrate = require('../../migrate/whoscored/migrate').migrate,
_ = require('underscore'),
host = 'http://www.whoscored.com',
fetchtimeout = [];
crawler = require('./crawler');
crawler.maxConcurrency = 1;
crawler.interval = 600;
crawler.discoverResources = false;
crawler.acceptCookies = true;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36';
crawler.customHeaders = {
    Host:'www.whoscored.com',
    Referer:'http://www.whoscored.com/LiveScores',
    'Model-Last-Mode': '8CxK4vwllEUhHMX2E4sg1rqQKzLMqse/Vb2Tn6YudF4=',
    'X-Requested-With':'XMLHttpRequest',
    Cookie:'__gads=ID=fabb88cc2b527586:T=1447593413:S=ALNI_MbhDC_wix56JPiYFTF-dHtc9XYRMA; OX_plg=swf|shk|pm; userid=B015E18A-9322-3E4F-2880-627A7B2C4BA9; jwplayer.volume=1; jwplayer.mute=true; __qca=P0-1695388366-1449292007430; GED_PLAYLIST_ACTIVITY=W3sidSI6ImVwbVMiLCJ0IjoxNDQ5OTA5MzIwLCJlZCI6eyJpIjp7InciOnsidHQiOjMxNDAwLCJwZCI6MzE0MDAsImJzIjoxMH19LCJhIjpbeyJrdiI6e319LHsia3YiOnt9fSx7Imt2Ijp7fX0seyJrdiI6e319LHsia3YiOnt9fSx7Imt2Ijp7fX1dfSwibnYiOjAsInBsIjozMTQwMH1d; _ga=GA1.2.1923670642.1447593414; _gat=1'
};
crawler.listenerTTL = 100000;
crawler.timeout = 30000;
/*crawler.useProxy = true;
crawler.proxyHostname = "127.0.0.1";
crawler.proxyPort="11080";*/
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    console.log("Completed fetching resource:", queueItem.path);
    //console.log(queueItem.status.redirected)
    var next, decoder = new StringDecoder('utf8'),content = decoder.write(responseBuffer),matchesfeed,matchCentre2;
    //console.log(decoder.write(responseBuffer));
    if(content && content !== null && content != 'null'){
        if(/^\/matchesfeed\/\?d\=\d{8}$/.test(queueItem.path)){
            next = this.wait();
            content = eval(content);
            getMatchesFeed(queueItem, content, response, crawler).then(function(){
                return content[1].reduce(function(sequence, item){
                    return sequence.then(function(){
                        return excute(mysql.format('SELECT 1 FROM `whoscored_tournaments` WHERE id = ?',[item[4]]))
                    }).then(function(row){
                        if(!row.length){
                            crawler.queueURL(host + '/Regions/'+item[1]+'/Tournaments/'+item[4]);
                        }
                        return Promise.resolve()
                    });
                },Promise.resolve())
            }).then(function(){
                console.log('getMatchesFeed')
                /*return excute('TRUNCATE `whoscored_stage`').then(function(){
                    excute('TRUNCATE `whoscored_regions`')
                }).then(function(){
                    excute('TRUNCATE `whoscored_tournaments`')
                })*/
                next();
            }).catch(function(err){
                console.log(err)
                next();
            })
        }
        if(/^\/MatchesFeed\/(\d{1,})\/MatchCentre2$/.test(queueItem.path)){
            next = this.wait();
            getMatchCentre2(queueItem, content, response).then(function(){
                console.log('getMatchCentre2')
                next();
            })
        }
        if(/^\/StatisticsFeed\/1\/GetMatchCentrePlayerStatistics.*?/.test(queueItem.path)){
            next = this.wait();
            getStatisticsFeed(queueItem, content, response).then(function(){
                console.log('getStatisticsFeed')
                next();
            })
        }
        if(/^\/Regions\/\d+?\/Tournaments\/\d+?$/.test(queueItem.path)){
            next = this.wait();
            Event.get_seasons_by_tournament(cheerio.load(decoder.write(responseBuffer)),queueItem.path.replace(/^\/Regions\/\d+?\/Tournaments\/(\d+?)$/,'$1')).then(function(){
                next();
            })
        }
        if(/^\/Players\/\d+?$/.test(queueItem.path)){
            next = this.wait();
            Player.get_player_info(cheerio.load(decoder.write(responseBuffer)),queueItem.path.replace(/^\/Players\/(\d+?)$/,'$1')).then(function(){
                next();
            })
        }
        if(/^\/Matches\/\d+\/Live$/.test(queueItem.path)){
            /*console.log('asdasdasdads')
            console.log(content.replace(/(.*[\n|\r])+?.+?(matchCentreData).+?(\{.+\})\;[\n|\r](.*[\n|\r])+/,'$3'))*/
            content = content.replace(/(.*[\n|\r])+?.+?(matchCentreData).+?(\{.+\})\;[\n|\r](.*[\n|\r])+/,'$3')
            next = this.wait();
            getMatchCentre2(queueItem, content, response).then(function(){
                console.log('getMatchCentre2')
                next();
            })
        }
    }
}).on('complete',function(){
  	console.log('complete:'+crawler.queue.complete());
    console.log('errors:'+crawler.queue.errors());
    crawler.queue.getWithStatus("failed").forEach(function(queueItem) {
        console.log("Whoah, the request for %s failed!", queueItem.url);
        // do something...
    });
    crawler.queue.getWithStatus("timeout").forEach(function(queueItem) {
        console.log("Whoah, the request for %s timeout!", queueItem.url);
        // do something...
    });
    console.log('complete')
    process.exit()
}).on('fetcherror',function(queueItem, response){
    console.log(queueItem.stateData.code);
    console.log(queueItem.path)
}).on('fetchtimeout',function(queueItem, response){
    //crawler.queueURL(host + queueItem.path);
    fetchtimeout.push(queueItem.path)
    console.log('fetchtimeout:' + queueItem.path)
}).on('fetchclienterror',function(queueItem, errorData){
    console.log('fetchclienterror')
    console.log(queueItem.path);
    //crawler.queueURL(host + queueItem.path);
}).on('fetchredirect',function(queueItem, parsedURL, response){
    console.log('fetchredirect');
    //console.log(response)
    /*if(/\/MatchesFeed\/\d+\/MatchCentre/.test(queueItem.path)){
      crawler.queueURL(host + '/MatchesFeed\/\d+\/MatchCentre2')
      crawler.queueURL(host + '/Matches/969706/Live')
    }*/
    console.log(queueItem.path);
    //return false;
    //crawler.queueURL(host + queueItem.path);
}).addFetchCondition(function(parsedURL) {
  if(parsedURL.uriPath == '/404.html'){
    console.log(parsedURL.uriPath)
  }
    if(parsedURL.uriPath != '/Error.html' && parsedURL.uriPath != '/404.html'){
        return true;
    }
    return false;
});
module.exports = crawler;
