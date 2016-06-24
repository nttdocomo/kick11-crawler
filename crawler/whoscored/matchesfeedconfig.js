var http = require("http"),
cheerio = require('cheerio'),
excute = require('../../promiseExcute'),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
moment = require('moment-timezone'),
Crawler = require("simplecrawler"),
utils = require('../../utils'),
randomIntrvl = utils.randomIntrvl,
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
protocol = 'https',
domain = 'www.whoscored.com',
host = protocol + '://' + domain,
fetchtimeout = [],
maxInterval = 20000,
minInterval = 2000,
crawler = require('./crawler');
crawler.maxConcurrency = 1;
crawler.initialProtocol = protocol;
crawler.host = domain;
crawler.interval = randomIntrvl();//set a random interval
crawler.discoverResources = false;
crawler.acceptCookies = true;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36';
crawler.customHeaders = {
    Host:'www.whoscored.com',
    Referer:'https://www.whoscored.com/LiveScores',
    //'model-last-mode': 'A4t869pEUu/svTQfQNYI1r0nf0RiLYyu9iFUqnUvUT4=',
    'X-Requested-With':'XMLHttpRequest',
    Cookie:'visid_incap_774904=gNC/G0SiR+im+cKakecp4ntFbVcAAAAAQUIPAAAAAACOuTCwMm95vCyKMUYQ+z10; incap_ses_199_774904=kmXuCbeOqzf/d9Owrv3CAgtGbVcAAAAAe5zojb7eet62Qw01qPT+MA==; __gads=ID=2c90b344c567287d:T=1466779198:S=ALNI_MYy8s--t7tgwIweLUtNL-bvVgv06w; OX_plg=swf|shk|pm; _ga=GA1.2.1246760017.1466779220; _gat=1; crtg_rta='
};
crawler.listenerTTL = 100000;
crawler.timeout = 30000;
/*crawler.useProxy = true;
crawler.proxyHostname = "127.0.0.1";
crawler.proxyPort="11080";*/
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    console.log("Completed fetching resource:", queueItem.path);
    console.log(crawler.interval)
    //console.log(queueItem.status.redirected)
    var next, decoder = new StringDecoder('utf8'),content = decoder.write(responseBuffer),matchesfeed,matchCentre2;
    //console.log(decoder.write(responseBuffer));
    if(content && content !== null && content != 'null'){
        if(/^\/LiveScores$/.test(queueItem.path)){//获取首页的Model-Last-Mode
            content = content.replace(/(.*[\n|\r])+?.+?Model\-Last\-Mode.+'(\S+?)'.+?[\n|\r](.*[\n|\r])+/,'$2')
            console.log('Model-Last-Mode:' + content)
            crawler.customHeaders['Model-Last-Mode'] = content;
        }
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
            Player.get_player_from_matchcenter(JSON.parse(content),crawler).then(function(){
                console.log('get player complete!')
                return getMatchCentre2(queueItem, content, response)
            }).then(function(){
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
}).on('fetchstart',function(queueItem, requestOptions){
    crawler.interval = randomIntrvl();//everytime fetch complete,
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
    console.log(queueItem);
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
//以首页作为起始页，获取页面里的Model-Last-Mode作为请求参数，否则会被重定向404
crawler.queueURL(host + '/LiveScores');
module.exports = crawler;
