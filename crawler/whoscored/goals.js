/**
 * @author nttdocomo
 */
var http = require("http"), fs = require('fs'), cheerio = require('cheerio'),excute = require('../transfermarkt.co.uk/excute'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),moment = require('moment'),moment_tz = require('moment-timezone'),
Crawler = require("simplecrawler"),pool  = require('../transfermarkt.co.uk/pool'),
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
    if(/^\/\w+?\/(\d{1,})\/\w+$/.test(queueItem.path)){
        console.log(queueItem.path);
        //var html = decoder.write(responseBuffer);//.replace(/\sinitialData\s\=\s(\[\[\[.+?\d{1}\])\s;.+?/,"$1");
        var $ = cheerio.load(decoder.write(responseBuffer));
        var match_id = queueItem.path.replace(/^\/\w+?\/(\d{1,})\/\w+$/,'$1');
        //console.log($('script').eq(16).html().replace(/\n/ig,'\\n').replace(/\s/ig,'\\s').replace(/\t/ig,'\\t'));
        $('script').each(function(i,script){
            var html = $(script).html().replace(/[\s|\n]/ig,"");

            if(/^var\S+?(\[\[\[.+?\])\;\S+?\)\;$/.test(html)){
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
                events = data[1][0];
                events.forEach(function(event){
                    var minute = event[0],
                    player_id = event[2][0][6],
                    event_name = event[2][0][2];
                })
                console.log(data[1][0]);
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
crawler.queueURL('http://www.whoscored.com/Matches/'+input_match_id+'/Live');
crawler.start();