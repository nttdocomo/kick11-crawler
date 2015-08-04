var Crawler = require("simplecrawler"),
host = 'http://www.whoscored.com',
crawler = new Crawler("www.whoscored.com", "/");
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36';
crawler.customHeaders = {
    Host:'www.whoscored.com',
    Referer:'http://www.whoscored.com/LiveScores',
    'X-Requested-With':'XMLHttpRequest',
    Cookie:'__gads=ID=e173268caa0f2b07:T=1432013869:S=ALNI_MaOSzNoD7wlFKgTdXpQP7oqPIlfag; OX_plg=swf|shk|pm; _gat=1; OX_sd=3; _ga=GA1.2.744658120.1432013868'
};
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
	console.log("Completed fetching resource:", queueItem.path);
})
crawler.queueURL(host + '/matchesfeed/?d=20150802');
crawler.start();