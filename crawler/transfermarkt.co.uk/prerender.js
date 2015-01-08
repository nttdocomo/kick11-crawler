/**
 * @author nttdocomo
 */
/*var http = require("http"), cheerio = require('cheerio'),StringDecoder = require('string_decoder').StringDecoder,moment = require('moment'),
Crawler = require("simplecrawler"),
host = 'http://www.kick11.us';
crawler = new Crawler('localhost');
crawler.host = 'localhost';
crawler.initialPort = 8080;
crawler.maxConcurrency = 10;
crawler.interval = 300;
crawler.timeout = 10000;
crawler.discoverResources = false;
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
	var decoder = new StringDecoder('utf8');
	console.log(decoder.write(responseBuffer))
}).on('complete',function(){
	console.log('complete');
}).on('fetcherror',function(queueItem, response){
	console.log('fetcherror');
}).on('fetchtimeout',function(queueItem, response){
	console.log('fetchtimeout');
}).on('fetchclienterror',function(queueItem, errorData){
	console.log('fetchclienterror');
	console.log(errorData);
});
crawler.queueURL('/?_escaped_fragment_=team/4/');
crawler.start();*/

var http = require("http");

var options = {
    host: 'www.kick11.us',
    path: '/?_escaped_fragment_=competition/2/'
};

http.get(options, function (http_res) {
    // initialize the container for our data
    var data = "";

    // this event fires many times, each time collecting another piece of the response
    http_res.on("data", function (chunk) {
        // append this chunk to our growing `data` var
        data += chunk;
    });

    // this event fires *one* time, after all the `data` events/chunks have been gathered
    http_res.on("end", function () {
        // you can use res.send instead of console.log to output via express
        console.log(data);
    });
});