/**
 * @author nttdocomo
 */
var cheerio = require('cheerio'),
excute = require('../../../promiseExcute'),
StringDecoder = require('string_decoder').StringDecoder,
insert_match_by_competition = require('../../../fn/transfermarkt/match/insert_match_by_competition'),
host = 'http://www.transfermarkt.co.uk',
Crawler = require("simplecrawler"),
crawler = new Crawler('www.transfermarkt.co.uk','/');
crawler.maxConcurrency = 1;
crawler.interval = 1000;
crawler.timeout = 15000;
crawler.discoverResources = false;
crawler.useProxy = true;
crawler.proxyHostname = '127.0.0.1';
crawler.proxyPort = '11080';
crawler.customHeaders = {
	Cookie:'__qca=P0-1002771777-1433630808833; TMSESSID=f2dtgcf5vs36pe2oj7k662fih1; _ga=GA1.3.555742736.1433630798; __utma=1.555742736.1433630798.1441150607.1441198450.68; __utmc=1; __utmz=1.1433630798.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); wt3_eid=%3B670018217401655%7C2143426000500415873%232144119845000335440; wt3_sid=%3B670018217401655'
}
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8'),
    content = decoder.write(responseBuffer),
    next = this.wait();
    console.log("Completed fetching resource:", queueItem.path);
    if(/^\/\S+\/gesamtspielplan\/wettbewerb\/\S+?$/.test(queueItem.path)){
    	insert_match_by_competition(content).then(function(){
    		next()
    	})
    };
}).on('complete',function(){
	console.log('complete');
}).on('fetcherror',function(queueItem, response){
	console.log('fetcherror');
	console.log(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
	console.log('fetchtimeout');
	console.log(host + queueItem.path);
}).on('fetchclienterror',function(queueItem, response){
	console.log('fetchclienterror');
	console.log(host + queueItem.path);
});
/*crawler.queueURL(host + '/cristiano-ronaldo/transfers/spieler/8198');
crawler.start();*/
excute("SELECT uri FROM `transfermarket_competition` WHERE competition_ref_id != 0").then(function(rows) {
	if(rows.length){
		rows.forEach(function(row){
			var path = row.uri;
		    path = path.replace('startseite','gesamtspielplan');
			console.log(host + path);
	    	crawler.queueURL(host + path);
		})
    	crawler.start();
	}
});
/*crawler.queueURL('http://www.transfermarkt.co.uk/premier-league/gesamtspielplan/wettbewerb/GB1/saison_id/2015');
crawler.start();*/
/*function getTeamIdByTeamName(team_name,callback){
	pool.getConnection(function(err, connection) {
		var sql = mysql.format("SELECT id FROM team WHERE team_name = ?", [team_name]);
		connection.query(sql, function(err,rows) {
		    if (err) throw err;
		    callback(rows[0].id)
		    connection.release();
		});
	});
}
function updateRound(data_array){
	pool.getConnection(function(err, connection) {
		connection.query('UPDATE `rounds` SET ?', {
			start_at:moment(data_array[0]).format('YYYY-MM-DD'),
			end_at:moment(data_array[data_array.length - 1]).format('YYYY-MM-DD')
		}, function(err,rows) {
			if (err) throw err;
			connection.release();
		});
	});
}
function getRound(event_id,matchday,pos,callback){
	pool.getConnection(function(err, connection) {
		connection.query('SELECT id FROM `rounds` WHERE event_id = ? AND name = ?', [event_id,matchday], function(err,rows) {
			if(rows.length){
				callback(rows[0].id)
			} else {
				insertRound(event_id,matchday,pos,callback);
			}
			connection.release();
		});
	});
}
function insertRound(event_id,matchday,pos,callback){
	pool.getConnection(function(err, connection) {
		var sql = mysql.format('INSERT INTO `rounds` (event_id,name,pos) VALUES (?)', [[event_id, matchday, pos]]);
		connection.query(sql, function(err,rows) {
			if (err) throw err;
			getRound(event_id,matchday,pos,callback);
			connection.release();
		});
	});
}*/