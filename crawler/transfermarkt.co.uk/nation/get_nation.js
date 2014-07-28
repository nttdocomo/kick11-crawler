/**
 * @author nttdocomo
 */
var cheerio = require('cheerio'), StringDecoder = require('string_decoder').StringDecoder,
pool  = require('../pool'),
Crawler = require("simplecrawler"),
host = 'http://www.transfermarkt.co.uk',
crawler = new Crawler('www.transfermarkt.co.uk');
crawler.maxConcurrency = 10;
crawler.interval = 600;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
	console.log(queueItem.path);
    console.log('fetchcomplete');
    var decoder = new StringDecoder('utf8'),
    $ = cheerio.load(decoder.write(responseBuffer)),
    options = $('#land_select_breadcrumb').children(),
	values = [];
	options.each(function(index, element) {
		var id = $(element).val(), name = $(element).text();
		if(name && id){
			values.push([name,parseInt(id)]);
		}
	});
	pool.getConnection(function(err, connection) {
		connection.query("INSERT INTO transfermarket_nation (name,id) VALUES ?", [values], function(err) {
		    if (err) throw err;
		    connection.release();
		});
	});
}).on("fetcherror",function(queueItem, response){
    console.log('fetcherror');
}).on("fetchstart",function(queueItem,requestOptions ){
	console.log('fetchstart');
}).on("fetchtimeout",function(queueItem, crawlerTimeoutValue){
	console.log(queueItem.path);
	console.log('fetchtimeout');
}).on("fetchclienterror",function(queueItem, errorData){
	console.log(queueItem.path);
	console.log('fetchclienterror');
});
crawler.queueURL(host + '/');
crawler.start();