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
getMatchCentrePlayerStatistics = require('../../model/whoscored/statistics').getMatchCentrePlayerStatistics,
statistic = require('../../model/kick11/statistic'),
getMatchesFeed = require('./getmatchesfeed'),
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
        /*if(/^\/matchesfeed\/\?d\=\d{8}$/.test(queueItem.path)){
            console.log('matchesfeed')
            //将teams里没有的team放到teams;
            matchesfeed = eval(decoder.write(responseBuffer));
            next = this.wait();
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
                console.log('get tournaments complete!');
                return matchesfeed[2].reduce(function(sequence, match){
                    var match_id = match[1],
                    //console.log(match_id)
                    stage_id = match[0],
                    team1_id = match[4],
                    team2_id = match[8],
                    play_at = moment.tz([queueItem.path.replace(/^\/matchesfeed\/\?d\=(\d{4})(\d{2})(\d{2})$/,"$1-$2-$3"),match[3]].join(' '),"Europe/London").utc().format('YYYY-MM-DD HH:mm'),
                    score = match[12],
                    values = {
                        'id':match_id,
                        'team1_id':team1_id,
                        'team2_id':team2_id,
                        'play_at':play_at,
                        'stage_id':stage_id
                    };
                    if(score != 'vs'){
                        values.score1 = score.split(/\s\:\s/)[0];
                        values.score2 = score.split(/\s\:\s/)[1];
                    }
                    var whoscoredMatch = new WhoscoredMatch(values);
                    var team1 = new Team({
                        id : team1_id,
                        name : match[5]
                    }),team2 = new Team({
                        id : team2_id,
                        name : match[9]
                    });
                    var promise = sequence.then(function(){
                        console.log('get match')
                        return whoscoredMatch.save();
                        //return get_match(match,queueItem.path.replace(/^\/matchesfeed\/\?d\=(\d{4})(\d{2})(\d{2})$/,"$1-$2-$3"))
                    }).then(function(){
                        return Match.save_from_whoscored(values);
                    }).then(function(){
                        return team1.save()
                    }).then(function(){
                        return team2.save();
                    }).then(function(){
                        console.log('get team complete')
                        return Promise.resolve()
                    });
                    if(match[14] && match[15]){
                        promise.then(function(){
                            return excute('SELECT 1 FROM `whoscored_registration` WHERE match_id = '+match_id).then(function(row){
                                if(!row.length){
                                    crawler.queueURL(host + '/MatchesFeed/'+match_id+'/MatchCentre2');
                                }
                                return Promise.resolve()
                            })
                        }).then(function(){
                            return excute(mysql.format('SELECT * FROM `whoscored_match_player_statistics` WHERE matchId = ? AND teamId = ?',[match_id,match[4]])).then(function(row){
                                if(!row.length){
                                    crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+match[4]+'&matchId='+match_id);
                                    crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=passing&statsAccumulationType=0&teamIds='+match[4]+'&matchId='+match_id);
                                    crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=defensive&statsAccumulationType=0&isCurrent=true&teamIds='+match[4]+'&matchId='+match_id);
                                    crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=offensive&statsAccumulationType=0&isCurrent=true&teamIds='+match[4]+'&matchId='+match_id);
                                }
                                return Promise.resolve()
                            })
                        }).then(function(){
                            return excute(mysql.format('SELECT 1 FROM `whoscored_match_player_statistics` WHERE matchId = ? AND teamId = ?',[match_id,match[8]])).then(function(row){
                                if(!row.length){
                                    crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+match[8]+'&matchId='+match_id);
                                    crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=passing&statsAccumulationType=0&teamIds='+match[8]+'&matchId='+match_id);
                                    crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=defensive&statsAccumulationType=0&isCurrent=true&teamIds='+match[8]+'&matchId='+match_id);
                                    crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=offensive&statsAccumulationType=0&isCurrent=true&teamIds='+match[8]+'&matchId='+match_id);
                                }
                                return Promise.resolve()
                            })
                        });
                    }
                    return promise;
                },Promise.resolve())
            }).then(function(){
                console.log('all match complete')
                next();
            });
        };*/
        if(/^\/MatchesFeed\/(\d{1,})\/MatchCentre2$/.test(queueItem.path)){
            var match_id = queueItem.path.replace(/^\/MatchesFeed\/(\d{1,})\/MatchCentre2$/,"$1");
            console.log(typeof(content));
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
                    return MatchEvent.save_from_whoscored(content, match_id)
                }).then(function(){
                    console.log('all event complete')
                    next()
                })
            }
        }
        if(/^\/StatisticsFeed\/1\/GetMatchCentrePlayerStatistics.*?/.test(queueItem.path)){
            next = this.wait();
            getMatchCentrePlayerStatistics(queueItem, content).then(function(){
                return statistic.save_from_whoscored(queueItem, content)
            }).then(function(){
                next();
            })
        }
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