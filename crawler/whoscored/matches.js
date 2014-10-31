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
    Cookie:'__gads=ID=7400c9eb48861252:T=1407717687:S=ALNI_MZbNZufnguyMAdt6A2DXy8Hirg7oA; ebNewBandWidth_.www.whoscored.com=863%3A1408183698417; ui=nttdocomo:bjmU8NSBC0WzoKOkAO-9TQ:3619521175:SHKLWvTkwNCw4YKgZQA0cg8IkHCbOnpSkXIJdsjHZI8; ua=nttdocomo:bjmU8NSBC0WzoKOkAO-9TQ:3619521175:Cmahf0NIXa_v-sD8BkI3Tg9HVIkTt2NruY5jcRetDrM; mp_430958bdb5bff688df435b09202804d9_mixpanel=%7B%22distinct_id%22%3A%20%22147c283461b55-0841a221e-4e46072c-1fa400-147c283461d11f%22%2C%22%24initial_referrer%22%3A%20%22http%3A%2F%2Fwww.whoscored.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.whoscored.com%22%7D; _ga=GA1.2.458243098.1407717765'
}
var times = 1;
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    if(/^\/\w+?\/(\d{1,})\/\w+$/.test(queueItem.path)){
        get_goals(queueItem, responseBuffer, response)
    }
}).on('complete',function(){
    console.log('complete')
}).on('fetcherror',function(queueItem, response){
    console.log('fetcherror')
}).on('fetchtimeout',function(queueItem, response){
    crawler.queueURL(host + queueItem.path);
    console.log('fetchtimeout')
}).on('fetchclienterror',function(queueItem, errorData){
    crawler.queueURL(host + queueItem.path);
    console.log('fetchclienterror')
});
var input_urls = input_url.split(',');
console.log(input_urls);
input_urls.forEach(function(url){
    crawler.queueURL(host + url);
})
crawler.start();