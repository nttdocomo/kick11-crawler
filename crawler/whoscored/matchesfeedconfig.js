var http = require("http"),
excute = require('../../promiseExcute'),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
Crawler = require("simplecrawler"),
get_registration = require('./registration').get_registration,
whoscored_registration = require('./whoscored_registration'),
get_goals = require('./goals').get_goals,
get_player = require('../../model/whoscored/player').get_player,
get_events = require('./events').get_events,
MatchEvent = require('../../model/kick11/event').model,
getMatchesFeed = require('./getmatchesfeed'),
getMatchCentre2 = require('./getmatchcentre2'),
getStatisticsFeed = require('./getStatisticsFeed'),
//migrate = require('../../migrate/whoscored/migrate').migrate,
_ = require('underscore'),
host = 'http://www.whoscored.com',
crawler = new Crawler("www.whoscored.com", "/");
crawler.maxConcurrency = 1;
crawler.interval = 5000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36';
crawler.customHeaders = {
    Host:'www.whoscored.com',
    Referer:'http://www.whoscored.com/LiveScores',
    'X-Requested-With':'XMLHttpRequest',
    Cookie:'__gads=ID=e55debe14f69eef7:T=1436164463:S=ALNI_MZAB7Ks2P8iIOL4gPYkTxl-n37DtQ; OX_plg=swf|shk|pm; _ga=GA1.2.1737364748.1436164463'
};
/*crawler.useProxy = true;
crawler.proxyHostname = "127.0.0.1";
crawler.proxyPort="8087";*/
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    console.log("Completed fetching resource:", queueItem.path);
    //console.log(queueItem.status.redirected)
    var next, decoder = new StringDecoder('utf8'),content = decoder.write(responseBuffer),matchesfeed,matchCentre2;
    //console.log(decoder.write(responseBuffer));
    if(content && content !== null && content != 'null'){
        next = this.wait();
        getMatchesFeed(queueItem, responseBuffer, response).then(function(){
            next();
        })
        getMatchCentre2(queueItem, responseBuffer, response).then(function(){
            next();
        })
        getStatisticsFeed(queueItem, responseBuffer, response).then(function(){
            next();
        })
    }
}).on('complete',function(){
    console.log(crawler.queue.length)
    console.log('complete')
    process.exit()
}).on('fetcherror',function(queueItem, response){
    console.log(queueItem.stateData.code);
    console.log(queueItem.path)
}).on('fetchtimeout',function(queueItem, response){
    //crawler.queueURL(host + queueItem.path);
    console.log('fetchtimeout:' + queueItem.path)
}).on('fetchclienterror',function(queueItem, errorData){
    console.log('fetchclienterror')
    console.log(errorData)
    console.log(queueItem.path);
    //crawler.queueURL(host + queueItem.path);
}).on('fetchredirect',function(queueItem, parsedURL, errorData){
    console.log('fetchredirect');
    console.log(queueItem.path);
    //return false;
    //crawler.queueURL(host + queueItem.path);
}).addFetchCondition(function(parsedURL) {
    if(parsedURL.uriPath != '/Error.html'){
        return true;
    }
    return false;
});
module.exports = crawler;