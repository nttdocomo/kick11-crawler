/**
 * @author nttdocomo
 */
var http = require("http"),
excute = require('../../excute'),
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
regions = [],
tournaments = [],
seasons = [],
stages = [],
matches = [],
teams = [],
players = [],
isInItems = function(items){
    return function(id){
        if(_.isString(id)){
            id = parseInt(id)
        }
        var isInDataBase = _.contains(items, id);
        if(!isInDataBase){
            items.push(id)
        }
        return isInDataBase;
    }
},
crawler = new Crawler('www.whoscored.com');
crawler.maxConcurrency = 4;
crawler.interval = 500;
crawler.timeout = 15000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36';
crawler.customHeaders = {
    Host:'www.whoscored.com',
    Referer:'http://www.whoscored.com/LiveScores',
    'X-Requested-With':'XMLHttpRequest',
    Cookie:'__gads=ID=7400c9eb48861252:T=1407717687:S=ALNI_MZbNZufnguyMAdt6A2DXy8Hirg7oA; ebNewBandWidth_.www.whoscored.com=863%3A1408183698417; ui=nttdocomo:bjmU8NSBC0WzoKOkAO-9TQ:3619521175:SHKLWvTkwNCw4YKgZQA0cg8IkHCbOnpSkXIJdsjHZI8; ua=nttdocomo:bjmU8NSBC0WzoKOkAO-9TQ:3619521175:Cmahf0NIXa_v-sD8BkI3Tg9HVIkTt2NruY5jcRetDrM; mp_430958bdb5bff688df435b09202804d9_mixpanel=%7B%22distinct_id%22%3A%20%22148d138493249-047e04049-4748012e-1fa400-148d138493396%22%2C%22%24initial_referrer%22%3A%20%22http%3A%2F%2Fwww.whoscored.com%2FMatches%2F829543%2FLive%22%2C%22%24initial_referring_domain%22%3A%20%22www.whoscored.com%22%7D; _gat=1; _ga=GA1.2.458243098.1407717765'
};
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var next = this.wait();
    var decoder = new StringDecoder('utf8'),content,matchesfeed,matchCentre2;
    //console.log(decoder.write(responseBuffer));
    if(/^\/matchesfeed\/\?d\=\d{8}$/.test(queueItem.path)){
        matchesfeed = eval(decoder.write(responseBuffer));
        //将teams里没有的team放到teams;
        get_stages(matchesfeed[1],isInItems(stages)).then(function(){
            return get_regions(matchesfeed[1],isInItems(regions))
        }).then(function(){
            return get_seasons(matchesfeed[1],isInItems(seasons));
        }).then(function(){
            return get_tournaments(matchesfeed[1],isInItems(tournaments));
        }).then(function(){
            return matchesfeed[2].reduce(function(sequence, match){
                var match_id = match[1];
                crawler.queueURL(host + '/MatchesFeed/'+match_id+'/MatchCentre2');
                return get_match(match,queueItem.path.replace(/^\/matchesfeed\/\?d\=(\d{4})(\d{2})(\d{2})$/,"$1-$2-$3")).then(function(){
                    return get_team(match,isInItems(teams))
                })
            },Promise.resole())
        }).then(next);
    };
    if(/^\/MatchesFeed\/(\d{1,})\/MatchCentre2$/.test(queueItem.path)){
        content = decoder.write(responseBuffer);
        var match_id = queueItem.path.replace(/^\/MatchesFeed\/(\d{1,})\/MatchCentre2$/,"$1");
        if(content !== null){
            matchCentre2 = JSON.parse(content);
            if(matchCentre2 !== null){
                get_player(matchCentre2).then(function(){
                    return whoscored_registration(matchCentre2, match_id)
                }).then(function(){
                    return get_goals(content, match_id)
                }).then(next)
            } else {
                next()
            }
        } else {
            next()
        }
    }
}).on('complete',function(){
    console.log(crawler.queue.length)
    console.log('complete')
    migrate()
}).on('fetcherror',function(queueItem, response){
    console.log('fetcherror')
}).on('fetchtimeout',function(queueItem, response){
    crawler.queueURL(host + queueItem.path);
    console.log('fetchtimeout:' + queueItem.path)
}).on('fetchclienterror',function(queueItem, errorData){
    console.log('fetchclienterror')
});
//初始化函数，目的是将当前数据库的的数据取出，用来查询数据是否存在，而不再用SELECT做查询而占用SQL连接。
var init_func = [function(cb){
    excute('SELECT id FROM whoscored_stages',function(rows){//先从数据库里将所有stages取出来
        if(rows.length){
            stages = rows.map(function(stage){
                return stage.id;
            })
        }
        cb()
    });
},function(cb){
    excute('SELECT id FROM whoscored_regions',function(rows){//先从数据库里将所有regions取出来、
        if(rows.length){
            regions = rows.map(function(region){
                return region.id;
            })
        }
        cb()
    });
},function(cb){
    excute('SELECT id FROM whoscored_tournaments',function(rows){//先从数据库里将所有tournaments取出来
        if(rows.length){
            tournaments = rows.map(function(tournament){
                return tournament.id;
            })
        }
        cb()
    });
},function(cb){
    excute('SELECT id FROM whoscored_seasons',function(rows){//先从数据库里将所有regions取出来
        if(rows.length){
            seasons = rows.map(function(season){
                return season.id;
            })
        }
        cb()
    });
},function(cb){
    excute("CREATE TABLE IF NOT EXISTS `whoscored_registration` (\
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
        `match_id` int(10) unsigned NOT NULL,\
        `player_id` int(10) unsigned NOT NULL,\
        `shirt_no` tinyint(3) unsigned DEFAULT NULL,\
        `team_id` int(10) unsigned NOT NULL,\
        `is_first_eleven` boolean NOT NULL DEFAULT '0',\
        `is_man_of_the_match` boolean NOT NULL DEFAULT '0',\
        PRIMARY KEY (`id`)\
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;",cb)
}]
asyncLoop(init_func.length,function(loop){
    var func = init_func[loop.iteration()];
    func(function(){
        loop.next();
    })
},function(){
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
        excute('SELECT play_at FROM `whoscored_matches` ORDER BY `play_at` DESC LIMIT 1',function(matches){
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