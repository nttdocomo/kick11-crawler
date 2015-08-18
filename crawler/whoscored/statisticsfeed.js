/**
 * @author nttdocomo
 */
var http = require("http"),
excute = require('../../promiseExcute'),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
Crawler = require("simplecrawler"),
getMatchCentrePlayerStatistics = require('./statistics').getMatchCentrePlayerStatistics,
statistic = require('../../model/kick11/statistic'),
_ = require('underscore'),
host = 'http://www.whoscored.com',
crawler = new Crawler("www.whoscored.com", "/");
crawler.maxConcurrency = 1;
crawler.interval = 1000;
crawler.timeout = 30000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36';
crawler.customHeaders = {
    Host:'www.whoscored.com',
    Referer:'http://www.whoscored.com/LiveScores',
    'X-Requested-With':'XMLHttpRequest',
    Cookie:'__gads=ID=e173268caa0f2b07:T=1432013869:S=ALNI_MaOSzNoD7wlFKgTdXpQP7oqPIlfag; OX_plg=swf|shk|pm; _gat=1; OX_sd=3; _ga=GA1.2.744658120.1432013868'
};
/*crawler.useProxy = true;
crawler.proxyHostname = "127.0.0.1";
crawler.proxyPort="8087";*/
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var next = this.wait(), decoder = new StringDecoder('utf8'),content = decoder.write(responseBuffer);
    if(content && content !== null && content != 'null'){
        getMatchCentrePlayerStatistics(queueItem, content).then(function(){
            console.log('ok')
            return statistic.save_from_whoscored(queueItem, content)
        }).then(function(){
            next();
        })
    }
}).on('complete',function(){
    console.log('complete')
    process.exit()
}).on('fetcherror',function(queueItem, response){
    console.log('fetcherror');
    console.log(queueItem.path)
}).on('fetchtimeout',function(queueItem, response){
    console.log('fetchtimeout:' + queueItem.path)
}).on('fetchclienterror',function(queueItem, errorData){
    console.log('fetchclienterror')
});
crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds=294&matchId=776511');
crawler.start();
//http://www.whoscored.com/matchesfeed/?d=20141021
//http://www.whoscored.com/tournamentsfeed/9155/Fixtures/?d=2014W42&isAggregate=false