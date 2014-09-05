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
    var $ = cheerio.load(decoder.write(responseBuffer));
    var table = $('.search-result').find("h2:contains('Players:')").next();
    console.log(table.find('tr').eq(1).find('a').attr('href').replace(/\S+?\/(\d+?)\/$/,"$1"))
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
crawler.queueURL(host + '/Search/?t=Willy+Caballero');
crawler.start();