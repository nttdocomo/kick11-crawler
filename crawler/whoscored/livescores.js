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
    //console.log(decoder.write(responseBuffer));
    if(/^\/matchesfeed\/\?d\=\d{8}$/.test(queueItem.path)){
        console.log('matchesfeed')
        matchesfeed = eval(decoder.write(responseBuffer));
        next = this.wait();
        //将teams里没有的team放到teams;
        get_stages(matchesfeed[1]).then(function(){
            console.log('get stages complete!')
            return get_regions(matchesfeed[1])
        }).then(function(){
            console.log('get regions complete!')
            return get_seasons(matchesfeed[1]);
        }).then(function(){
            console.log('get seasons complete!')
            return get_tournaments(matchesfeed[1]);
        }).then(function(){
            console.log('get tournaments complete!')
            return matchesfeed[2].reduce(function(sequence, match){
                var match_id = match[1];
                crawler.queueURL(host + '/MatchesFeed/'+match_id+'/MatchCentre2');
                /*crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+match[4]+'&matchId='+match_id);
                crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=passing&statsAccumulationType=0&teamIds='+match[4]+'&matchId='+match_id);
                crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=defensive&statsAccumulationType=0&isCurrent=true&teamIds='+match[4]+'&matchId='+match_id);
                crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=offensive&statsAccumulationType=0&isCurrent=true&teamIds='+match[4]+'&matchId='+match_id);
                crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+match[8]+'&matchId='+match_id);
                crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=passing&statsAccumulationType=0&teamIds='+match[8]+'&matchId='+match_id);
                crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=defensive&statsAccumulationType=0&isCurrent=true&teamIds='+match[8]+'&matchId='+match_id);
                crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=offensive&statsAccumulationType=0&isCurrent=true&teamIds='+match[8]+'&matchId='+match_id);*/
                return sequence.then(function(){
                    return get_match(match,queueItem.path.replace(/^\/matchesfeed\/\?d\=(\d{4})(\d{2})(\d{2})$/,"$1-$2-$3")).then(function(){
                        return get_team(match)
                    })
                })
            },Promise.resolve())
        }).then(function(){
            console.log('all match complete')
            next()
        });
    };
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
                    return get_goals(matchCentre2, match_id)
                }).then(function(){
                    console.log('all event complete')
                    next()
                })
            }
        }
    }
}).on('complete',function(){
    console.log(crawler.queue.length)
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
//初始化函数，目的是将当前数据库的的数据取出，用来查询数据是否存在，而不再用SELECT做查询而占用SQL连接。
excute("CREATE TABLE IF NOT EXISTS `whoscored_registration` (\
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
        `match_id` int(10) unsigned NOT NULL,\
        `player_id` int(10) unsigned NOT NULL,\
        `shirt_no` tinyint(3) unsigned DEFAULT NULL,\
        `team_id` int(10) unsigned NOT NULL,\
        `is_first_eleven` boolean NOT NULL DEFAULT '0',\
        `is_man_of_the_match` boolean NOT NULL DEFAULT '0',\
        PRIMARY KEY (`id`)\
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;").then(function(){
    console.log('初始化结束......');
    if(input_date){
        if(input_date.length == 8){
            crawler.queueURL(host + '/matchesfeed/?d=' + input_date);
        }
        if(input_date.length == 4){
            var start = moment.utc(input_date + "-01-01").valueOf(), end = moment.utc().valueOf();
            for (var i = end; i >= start; i-=24*60*60*1000) {
                crawler.queueURL(host + '/matchesfeed/?d=' + moment.utc(i).format('YYYYMMDD'));
            };
        }
        crawler.start();
    } else {
        excute('SELECT play_at FROM `whoscored_matches` ORDER BY `play_at` DESC LIMIT 1').then(function(matches){
            if(matches.length){
                var match = matches[0],
                play_at = match.play_at;
                var now = moment(),
                diff = now.diff(moment(play_at).add(1,'days'), 'days');
                console.log(now.format('YYYYMMDD'))
                console.log(moment(play_at).add(1,'days').format('YYYYMMDD'))
                for (var i = diff - 1; i >= 0; i--) {
                    var begin = moment(play_at).add(1,'days');
                    var date = begin.add(i,'days').format('YYYYMMDD')
                    console.log(date);
                    crawler.queueURL(host + '/matchesfeed/?d=' + date);
                };
            }
            crawler.start();
        })
        //crawler.queueURL(host + '/matchesfeed/?d=' + moment.utc().format('YYYYMMDD'));
    }
})


//http://www.whoscored.com/matchesfeed/?d=20141021
//http://www.whoscored.com/tournamentsfeed/9155/Fixtures/?d=2014W42&isAggregate=false