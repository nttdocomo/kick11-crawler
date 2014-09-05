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