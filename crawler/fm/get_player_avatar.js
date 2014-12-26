/**
 * @author nttdocomo
 */
var http = require("http"), fs = require('fs'),cheerio = require('cheerio'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),Crawler = require("simplecrawler"),
excute  = require('../../excute'),
host = 'http://sortitoutsi.net',
crawler = new Crawler('sortitoutsi.net');
crawler.maxConcurrency = 5;
crawler.interval = 500;
crawler.timeout = 10000;
crawler.discoverResources = false;
crawler.customHeaders = {
	Cookie:'__cfduid=db16bb148b457985f1971768970b835db1418869588; auth_key=eyJpdiI6IlNpeTZNb2NsN0RVRVpnNHpoMERCMUE9PSIsInZhbHVlIjoiN1hiNmVGbjBEY0JZK2pRN3lvWmdKTCtoQ2UzbGdjTjNBYUFPcUJKTUtIMmhYT1VVUHV1eHZsSmRuSlwvakYrOGwiLCJtYWMiOiI4ZGVkODE4MWVmM2I3MTA2ZGJlNWRhMzdlYWZkMzVjZTgwYjQ3MDBlOTAxODFmMzk0Y2JlMWYxZGUzZDNjNTJkIn0%3D; laravel_session=eyJpdiI6ImhtTjFYbDc0bDJiZ2w0U1ZsTWJ0d1E9PSIsInZhbHVlIjoiRXRqb1wvUkp6UkFXaG5PNHFOSEVTdmhUUDhxbWYxMjVMekFFeGRUSCtMeWxjTnFFQTgzK0xxaHQ5VFFCelBoWHQ5WHg5bkdOK0Y5T3ZrNUVcLzA2K2tkQT09IiwibWFjIjoiZjg1NGQyZGY2NzdlZTZmYjFjZmYyMTk0NWYyM2ZkODkyNjQ2YjRkMDE1Zjg0YThmMDk2OTZlYmU1OTljNTViZSJ9; __utmt=1; __utma=260683535.1964641505.1418873438.1418966044.1419583615.4; __utmb=260683535.1.10.1419583615; __utmc=260683535; __utmz=260683535.1418873438.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)'
}
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
	var decoder;
	if(/\/search\/cutout\/\d{1,10}$/.test(queueItem.path)){
		decoder = new StringDecoder('utf8');
	    var $ = cheerio.load(decoder.write(responseBuffer));
		//console.log(decoder.write(responseBuffer));
	    var src = $('#content > .content > .thumbnails > li').eq(0).find('img').attr('src');
	    if(src){
	    	fs.exists('../../../webpy-kickeleven/static/resources/players/' + src.match(/(\d{1,10}\.png$)/)[0], function (exists) {
	    		if(!exists){
	    			crawler.queueURL(src);
	    		}
	    	});
	    } else {
	    	console.log(queueItem.path);
	    }
	    //crawler.start();
	}
	if(/\/cutoutfaces\/\d{1,10}\/\d{1,10}\/\d{1,10}\.png$/.test(queueItem.path)){//http://sortitoutsi.net/cutoutfaces/214/213430/6000579.png
		decoder = new StringDecoder("binary");
		excute(mysql.format("SELECT player_id FROM fm_player_player WHERE fm_player_id = ?",[queueItem.path.replace(/\/cutoutfaces\/\d{1,10}\/\d{1,10}\/(\d{1,10})\.png$/,'$1')]),function(rows) {
			if(rows.length){
				fs.writeFile('../../../webpy-kickeleven/static/resources/players/' + rows[0].player_id + '.png', decoder.write(responseBuffer), 'binary', function(error){
		            if(error){
		                console.log(error);
		            }
		        });
			}
		})
	}
}).on('complete',function(){
	console.log('complete');
}).on('fetcherror',function(queueItem, response){
	console.log('fetcherror')
	//crawler.queueURL(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
	console.log('fetchtimeout');
	//crawler.queueURL(host + queueItem.path);
}).on('fetchclienterror',function(queueItem, errorData){
	console.log('fetchclienterror')
	//crawler.queueURL(host + queueItem.path);
});
excute("SELECT fm_player_id FROM fm_player_player",function(rows) {
    rows.forEach(function(player){
    	crawler.queueURL(host + '/search/cutout/' + player.fm_player_id);
    })
    crawler.start();
})
/*console.log(host + '/player/'+'Gerhard Tremmel'.replace(/\s/,'-') + '.html')
crawler.queueURL(host + '/player/'+'Gerhard Tremmel'.replace(/\s/,'-') + '.html');
crawler.start();*/