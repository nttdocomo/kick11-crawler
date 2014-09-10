/**
 * @author nttdocomo
 */
var http = require("http"), fs = require('fs'),cheerio = require('cheerio'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),Crawler = require("simplecrawler"),
excute  = require('../transfermarkt.co.uk/excute'),
host = 'http://sortitoutsi.net',
crawler = new Crawler('sortitoutsi.net');
crawler.maxConcurrency = 5;
crawler.interval = 500;
crawler.timeout = 10000;
crawler.discoverResources = false;
crawler.customHeaders = {
	Cookie:'__cfduid=dded65593eb5b8ea6c68dd2d4d2d674881400652679204; auth_key=eyJpdiI6ImtseXJkdFNjT1FxWVJYSVdRUU93OFwvYXpiSFwvbE5MeWczaVFZM2JjdjJcL3c9IiwidmFsdWUiOiJIanhVeDJPWnpTd3I3UkdMNnhmRndYdk9tRHhqc0VKT2krYlJTZDBDXC9NZUo1VjhRVkwwTnRqOUtnUnJWc1l3SXFPWVg2R1dxU2NSbmxidlVcL3NJTTVRPT0iLCJtYWMiOiIzMDI2NWMxN2U4YmI0N2M0MWNiYzUwNjdmM2UwZjhmNGY5MDBkZjgzYjVlY2VkNTlkZmZhZWFiNjcxNjJjZjE2In0%3D; laravel_session=4ljgaqnet82ene2dr72u0lqdn0; __utma=260683535.2021510136.1400652684.1410320873.1410339865.135; __utmb=260683535.2.10.1410339865; __utmc=260683535; __utmz=260683535.1400652684.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)'
}
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.103 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
	var decoder;
	if(/\/search\/cutout\/\d{1,10}$/.test(queueItem.path)){
		decoder = new StringDecoder('utf8');
	    var $ = cheerio.load(decoder.write(responseBuffer));
		//console.log(decoder.write(responseBuffer));
	    var src = $('#content > .content > .thumbnails > li').eq(0).find('img').attr('src');
	    if(src){
	    	crawler.queueURL(src);
	    } else {
	    	console.log(queueItem.path);
	    }
	    //crawler.start();
	}
	if(/\/cutoutfaces\/\d{1,10}\/\d{1,10}\/\d{1,10}\.png$/.test(queueItem.path)){//http://sortitoutsi.net/cutoutfaces/214/213430/6000579.png
		decoder = new StringDecoder("binary");
		excute(mysql.format("SELECT player_id FROM fm_player WHERE fm_player_id = ?",[queueItem.path.replace(/\/cutoutfaces\/\d{1,10}\/\d{1,10}\/(\d{1,10})\.png$/,'$1')]),function(rows) {
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
excute("SELECT fm_player_id FROM fm_player",function(rows) {
    rows.forEach(function(player){
    	crawler.queueURL(host + '/search/cutout/' + player.fm_player_id);
    })
    crawler.start();
})
/*console.log(host + '/player/'+'Gerhard Tremmel'.replace(/\s/,'-') + '.html')
crawler.queueURL(host + '/player/'+'Gerhard Tremmel'.replace(/\s/,'-') + '.html');
crawler.start();*/