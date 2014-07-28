/**
 * @author nttdocomo
 */
var cheerio = require('cheerio'), StringDecoder = require('string_decoder').StringDecoder,
pool  = require('../pool'),
fs = require('fs'),
url = require('url'),
urls = [];
Competition = require('./model'),
Crawler = require("simplecrawler"),
host = 'http://www.transfermarkt.co.uk',
crawler = new Crawler('www.transfermarkt.co.uk');
crawler.maxConcurrency = 10;
crawler.interval = 600;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder;
	if(/^\/wettbewerbe\/[a-z]+?$/i.test(queueItem.path)){
		console.log(queueItem.path)
		decoder = new StringDecoder('utf8');
		var $ = cheerio.load(decoder.write(responseBuffer));
		$('#yw2 > li.page > a').each(function(index,el){
			var path = $(el).attr('href');
			if(path != queueItem.path){
				crawler.queueURL(host + path);
			}
		})
		$('td > table > tbody > tr').each(function(index,el){
			var path = $(el).find(' > td').eq(1).find('a').attr('href');
			console.log(path)
			crawler.queueURL(host + path);
		})
		//console.log(queueItem.path);
	    //console.log('fetchcomplete');
	}
    if(/^\/\S+?\/startseite\/wettbewerb\/\S+?$/i.test(queueItem.path) || /^\/\S+?\/startseite\/pokalwettbewerb\/\S+?$/i.test(queueItem.path)){//competition
    	decoder = new StringDecoder('utf8');
    	var competition = new Competition(cheerio.load(decoder.write(responseBuffer)));
    	console.log('get competition ' + competition.competition_name);
    	competition.save(pool);
    };
}).on("fetcherror",function(queueItem, response){
	//console.log(queueItem.path);
    //console.log('fetcherror');
}).on("fetchstart",function(queueItem,requestOptions ){
	//console.log('fetchstart');
}).on("fetchtimeout",function(queueItem, crawlerTimeoutValue){
	//console.log(queueItem.path);
	//console.log('fetchtimeout');
}).on("fetchclienterror",function(queueItem, errorData){
	//console.log(queueItem.path);
	//console.log('fetchclienterror');
}).on('complete',function(){
	console.log('complete');
	fs.open('urls.html', 'w', 0666, function(e, fd) {
		if (e) {
			console.log('错误信息：' + e);
		} else {
			fs.write(fd, urls.join('\n'), 0, 'utf8', function(e) {
				if (e) {
					console.log('出错信息：' + e);
				} else {
					fs.closeSync(fd);
				}
			});
		}
	});
})/*.addFetchCondition(function(parsedURL) {
	if(!(!(/(\.png|\.css|\.js)(\?\S+)?$/i.test(parsedURL.path)) && 
	(/^\/\S+?\/startseite\/wettbewerb\/\S+?$/i.test(parsedURL.path) || 
	/^\/\S+?\/startseite\/pokalwettbewerb\/\S+?$/i.test(parsedURL.path) || 
	/^\/wettbewerbe\/[a-z]+?\??(page\=\d{1,2})?$/i.test(parsedURL.path)))){
		if(urls.indexOf(parsedURL.path) == -1){
			urls.push(parsedURL.path)
		}
	}
	
	return !(/(\.png|\.css|\.js)(\?\S+)?$/i.test(parsedURL.path)) && 
	(/^\/\S+?\/startseite\/wettbewerb\/\S+?$/i.test(parsedURL.path) || 
	/^\/\S+?\/startseite\/pokalwettbewerb\/\S+?$/i.test(parsedURL.path) || 
	/^\/wettbewerbe\/[a-z]+?\??(page\=\d{1,2})?$/i.test(parsedURL.path));
	///super-lig/startseite/wettbewerb/Süper+Lig
	///1-bundesliga/startseite/wettbewerb/1.Bundesliga
	///k-league-classic/startseite/wettbewerb/K-League+Classic
})*/;
['/wettbewerbe/europa','/wettbewerbe/asien','/wettbewerbe/amerika','/wettbewerbe/afrika'].forEach(function(region){
	crawler.queueURL(host + region);
});
crawler.start();