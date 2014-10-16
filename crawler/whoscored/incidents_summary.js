/**
 * @author nttdocomo
 */
var http = require("http"), fs = require('fs'), cheerio = require('cheerio'),excute = require('../transfermarkt.co.uk/excute'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),moment = require('moment'),moment_tz = require('moment-timezone'),
Crawler = require("simplecrawler"),pool  = require('../transfermarkt.co.uk/pool'),moment = require('moment'),get_goals = require('./get_goals'),
input_match_id = process.argv[2],
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
    var decoder = new StringDecoder('utf8');
    //console.log(decoder.write(responseBuffer));
    if(/^\/tournamentsfeed\/\d{1,4}\/Fixtures\/\?d\=\d{6}\&isAggregate\=false$/.test(queueItem.path)){
        var matches = eval(decoder.write(responseBuffer));
        matches.forEach(function(match){
            //console.log(match[0]);
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
                score1 = match[10].split(/\s\:\s/)[0],
                score2 = match[10].split(/\s\:\s/)[1],
                score1i = match[11].split(/\s\:\s/)[0],
                score2i = match[11].split(/\s\:\s/)[1];
            }
            excute(mysql.format('INSERT INTO whoscored_teams (id,name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_teams WHERE id = ?)', [[team1_id,team1_name],team1_id]));
            excute(mysql.format('INSERT INTO whoscored_teams (id,name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_teams WHERE id = ?)', [[team2_id,team2_name],team2_id]));
            //console.log(mysql.format('INSERT INTO whoscored_matches (id,team1_id,team2_id,play_at' + (score1 && score2 ? ',score1,score2,score1i,score2i':'') + ') SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_matches WHERE id = ?)', [(score1 && score2 ? [match_id,team1_id,team2_id,play_at,score1,score2,score1i,score2i]:[match_id,team1_id,team2_id,play_at]),match_id]))
            excute(mysql.format('INSERT INTO whoscored_matches (id,team1_id,team2_id,play_at' + (score1 && score2 ? ',score1,score2,score1i,score2i':'') + ') SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_matches WHERE id = ?)', [(score1 && score2 ? [match_id,team1_id,team2_id,play_at,score1,score2,score1i,score2i]:[match_id,team1_id,team2_id,play_at]),match_id]));
            excute(mysql.format('SELECT 1 FROM whoscored_goals WHERE match_id = ? LIMIT 1',[match_id]),function(rows){
                if(!rows.lenght){
                    crawler.queueURL(host + '/matchesfeed/'+match_id+'/IncidentsSummary/');
                }
            });
        })
    }
    if(/^\/matchesfeed\/(\d{1,})\/IncidentsSummary\/$/.test(queueItem.path)){//0:
        get_goals(queueItem, responseBuffer, response)
    }
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
//crawler.queueURL(host + '/tournamentsfeed/9155/Fixtures/?d=2014W39&isAggregate=false');
//crawler.queueURL('http://www.whoscored.com/matchesfeed/?d=20140914');
crawler.queueURL('http://www.whoscored.com/Matches/'+input_match_id+'/Live');
crawler.start();