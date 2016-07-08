const fs = require('fs'),
cheerio = require('cheerio'),
excute = require('../../promiseExcute'),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
moment = require('moment-timezone'),
Crawler = require("simplecrawler"),
utils = require('../../utils'),
randomIntrvl = utils.randomIntrvl,
getCookie = utils.getCookie,
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
crawler = require('./crawler'),
maxInterval = 2000,
minInterval = 200;
var setCookie = false,
fetchtimeout = [];
crawler.maxConcurrency = 1;
crawler.initialProtocol = protocol;
crawler.host = domain;
crawler.interval = randomIntrvl(minInterval,maxInterval);//set a random interval
crawler.discoverResources = false;
crawler.acceptCookies = true;
//crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36';
crawler.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
crawler.customHeaders = {
    Host:'www.whoscored.com',
    Referer:'https://www.whoscored.com/LiveScores',
    //'model-last-mode': 'A4t869pEUu/svTQfQNYI1r0nf0RiLYyu9iFUqnUvUT4=',
    'X-Requested-With':'XMLHttpRequest',
    //Cookie:'visid_incap_774904=mtEgz1AOSOGAScwGAQpXELfncVcAAAAAQUIPAAAAAABBL6iCBqVdUG26f2OneZjO;incap_ses_431_774904=cs1kFQHNaWZ9og1fTDj7BbfncVcAAAAAO+9NhGGnJ+9FJ1Zl+Du/wA==;incap_ses_430_774904=AderNBqe+SSrilHFxqr3BXXocVcAAAAApMGEefnpNpF7GbFLq/JKKw=='
};
crawler.listenerTTL = 100000;
crawler.timeout = 30000;
var modelLastMode;
/*crawler.useProxy = true;
crawler.proxyHostname = "127.0.0.1";
crawler.proxyPort="8888";*/
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    console.log("Completed fetching resource:", queueItem.path);
    console.log(crawler.interval)
    //console.log(queueItem.status.redirected)
    var next, decoder = new StringDecoder('utf8'),content = decoder.write(responseBuffer),matchesfeed,matchCentre2;
    //console.log(decoder.write(responseBuffer));
    if(content && content !== null && content != 'null'){
        if(/^\/LiveScores$/.test(queueItem.path) || /^\/$/.test(queueItem.path)){//获取首页的Model-Last-Mode
            //crawler.queueURL(host + '/matchesfeed/?d=20160101');
            next = this.wait();
            content = content.replace(/(.*[\n|\r])+?.+?Model\-Last\-Mode.+'(\S+?)'.+?[\n|\r](.*[\n|\r])+/,'$2')
            //console.log(content)
            //console.log(/^[a-zA-Z0-9\+\/]([a-zA-Z0-9\+\/])+[a-zA-Z0-9=]$/.test(content))
            if(/^[a-zA-Z0-9\+\/]([a-zA-Z0-9\+\/])+[a-zA-Z0-9=]$/.test(content)){
                modelLastMode = content;
                //console.log('Model-Last-Mode:' + modelLastMode)
                crawler.customHeaders['Model-Last-Mode'] = modelLastMode;
            }
            next();
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
            try{
                getStatisticsFeed(queueItem, content, response).then(function(){
                    console.log('getStatisticsFeed')
                    next();
                }).catch(function(err){
                    console.log(err);
                    next();
                })
            } catch(err){
                next();
            }
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
    crawler.queue.getLength(function(nu,length){
         console.log('crawler.queue.length:' + length)
    })
    console.log('complete')
    if(!setCookie){
        process.exit()
    }
}).on('fetchstart',function(queueItem, requestOptions){
    console.log(queueItem.path + ' start!')
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
crawler.cookies.on('addcookie',function(cookie){//监听addcookie事件，当服务器返回cookie时，把cookie记录下来并更新，存储在cookie.txt下，下次执行时从cookie.txt取cookie
    setCookie = true;
    crawler.customHeaders.Cookie = crawler.customHeaders.Cookie ? crawler.customHeaders.Cookie:'';
    if(!getCookie(cookie.name,crawler.customHeaders.Cookie)){
        crawler.customHeaders.Cookie += cookie.name + '=' + cookie.value + ';'
    } else {
        crawler.customHeaders.Cookie.replace(new RegExp('(.*)('+cookie.name+'\=)([a-zA-Z0-9\/\+\=]+);','g'),'$1$2'+cookie.value)
    }
    console.log(crawler.customHeaders.Cookie)
    fs.writeFile('./cookie.txt', crawler.customHeaders.Cookie, function(err){
        if (err) throw err;
        console.log('It\'s saved!');
        setCookie = false;
    });
}).on('removecookie',function(cookies){
    console.log(cookies)
})
//以首页作为起始页，获取页面里的Model-Last-Mode作为请求参数，否则会被重定向404
console.log('add statr')
//crawler.queueURL(host);
module.exports = crawler;
