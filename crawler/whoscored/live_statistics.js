/**
 * @author nttdocomo
 */
var http = require("http"), cheerio = require('cheerio'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),moment = require('moment'),
Crawler = require("simplecrawler");
host = 'http://www.whoscored.com';
crawler = new Crawler('www.whoscored.com');
crawler.maxConcurrency = 10;
crawler.interval = 300;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8');
    //var html = decoder.write(responseBuffer);//.replace(/\sinitialData\s\=\s(\[\[\[.+?\d{1}\])\s;.+?/,"$1");
    var $ = cheerio.load(decoder.write(responseBuffer));
    //console.log($('script').eq(16).html().replace(/\n/ig,'\\n').replace(/\s/ig,'\\s').replace(/\t/ig,'\\t'));
    $('script').each(function(i,script){
        var html = $(script).html().replace(/[\s|\n]/ig,"");
        if(/^var\S+?(\[\[\[.+?\])\;\$\S+?\}\)\;$/.test(html)){
            console.log(i);
            var data = eval(html.replace(/^var\S+?(\[\[\[.+?\])\;\$\S+?\}\)\;$/,"$1")),
            team1_id = data[0][0][0][0],
            team2_id = data[0][0][0][1],
            team1_statistics = data[0][1][0],
            team2_statistics = data[0][1][1],
            team1_players = team1_statistics[4],
            team2_players = team2_statistics[4];
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
                player_pos = player[6],
                player_statistics = player[3][0]
                console.log([player_id,player_name,player_position].join('-----'));
            })
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
                player_pos = player[6],
                player_statistics = player[3][0]
                console.log([player_id,player_name,player_position].join('-----'));
            })
        }
    })
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
crawler.queueURL(host + '/Matches/829517/LiveStatistics');
crawler.start();