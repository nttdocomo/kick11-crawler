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
migrate = require('../../migrate/whoscored/migrate').migrate,
_ = require('underscore'),
asyncLoop = require('../../asyncLoop'),
input_date = process.argv[2],
host = 'http://www.whoscored.com',
crawler = new Crawler('www.whoscored.com');
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
    var next, decoder = new StringDecoder('utf8'),content,matchesfeed,matchCentre2;
    if(/^\/MatchesFeed\/(\d{1,})\/MatchCentre2$/.test(queueItem.path)){
        content = decoder.write(responseBuffer);
        var match_id = queueItem.path.replace(/^\/MatchesFeed\/(\d{1,})\/MatchCentre2$/,"$1");
        if(content !== null && content != 'null'){
            matchCentre2 = JSON.parse(content);
            if(matchCentre2 !== null){
                console.log('MatchesFeed started');
                next = this.wait();
                get_player(matchCentre2).then(function(){
                    console.log('get player complete!')
                    return whoscored_registration(matchCentre2, match_id)
                }).then(function(){
                    console.log('all whoscored_registration complete')
                    return get_goals(matchCentre2, match_id)
                }).then(function(){
                    console.log('all event complete')
                    next()
                })
            }
        }
    }
}).on('complete',function(){
    console.log(crawler.queue[0])
    console.log('complete')
    migrate()
}).on('fetcherror',function(queueItem, response){
    console.log('fetcherror');
    console.log(queueItem.path)
    crawler.queueURL(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
    crawler.queueURL(host + queueItem.path);
    console.log('fetchtimeout:' + queueItem.path)
}).on('fetchclienterror',function(queueItem, errorData){
    console.log('fetchclienterror')
    crawler.queueURL(host + queueItem.path);
});
/*crawler.queueURL(host + '/MatchesFeed/914891/MatchCentre2');
crawler.start();*/

excute(mysql.format('SELECT DISTINCT(match_id) FROM `whoscored_registration`')).then(function(row){
    var matches_id = _.map(row,function(item){
        return item.match_id
    });
    //console.log(mysql.format('SELECT id FROM `whoscored_matches` WHERE score1 IS NOT NULL AND score2 IS NOT NULL AND match_id NOT IN ?',[[matches_id]]))
    return excute(mysql.format('SELECT id FROM `whoscored_matches` WHERE score1 IS NOT NULL AND score2 IS NOT NULL AND match_id NOT IN ?',[[matches_id]]))
}).then(function(row){
    if(row.length){
        _.each(row,function(item){
            crawler.queueURL(host + '/MatchesFeed/'+item.id+'/MatchCentre2');
        })
        crawler.start();
    }
})
//http://www.whoscored.com/matchesfeed/?d=20141021
//http://www.whoscored.com/tournamentsfeed/9155/Fixtures/?d=2014W42&isAggregate=false