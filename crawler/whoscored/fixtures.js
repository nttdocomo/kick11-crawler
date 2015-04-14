var _ = require('underscore'),excute = require('../../excute'),
host = 'http://www.whoscored.com',
Crawler = require("simplecrawler"),
moment = require('moment'),
moment_tz = require('moment-timezone'),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
asyncLoop = require('../../asyncLoop'),
decoder = new StringDecoder('utf8'),
whoscored_matches = [],
whoscored_teams = [],
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
    var html = decoder.write(responseBuffer);
    //console.log(queueItem.path);
    if(/^(\/\w+?\/\d{1,5}){4}\/Fixtures$/i.test(queueItem.path)){
        var min = html.match(/var\smin\s\=\snew\sDate\(\d{4}\,\s\d{1,2}\,\s\d{1,2}\)\;/)[0],
        max = html.match(/var\smax\s\=\snew\sDate\(\d{4}\,\s\d{1,2}\,\s\d{1,2}\)\;/)[0],
        date;
        min = min.match(/(\d{4})\,\s(\d{1,2})\,\s(\d{1,2})/);
        max = max.match(/(\d{4})\,\s(\d{1,2})\,\s(\d{1,2})/);
        //console.log(max)
        min = moment({
            y:min[1],
            M:min[2],
            d:min[3]
        });
        max = moment({
            y:max[1],
            M:max[2],
            d:max[3]
        });
        var stage_id = queueItem.path.match(/(\d{1,5})/g)[3];
        console.log('Stage:'+stage_id+'start at '+min.format('YYYY-MM-DD')+'. End at ' + max.format('YYYY-MM-DD'))
        //console.log(min.format('YYYYMM'))
        //console.log('/tournamentsfeed/'+stage_id+'/Fixtures/?d='+min.format('YYYYMM')+'&isAggregate=false')
        crawler.queueURL(host + '/tournamentsfeed/12081/Fixtures/?d='+min.format('YYYYMM')+'&isAggregate=false')
        //console.log(min.format('YYYYMM'))
        while (min.get('month') < max.get('month')){
            //console.log('/tournamentsfeed/'+stage_id+'/Fixtures/?d='+min.add(1, 'months').format('YYYYMM')+'&isAggregate=false')
            crawler.queueURL(host + '/tournamentsfeed/12081/Fixtures/?d='+min.add(1, 'months').format('YYYYMM')+'&isAggregate=false')
            //console.log(min.add(1, 'months').format('YYYYMM'))
        }
    }
    if(/^\/tournamentsfeed\/(\d{1,})\/Fixtures\/\?d\=\d{6}.+/.test(queueItem.path)){
        var match_stage_id = queueItem.path.match(/^\/tournamentsfeed\/(\d{1,})\/Fixtures\/\?d\=\d{6}.+/)[1]
        tournamentsfeed = eval(decoder.write(responseBuffer));
        asyncLoop(tournamentsfeed.length,function(loop){
            var fixture = tournamentsfeed[loop.iteration()];
            if(!fixture){
                console.log(queueItem.path);
                return false;
            }
            var match_id = fixture[0],
            play_at = moment.tz(fixture[2],"Europe/London").utc().format('YYYY-MM-DD HH:mm'),
            team1_id = fixture[4],
            team1_name = fixture[5],
            team2_id = fixture[7],
            team2_name = fixture[8],
            full_time = fixture[10],
            half_time = fixture[11],
            complete = fixture[13],
            values = {
                'team1_id':team1_id,
                'team2_id':team2_id,
                'play_at':play_at,
                'stage_id':match_stage_id
            };
            if(full_time !== 'vs'){
                values.score1 = full_time.split(':')[0].replace(/\s/g);
                values.score2 = full_time.split(':')[1].replace(/\s/g);
                values.score1_1st = half_time.split(':')[0].replace(/\s/g);
                values.score2_1st = half_time.split(':')[1].replace(/\s/g);
            };
            var excute_functions = [function(){
                if(!_.contains(whoscored_matches, match_id)){
                    values.id = match_id;
                    whoscored_matches.push(match_id);
                    excute(mysql.format('INSERT INTO whoscored_matches  SET ?', values));
                } else {
                    excute(mysql.format('UPDATE whoscored_matches  SET ? WHERE id = ?', [values,match_id]));
                }
            },function(){
                if(!_.contains(whoscored_teams, team1_id)){
                    whoscored_teams.push(team1_id)
                    excute(mysql.format('INSERT INTO whoscored_teams  SET ?', {
                        id:team1_id,
                        name:team1_name
                    }));
                }
            },function(){
                if(!_.contains(whoscored_teams, team2_id)){
                    whoscored_teams.push(team2_id)
                    excute(mysql.format('INSERT INTO whoscored_teams  SET ?', {
                        id:team2_id,
                        name:team2_name
                    }));
                }
            }];
            asyncLoop(init_func.length,function(loop){
                var func = init_func[loop.iteration()];
                func(function(){
                    loop.next();
                })
            },function(){
                loop.next()
            })
        },function(){
            console.log('fixtures fetch complete');
        })
    }
    //var max = new Date(2015, 9, 31);

    //console.log(JSON.parse(decoder.write(responseBuffer)));
}).on('complete',function(){
    console.log('complete')
}).on('fetcherror',function(queueItem, response){
    console.log('fetcherror')
}).on('fetchtimeout',function(queueItem, response){
    crawler.queueURL(host + queueItem.path);
    console.log('fetchtimeout:' + queueItem.path)
}).on('fetchclienterror',function(queueItem, errorData){
    console.log('fetchclienterror')
});
var init_func = [function(cb){
    excute('SELECT id FROM `whoscored_matches`',function(rows){//先从数据库里将所有tournaments取出来
        if(rows.length){
            whoscored_matches = rows.map(function(whoscored_matche){
                return whoscored_matche.id;
            })
        }
        cb()
    });
},function(cb){
    excute('SELECT id FROM `whoscored_teams`',function(rows){//先从数据库里将所有tournaments取出来
        if(rows.length){
            whoscored_teams = rows.map(function(whoscored_team){
                return whoscored_team.id;
            })
        }
        cb()
    });
}]
asyncLoop(init_func.length,function(loop){
    var func = init_func[loop.iteration()];
    func(function(){
        loop.next();
    })
},function(){
    excute('SELECT whoscored_stages.*,whoscored_tournaments.region_id FROM `whoscored_stage_event` JOIN `whoscored_stages` ON whoscored_stages.id = whoscored_stage_event.stage_id JOIN `whoscored_tournaments` ON whoscored_tournaments.id = whoscored_stages.tournament_id WHERE event_id IN (SELECT id FROM `events`)',function(rows){
        if(rows.length){
            _.each(rows,function(row){
                console.log(row);
                crawler.queueURL(host + '/Regions/'+row.region_id+'/Tournaments/'+row.tournament_id+'/Seasons/'+row.season_id+'/Stages/'+row.id+'/Fixtures')
            })
            crawler.start();
        }
    })
})