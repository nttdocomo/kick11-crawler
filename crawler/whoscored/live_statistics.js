/**
 * @author nttdocomo
 */
var http = require("http"), fs = require('fs'), cheerio = require('cheerio'),excute = require('../transfermarkt.co.uk/excute'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),moment = require('moment'),moment_tz = require('moment-timezone'),
Crawler = require("simplecrawler"),pool  = require('../transfermarkt.co.uk/pool'),
host = 'http://www.whoscored.com';
_ = require('underscore');
crawler = new Crawler('www.whoscored.com');
crawler.maxConcurrency = 2;
crawler.interval = 300;
crawler.timeout = 10000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.customHeaders = {
    Host:'www.whoscored.com',
    Referer:'http://www.whoscored.com/LiveScores',
    'X-Requested-With':'XMLHttpRequest',
    Cookie:'__gads=ID=7400c9eb48861252:T=1407717687:S=ALNI_MZbNZufnguyMAdt6A2DXy8Hirg7oA; ebNewBandWidth_.www.whoscored.com=863%3A1408183698417; ui=nttdocomo:bjmU8NSBC0WzoKOkAO-9TQ:3619521175:SHKLWvTkwNCw4YKgZQA0cg8IkHCbOnpSkXIJdsjHZI8; ua=nttdocomo:bjmU8NSBC0WzoKOkAO-9TQ:3619521175:Cmahf0NIXa_v-sD8BkI3Tg9HVIkTt2NruY5jcRetDrM; mp_430958bdb5bff688df435b09202804d9_mixpanel=%7B%22distinct_id%22%3A%20%22147c283461b55-0841a221e-4e46072c-1fa400-147c283461d11f%22%2C%22%24initial_referrer%22%3A%20%22http%3A%2F%2Fwww.whoscored.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.whoscored.com%22%7D; _ga=GA1.2.458243098.1407717765'
}

crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8');
    //console.log(decoder.write(responseBuffer));
    if(/^\/tournamentsfeed\/\d{1,4}\/Fixtures\/\?d\=\d{4}W\d{2}\&isAggregate\=false$/.test(queueItem.path)){
        var matches = eval(decoder.write(responseBuffer));
        matches.forEach(function(match){
            var match_id = match[0],
            team1_id = match[4],
            team1_name = match[5],
            team2_id = match[7],
            team2_name = match[8],
            play_at = moment("[match[2],match[3]].join(' ')", "dddd, MMM DD YYYY hh:mm").format('YYYY-MM-DD hh:mm'),
            score1 = match[10].split(/\s\:\s/)[0],
            score2 = match[10].split(/\s\:\s/)[1],
            score1i = match[11].split(/\s\:\s/)[0],
            score2i = match[11].split(/\s\:\s/)[1];
            crawler.queueURL(host + '/Matches/'+match_id+'/LiveStatistics');
        })
    }
    if(/^\/\w+?\/\?d\=\d{8}$/.test(queueItem.path)){
        var data = eval(decoder.write(responseBuffer)),
        stages = data[1],
        matches = data[2];
        stages.forEach(function(stage){
            var id = stage[0],
            region_id = stage[1],
            country_name = stage[3],
            season_id = stage[6],
            stage_name = stage[7]
        })
        matches.forEach(function(match){
            var id = match[1],
            stage_id = match[0],
            team1_id = match[4],
            team2_id = match[8],
            team1_name = match[5],
            team2_name = match[9],
            result = match[12];
            crawler.queueURL(host + '/Matches/'+id+'/LiveStatistics');
        })
    }
    if(/^\/\w+?\/(\d{1,})\/\w+$/.test(queueItem.path)){
        console.log(queueItem.path);
        //var html = decoder.write(responseBuffer);//.replace(/\sinitialData\s\=\s(\[\[\[.+?\d{1}\])\s;.+?/,"$1");
        var $ = cheerio.load(decoder.write(responseBuffer));
        var match_id = queueItem.path.replace(/^\/\w+?\/(\d{1,})\/\w+$/,'$1');
        //console.log($('script').eq(16).html().replace(/\n/ig,'\\n').replace(/\s/ig,'\\s').replace(/\t/ig,'\\t'));
        $('script').each(function(i,script){
            var html = $(script).html().replace(/[\s|\n]/ig,"");
            if(/^var\S+?(\[\[\[.+?\])\;\$\S+?\}\)\;$/.test(html)){
                html = $(script).html().replace(/[\n|\r]/ig,'').replace(/\s{2,}/ig,'').replace(/\s(\;)/ig,'$1').replace(/(\,)\s(\d)/ig,'$1$2');
                //console.log($(script).html().replace(/\n/ig,'').replace(/\s{2,}/ig,'').replace(/\s/ig,'\\s').replace(/\t/ig,''));
                //console.log(html.replace(/.+?(\[\[\[.+\,\d\])\;.+/,'$1'))
                /*fs.open('./index.html', 'w', 0666, function(e, fd) {
                    if (e) {
                      console.log('错误信息：' + e);
                    } else {
                      fs.write(fd, html.replace(/.+?(\[\[\[.+\,\d\])\;.+/,'$1'), 0, 'utf8', function(e) {
                        if (e) {
                          console.log('出错信息：' + e);
                        } else {
                          fs.closeSync(fd);
                        }
                      });
                    }
                });*/
                var data = eval(html.replace(/.+?(\[\[\[.+\,\d\])\;.+/,'$1'))[0],
                team1_id = data[0][0],
                team2_id = data[0][1],
                match_time = data[0][4],
                match_time = moment.tz(match_time, "MM/DD/YYYY HH:mm:ss", "Europe/London").utc().format('YYYY-MM-DD HH:mm:ss');
                team1 = data[1][0],
                team2 = data[1][1],
                team1_statistics = team1[3][0],
                team2_statistics = team2[3][0],
                team1_players = team1[4],
                team2_players = team2[4];

                var statistics = [],len = 0,
                gk_statistics = team1_players[0][3][0].map(function(statistic){
                    if(len < statistic[1][0].length){
                        len = statistic[1][0].length;
                    };
                    return statistic[0]
                }),
                pl_statistics = team1_players[1][3][0].map(function(statistic){
                    if(len < statistic[1][0].length){
                        len = statistic[1][0].length;
                    };
                    return statistic[0]
                }),
                statistics = _.intersection(gk_statistics,pl_statistics),
                values = [],
                players = [];
                team1_players.forEach(function(player){
                    var player_id = player[0],
                    player_name = player[1],
                    player_match_position = player[5],
                    player_position = player[9],
                    player_age = player[10],
                    player_height = player[11],
                    player_weight = player[12],
                    player_substution_time = player[8],
                    player_substution_in_out = player[7],
                    player_pos = player[6];
                    player[3][0].forEach(function(statistic){
                        var name = statistic[0],value = statistic[1][0];
                        excute(mysql.format('INSERT INTO whoscored_livestatistics (match_id,player_id,name,value) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_livestatistics WHERE match_id = ? AND player_id = ? AND name = ?)', [[match_id,player_id,name,value],match_id,player_id,name]));
                    });
                    excute(mysql.format('INSERT INTO whoscored_player (id,name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_player WHERE id = ?)', [[player_id,player_name],player_id]));
                    /*player_statistics = _.object(player[3][0].map(function(item){
                        return [item[0],item[1][0]];
                    })),
                    statistics_data = _.pick(player_statistics,function(value, key, object){
                        return statistics.indexOf(key) > -1;
                    });
                    excute(mysql.format('INSERT INTO whoscored_player_match_statistics (' + _.keys(_.extend({},statistics_data,{
                        player_id:player_id,
                        match_id:match_id
                    })).join(',') + ')  SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_player_match_statistics WHERE player_id = ? AND match_id = ?)', [_.values(_.extend({},statistics_data,{
                        player_id:player_id,
                        match_id:match_id
                    })),player_id,match_id]));*/
                    //console.log([player_id,player_name,player_position].join('-----'));
                });
                team2_players.forEach(function(player){
                    var player_id = player[0],
                    player_name = player[1],
                    player_match_position = player[5],
                    player_position = player[9],
                    player_age = player[10],
                    player_height = player[11],
                    player_weight = player[12],
                    player_substution_time = player[8],
                    player_substution_in_out = player[7],
                    player_pos = player[6];
                    player[3][0].forEach(function(statistic){
                        var name = statistic[0],value = statistic[1][0];
                        excute(mysql.format('INSERT INTO whoscored_livestatistics (match_id,player_id,name,value) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_livestatistics WHERE match_id = ? AND player_id = ? AND name = ?)', [[match_id,player_id,name,value],match_id,player_id,name]));
                    });
                    excute(mysql.format('INSERT INTO whoscored_player (id,name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_player WHERE id = ?)', [[player_id,player_name],player_id]));
                });
            }
        })
    }
    //console.log($('script').eq(17).html().replace(/[\s|\n]/ig,"").replace(/^var\S+?(\[\[\[.+?\])\;\$\S+?\}\)\;$/ig,"$1"));
    /*var decoder = new StringDecoder('utf8');
    var matches = eval(decoder.write(responseBuffer).replace(/[\n|\r|\n\r]/gi,""));
    matches.forEach(function(item){
        var match_id = item[0], date = item[2],time = item[3],team1_id = item[4],team1_name = item[5],team2_id = item[7],team2_name = item[8],result = item[10],score1 = /\d{1,2}\s\:\s\d{1,2}/.test(result) ? result.split(':')[0].replace(/^\s\d{1,2}\s$/,'$1'):'',score2 = /\d{1,2}\s\:\s\d{1,2}/.test(result) ? result.split(':')[1].replace(/^\s\d{1,2}\s$/,'$1') : '';
        console.log([date,time,team1_id,team1_name,score1,score2,team2_name,team2_id].join('<<>>'));
        console.log('http://www.whoscored.com/Matches/'+match_id+'/LiveStatistics')
    })*/
}).on('complete',function(){
    console.log('complete')
}).on('fetcherror',function(queueItem, response){
    console.log('fetcherror')
}).on('fetchtimeout',function(queueItem, response){
    console.log('fetchtimeout')
}).on('fetchclienterror',function(queueItem, errorData){
    console.log('fetchclienterror')
    console.log(errorData)
});
//crawler.queueURL(host + '/tournamentsfeed/9155/Fixtures/?d=201408&isAggregate=false');
//crawler.queueURL('http://www.whoscored.com/matchesfeed/?d=20140914');
crawler.queueURL('http://www.whoscored.com/tournamentsfeed/9155/Fixtures/?d=2014W37&isAggregate=false');
crawler.queueURL(host+'/Matches/885722/LiveStatistics');
crawler.start();