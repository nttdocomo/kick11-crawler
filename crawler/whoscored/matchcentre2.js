/**
 * @author nttdocomo
 */
var http = require("http"),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
_ = require('underscore'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
Crawler = require("simplecrawler"),
excute = require('../../promiseExcute'),
get_registration = require('./registration').get_registration,
get_events = require('./events').get_events,
get_player = require('./player').get_player,
get_goals = require('./goals').get_goals,
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
    content = decoder.write(responseBuffer);
    var match_id = queueItem.path.replace(/^\/MatchesFeed\/(\d{1,})\/MatchCentre2$/,"$1");
    if(content && content !== null && content != 'null'){
        console.log('MatchesFeed started');
        next = this.wait();
        get_player(content).then(function(){
            console.log('get player complete!')
            return get_registration(content, match_id)
        }).then(function(){
            return get_goals(content, match_id)
        }).then(function(){
            return get_events(content, match_id)
        }).then(function(){
            console.log('all event complete')
            next()
        })
    }
}).on('complete',function(){
    console.log(crawler.queue.length)
    console.log('complete')
    process.exit()
}).on('fetcherror',function(queueItem, response){
    console.log('fetcherror');
    console.log(queueItem.path)
}).on('fetchtimeout',function(queueItem, response){
    crawler.queueURL(host + queueItem.path);
    console.log('fetchtimeout:' + queueItem.path)
}).on('fetchclienterror',function(queueItem, errorData){
    console.log('fetchclienterror')
});
crawler.queueURL(host + '/MatchesFeed/914891/MatchCentre2');
crawler.start();

/*excute(mysql.format('SELECT DISTINCT(match_id) FROM `whoscored_registration`')).then(function(row){
    var matches_id = _.map(row,function(item){
        return item.match_id
    });
    //console.log(mysql.format('SELECT id FROM `whoscored_matches` WHERE score1 IS NOT NULL AND score2 IS NOT NULL AND match_id NOT IN ?',[[matches_id]]))
    return excute(mysql.format('SELECT id FROM `whoscored_matches` WHERE score1 IS NOT NULL AND score2 IS NOT NULL AND match_id NOT IN ?',[[matches_id]]))
}).then(function(row){
    if(row.length){
        _.each(row,function(item){
            var path = '/MatchesFeed/'+item.id+'/MatchCentre2';
            excute(mysql.format('SELECT 1 FROM `url_status` WHERE url = ?',[path])).then(function(row){
                if(!row.length){
                    crawler.queueURL(host + '/MatchesFeed/'+item.id+'/MatchCentre2');
                }
            })
        })
        crawler.start();
    }
})*/
//http://www.whoscored.com/matchesfeed/?d=20141021
//http://www.whoscored.com/tournamentsfeed/9155/Fixtures/?d=2014W42&isAggregate=false