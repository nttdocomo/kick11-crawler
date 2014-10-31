/**
 * @author nttdocomo
 */
var http = require("http"), fs = require('fs'), cheerio = require('cheerio'),excute = require('../transfermarkt.co.uk/excute'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),moment = require('moment'),moment_tz = require('moment-timezone'),
Crawler = require("simplecrawler"),pool  = require('../transfermarkt.co.uk/pool'),moment = require('moment'),moment_tz = require('moment-timezone'),get_goals = require('./get_goals'),
input_url = process.argv[2],
host = 'http://www.whoscored.com';
_ = require('underscore');
crawler = new Crawler('www.whoscored.com');
crawler.maxConcurrency = 2;
crawler.interval = 500;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.customHeaders = {
    Host:'www.whoscored.com',
    Referer:'http://www.whoscored.com/LiveScores',
    'X-Requested-With':'XMLHttpRequest',
    Cookie:'__gads=ID=7400c9eb48861252:T=1407717687:S=ALNI_MZbNZufnguyMAdt6A2DXy8Hirg7oA; ebNewBandWidth_.www.whoscored.com=863%3A1408183698417; ui=nttdocomo:bjmU8NSBC0WzoKOkAO-9TQ:3619521175:SHKLWvTkwNCw4YKgZQA0cg8IkHCbOnpSkXIJdsjHZI8; ua=nttdocomo:bjmU8NSBC0WzoKOkAO-9TQ:3619521175:Cmahf0NIXa_v-sD8BkI3Tg9HVIkTt2NruY5jcRetDrM; mp_430958bdb5bff688df435b09202804d9_mixpanel=%7B%22distinct_id%22%3A%20%22147c283461b55-0841a221e-4e46072c-1fa400-147c283461d11f%22%2C%22%24initial_referrer%22%3A%20%22http%3A%2F%2Fwww.whoscored.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.whoscored.com%22%7D; _ga=GA1.2.458243098.1407717765'
}
var times = 1;
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8');
    //console.log(decoder.write(responseBuffer));
    if(/^\/tournamentsfeed\/\d{1,5}\/Fixtures\/\?d\=\d{6}\&isAggregate\=false$/.test(queueItem.path)){
        var matches = eval(decoder.write(responseBuffer));
        matches.forEach(function(match){
            var match_id = match[0],
            team1_id = match[4],
            team1_name = match[5],
            team2_id = match[7],
            team2_name = match[8],
            play_at = moment.tz([match[2],match[3]].join(' '), "dddd, MMM DD YYYY HH:mm", "Europe/London").utc().format('YYYY-MM-DD HH:mm:ss'),
            score = match[10],
            score1,
            score2,
            score1i,
            score2i;
            if(score != 'vs'){
                score1 = score.split(/\s\:\s/)[0],
                score2 = score.split(/\s\:\s/)[1],
                score1i = match[11].split(/\s\:\s/)[0],
                score2i = match[11].split(/\s\:\s/)[1];
            }
            excute(mysql.format('INSERT INTO whoscored_teams (id,name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_teams WHERE id = ?)', [[team1_id,team1_name],team1_id]));
            excute(mysql.format('INSERT INTO whoscored_teams (id,name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_teams WHERE id = ?)', [[team2_id,team2_name],team2_id]));
            excute(mysql.format('SELECT 1 FROM whoscored_matches WHERE id = ? LIMIT 1',[match_id]),function(rows){
                var values = {
                    'team1_id':team1_id,
                    'team2_id':team2_id,
                    'play_at':play_at
                };
                if(score != 'vs'){
                    values.score1 = score.split(/\s\:\s/)[0],
                    values.score2 = score.split(/\s\:\s/)[1],
                    values.score1i = match[11].split(/\s\:\s/)[0],
                    values.score2i = match[11].split(/\s\:\s/)[1];
                    excute(mysql.format('SELECT 1 FROM whoscored_events WHERE match_id = ? LIMIT 1',[match_id]),function(rows){
                        if(!rows.length){
                            crawler.queueURL(host + '/MatchesFeed/'+match_id+'/MatchCentre2');
                        }
                    });
                }
                if(!rows.length){
                    values.id = match_id;
                    excute(mysql.format('INSERT INTO whoscored_matches  SET ?', values));
                } else {
                    excute(mysql.format('UPDATE whoscored_matches  SET ? WHERE id = ?', [values,match_id]));
                }
            });
        })
    }
    if(/^\/MatchesFeed\/(\d{1,})\/MatchCentre2$/.test(queueItem.path)){
        get_goals(queueItem, responseBuffer, response, queueItem.path.replace(/^\/MatchesFeed\/(\d{1,})\/MatchCentre2$/,"$1"))
    }
}).on('fetchstart',function(queueItem , requestOptions){
    if(/^\/MatchesFeed\/(\d{1,})\/MatchCentre2$/.test(queueItem.path)){
        requestOptions.headers.Referer = 'http://www.whoscored.com/Matches/'+queueItem.path.replace(/^\/MatchesFeed\/(\d{1,})\/MatchCentre2$/,"$1")+'/Live';
    } else {
        requestOptions.headers.Referer = 'http://www.whoscored.com/LiveScores';
    }
}).on('complete',function(){
    console.log('complete')
}).on('fetcherror',function(queueItem, response){
    console.log('fetcherror')
}).on('fetchtimeout',function(queueItem, response){
    crawler.queueURL(host + queueItem.path);
    console.log('fetchtimeout:' + queueItem.path)
}).on('fetchclienterror',function(queueItem, errorData){
    crawler.queueURL(host + queueItem.path);
    console.log('fetchclienterror')
});
var input_urls = input_url.split(',');//http://www.whoscored.com/tournamentsfeed/9155/Fixtures/?d=201409&isAggregate=false
input_urls.forEach(function(url){
    crawler.queueURL(host + url);
})
crawler.start();