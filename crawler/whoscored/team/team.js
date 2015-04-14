var _ = require('underscore'),excute = require('../../excute'),
host = 'http://www.whoscored.com',
Crawler = require("simplecrawler");
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
    }
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
module.exports.crawl_team = function(team_id){

}