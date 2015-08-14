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
get_registration = require('./registration').get_registration,
get_events = require('./events').get_events,
whoscored_registration = require('./whoscored_registration'),
get_team = require('./get_team'),
get_match = require('./get_matches'),
get_goals = require('./goals').get_goals,
get_stages = require('./get_stages'),
get_regions = require('./get_regions'),
get_seasons = require('./get_seasons'),
get_tournaments = require('./get_tournaments'),
get_player = require('../../model/whoscored/player').get_player,
Match = require('../../model/whoscored/matches').model,
Team = require('../../model/whoscored/team').model,
getMatchCentrePlayerStatistics = require('../../model/whoscored/statistics').getMatchCentrePlayerStatistics,
migrate = require('../../migrate/whoscored/migrate').migrate,
_ = require('underscore'),
input_date = process.argv[2],
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
        excute(mysql.format('SELECT 1 FROM `url_status` WHERE url = ?',[queueItem.path])).then(function(row){
            if(!row.length){
                return excute(mysql.format('INSERT INTO `url_status` SET ?',{
                    url:queueItem.path,
                    status_code:queueItem.stateData.code,
                    is_empty:0
                }))
            }
        });
        if(/^\/matchesfeed\/\?d\=\d{8}$/.test(queueItem.path)){
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
                    stage_id,team1_id,team2_id,play_at,score;
                    //console.log(match_id)
                    var promise = sequence.then(function(){
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
                        var modelMatch = new Match(values);
                        return modelMatch.save();
                        //return get_match(match,queueItem.path.replace(/^\/matchesfeed\/\?d\=(\d{4})(\d{2})(\d{2})$/,"$1-$2-$3"))
                    }).then(function(){
                        console.log('match complete!')
                        var team1 = new Team({
                            id : team1_id,
                            name : match[5]
                        }),team2 = new Team({
                            id : team2_id,
                            name : match[9]
                        });
                        return team1.save().then(function(){
                            return team2.save();
                        });
                    });
                    if(match[14] && match[15]){
                        promise.then(function(){
                            return excute('SELECT 1 FROM `whoscored_registration` WHERE match_id = '+match_id).then(function(row){
                                if(!row.length){
                                    crawler.queueURL(host + '/MatchesFeed/'+match_id+'/MatchCentre2');
                                }
                            })
                        }).then(function(){
                            return excute(mysql.format('SELECT * FROM `whoscored_match_player_statistics` WHERE matchId = ? AND teamId = ?',[match_id,match[4]])).then(function(row){
                                if(!row.length){
                                    crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+match[4]+'&matchId='+match_id);
                                    crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=passing&statsAccumulationType=0&teamIds='+match[4]+'&matchId='+match_id);
                                    crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=defensive&statsAccumulationType=0&isCurrent=true&teamIds='+match[4]+'&matchId='+match_id);
                                    crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=offensive&statsAccumulationType=0&isCurrent=true&teamIds='+match[4]+'&matchId='+match_id);
                                }
                            })
                        }).then(function(){
                            return excute(mysql.format('SELECT 1 FROM `whoscored_match_player_statistics` WHERE matchId = ? AND teamId = ?',[match_id,match[8]])).then(function(row){
                                if(!row.length){
                                    crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+match[8]+'&matchId='+match_id);
                                    crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=passing&statsAccumulationType=0&teamIds='+match[8]+'&matchId='+match_id);
                                    crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=defensive&statsAccumulationType=0&isCurrent=true&teamIds='+match[8]+'&matchId='+match_id);
                                    crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=offensive&statsAccumulationType=0&isCurrent=true&teamIds='+match[8]+'&matchId='+match_id);
                                }
                            })
                        });
                    }
                    return promise;
                },Promise.resolve())
            }).then(function(){
                console.log('all match complete')
                next();
            });
        };
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
                    console.log('all event complete')
                    next()
                })
            }
        }
        if(/^\/StatisticsFeed\/1\/GetMatchCentrePlayerStatistics.*?/.test(queueItem.path)){
            next = this.wait();
            getMatchCentrePlayerStatistics(queueItem, content, response).then(function(){
                next();
            })
        }
    }/* else {
        next = this.wait();
        //如果抓取到的内容为空，则存到数据库中，以便下次有该URL时可以忽略
        excute(mysql.format('SELECT 1 FROM `url_status` WHERE url = ?',[queueItem.path])).then(function(row){
            if(!row.length){
                return excute(mysql.format('INSERT INTO `url_status` SET ?',{
                    url:queueItem.path,
                    status_code:queueItem.stateData.code,
                    is_empty:1
                }))
            }
        }).then(function(){
            next();
        });
    }*/
}).on('complete',function(){
    console.log(crawler.queue.length)
    console.log('complete')
    process.exit()
}).on('fetcherror',function(queueItem, response){
    console.log(queueItem.stateData.code);
    console.log(queueItem.path)
    //如果抓取过程中出现错误，则存到数据库中，以便下次有该URL时可以忽略
    /*excute(mysql.format('SELECT 1 FROM `url_status` WHERE url = ?',[queueItem.path])).then(function(row){
        if(!row.length){
            excute(mysql.format('INSERT INTO `url_status` SET ?',{
                url:queueItem.path,
                status_code:queueItem.stateData.code,
                is_empty:1
            }))
        }
    })*/
    //crawler.queueURL(host + queueItem.path);
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
//初始化函数，目的是将当前数据库的的数据取出，用来查询数据是否存在，而不再用SELECT做查询而占用SQL连接。
/*excute("CREATE TABLE IF NOT EXISTS `whoscored_registration` (\
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
        `match_id` int(10) unsigned NOT NULL,\
        `player_id` int(10) unsigned NOT NULL,\
        `shirt_no` tinyint(3) unsigned DEFAULT NULL,\
        `team_id` int(10) unsigned NOT NULL,\
        `is_first_eleven` boolean NOT NULL DEFAULT '0',\
        `is_man_of_the_match` boolean NOT NULL DEFAULT '0',\
        PRIMARY KEY (`id`)\
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;")*/
var date = [],
condition = 0,
now = moment.utc(),
clone = now.clone();
Promise.resolve().then(function(){
    console.log('初始化结束......');
    crawler.queueURL(host + '/matchesfeed/?d=' + now.tz('Europe/London').format('YYYYMMDD'));
    return excute('SELECT DISTINCT play_at FROM whoscored_matches ORDER BY play_at ASC');
    /*if(input_date){
        if(/^\d{8}$/.test(input_date)){
            crawler.queueURL(host + '/matchesfeed/?d=' + input_date);
        }
        //当输入的是日期间隔时
        if(/^\d{8}\~\d{8}$/.test(input_date)){
            var dateArray = input_date.split('~');
            var start = moment.utc(dateArray[0],'YYYYMMDD').valueOf(), end = moment.utc(dateArray[1],'YYYYMMDD').valueOf();
            for (var i = end; i >= start; i-=24*60*60*1000) {
                crawler.queueURL(host + '/matchesfeed/?d=' + moment.utc(i).format('YYYYMMDD'));
            };
        }
        //当输入的只有4位数时，获取输入年份到现在的所有数据
        if(/^\d{4}$/.test(input_date)){
            var start = moment.utc(input_date + "-01-01").valueOf(), end = moment.utc().valueOf();
            for (var i = end; i >= start; i-=24*60*60*1000) {
                crawler.queueURL(host + '/matchesfeed/?d=' + moment.utc(i).format('YYYYMMDD'));
            };
        }
        crawler.start();
    } else {
        console.log('there is no date provided, get the recent matches result')
        var date = [],
        now = moment.utc(),
        end;
        excute('SELECT DISTINCT play_at FROM whoscored_matches WHERE score1 IS NULL AND score2 IS NULL ORDER BY play_at ASC').then(function(matches){
            return matches.reduce(function(sequence, match){
                var play_at = moment.utc(match.play_at),
                dateString = play_at.tz('Europe/London').format('YYYYMMDD');
                return sequence.then(function(){
                    return excute(mysql.format('SELECT 1 FROM `url_status` WHERE url = ?',['/matchesfeed/?d=' + dateString]))
                }).then(function(row){
                    if(!row.length && _.indexOf(date,dateString) == -1){
                        date.push(dateString)
                        crawler.queueURL(host + '/matchesfeed/?d=' + dateString);
                    }
                })
            },Promise.resolve())
        },function(err){
            console.log(err)
        }).then(function(){
            return excute('SELECT DISTINCT play_at FROM whoscored_matches ORDER BY play_at ASC LIMIT 1');
        }).then(function(row){//从最初的时间开始检查有哪天是缺失的，然后去抓
            var clone = now.clone(),
            condition = 1,
            end = moment.utc(row[0].play_at).tz('Europe/London').format('YYYYMMDD');
            console.log(clone.tz('Europe/London').format('YYYYMMDD'));
            crawler.queueURL(host + '/matchesfeed/?d=' + clone.tz('Europe/London').format('YYYYMMDD'));
            promiseWhile(function(){
                return condition;
            },function(){
                var play_at = clone.subtract(1, 'days').format('YYYYMMDD'),
                url = '/matchesfeed/?d=' + play_at;
                return excute(mysql.format('SELECT 1 FROM `url_status` WHERE url = ?',[url])).then(function(row){
                    if(!row.length && _.indexOf(date,play_at) == -1){
                        crawler.queueURL(host + url);
                    }
                    if(play_at == end){
                        condition = 0;
                    }
                });
            }).then(function(){
                //alert('done');
                crawler.start();
            });
        });
    }*/
}).then(function(row){
    return row.reduce(function(sequence, match){
        var play_at = moment.utc(match.play_at),
        dateString = play_at.tz('Europe/London').format('YYYYMMDD');
        return sequence.then(function(){
            if(_.indexOf(date,dateString) == -1){
                date.push(dateString)
            }
        })
    },Promise.resolve())
}).then(function(){
    return promiseWhile(function(){
        return condition < 1;
    },function(){
        var play_at = clone.subtract(1, 'days').format('YYYYMMDD'),
        url;
        if(_.indexOf(date,play_at) == -1){
            url = '/matchesfeed/?d=' + play_at;
            console.log(url)
            crawler.queueURL(host + url);
            ++condition;
        }
    })
}).then(function(){
    //alert('done');
    crawler.start();
});

function promiseWhile(condition, body) {
  return new Promise(function(resolve,reject){

    function loop() {
      Promise.resolve(condition()).then(function(result){
        // When the result of calling `condition` is no longer true, we are done.
        if (!result){
          resolve();
        } else {
          // When it completes loop again otherwise, if it fails, reject
          Promise.resolve(body()).then(loop,reject);
        }
      });
    }

    // Start running the loop
    loop();
  });
}

//http://www.whoscored.com/matchesfeed/?d=20141021
//http://www.whoscored.com/tournamentsfeed/9155/Fixtures/?d=2014W42&isAggregate=false