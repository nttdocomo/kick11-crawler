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
whoscored_registration = require('./whoscored_registration'),
get_player = require('./get_player'),
get_team = require('./get_team'),
get_match = require('./get_matches'),
get_goals = require('./get_goals'),
get_stages = require('./get_stages'),
get_regions = require('./get_regions'),
get_seasons = require('./get_seasons'),
get_tournaments = require('./get_tournaments'),
get_uncomplete_matches = require('./matches').get_uncomplete_matches,
Match = require('./matches').model,
getMatchCentrePlayerStatistics = require('./getMatchCentrePlayerStatistics'),
migrate = require('../../migrate/whoscored/migrate').migrate,
_ = require('underscore'),
input_date = process.argv[2],
host = 'http://www.whoscored.com',
crawler = new Crawler("www.whoscored.com", "/");
crawler.maxConcurrency = 1;
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
    var next, decoder = new StringDecoder('utf8'),content,matchesfeed,matchCentre2;
    //console.log(decoder.write(responseBuffer));
    if(/^\/StatisticsFeed\/1\/GetMatchCentrePlayerStatistics.*?/.test(queueItem.path)){
        content = decoder.write(responseBuffer);
        if(content && content !== null && content != 'null'){
            next = this.wait();
            getMatchCentrePlayerStatistics(queueItem, content, response).then(function(){
                next();
            })
        }
    }
}).on('complete',function(){
    console.log('complete')
    process.exit()
}).on('fetcherror',function(queueItem, response){
    console.log(queueItem.stateData.code);
    console.log('fetcherror')
    //crawler.queueURL(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
    //crawler.queueURL(host + queueItem.path);
    console.log('fetchtimeout:' + queueItem.path)
}).on('fetchclienterror',function(queueItem, errorData){
    console.log('fetchclienterror')
    //crawler.queueURL(host + queueItem.path);
}).on('fetchredirect',function(queueItem, parsedURL, errorData){
    console.log('fetchredirect')
    //return false;
    //crawler.queueURL(host + queueItem.path);
}).addFetchCondition(function(parsedURL) {
    if(parsedURL.uriPath != '/Error.html'){
        return true;
    }
    return false;
});

crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=offensive&statsAccumulationType=0&isCurrent=true&teamIds=7603&matchId=541362');
crawler.start();
//http://www.whoscored.com/matchesfeed/?d=20141021
//http://www.whoscored.com/tournamentsfeed/9155/Fixtures/?d=2014W42&isAggregate=false