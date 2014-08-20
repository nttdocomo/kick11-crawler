/**
 * @author nttdocomo
 */
var http = require("http"), cheerio = require('cheerio'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),moment = require('moment'),moment_tz = require('moment-timezone'),Crawler = require("simplecrawler"),
pool  = require('../pool'),trim = require('../utils').trim,
host = 'http://www.transfermarkt.co.uk';
crawler = new Crawler('www.transfermarkt.co.uk');
crawler.maxConcurrency = 10;
crawler.interval = 300;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.customHeaders = {
	Cookie:'__qca=P0-912270038-1403184571295; 22ea10c3df12eecbacbf5e855c1fc2b3=4b2f77b042760e0b6c4403263173b81a02199e1da%3A4%3A%7Bi%3A0%3Bs%3A6%3A%22561326%22%3Bi%3A1%3Bs%3A9%3A%22nttdocomo%22%3Bi%3A2%3Bi%3A31536000%3Bi%3A3%3Ba%3A0%3A%7B%7D%7D; POPUPCHECK=1406040912765; PHPSESSID=kjuus3jlq0md5vhhq0hn2p7571; __utma=1.264986923.1403184483.1406010530.1406012399.139; __utmb=1.1.10.1406012399; __utmc=1; __utmz=1.1405646456.117.3.utmcsr=transfermarkt.com|utmccn=(referral)|utmcmd=referral|utmcct=/wettbewerbe/national/wettbewerbe/26'
}
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8');
    if(/^\/\S+\/gesamtspielplan\/wettbewerb\/\S+?$/.test(queueItem.path)){
    	var $ = cheerio.load(decoder.write(responseBuffer)),
    	tables = $('#main > .six.columns'),
    	year = $("select[name='saison_id']").find("option:selected").val(),
    	season = $("select[name='saison_id']").find("option:selected").text(),
    	competition_url = $('#submenue > li').eq(1).find('a').attr('href'),
    	competition_id = competition_url.replace(/^\/\S+?\/([A-Z\d]{2,4})(\/\S+?)?(\/saison_id\/\d{4})?$/,'$1');
		var sql = mysql.format("SELECT events.id AS id FROM `events` JOIN (SELECT competition.id AS competitions_id FROM `competition` JOIN (SELECT * FROM `transfermarket_competition` WHERE competition_id = ?)`transfermarket_competition` ON transfermarket_competition.competition_name = competition.name)`competition` ON events.competition_id = competition.competitions_id JOIN (SELECT seasons.id AS seasons_id FROM `seasons` WHERE name = ?)`seasons` ON events.season_id = seasons_id", [competition_id,year + season.replace(/\d{2}(\/\d{2})/,'$1')]);
		pool.getConnection(function(err, connection) {
			connection.query(sql, function(err,rows) {
			    if (err) throw err;
			    var event_id = rows[0].id;
			    connection.release();
				tables.each(function(index,el){
					var $el = $(el),
					matchday = $el.find('.table-header').text(),
					date,
					data_array = [],
					time,
					play_at,
					table = $el.find('> table'),
					trow = table.find('> tbody > tr');
					getRound(event_id,matchday,index+1,(function(tr){
						return function(matchday_id){
							for (var i = 0; i < tr.length; i++) {
								var row = $(tr[i]),td = row.children(),
								date = td.eq(0).find('a').text() || date,
								time = trim(td.eq(1).text()) || time,
								team_1_id = td.eq(2).find('a').attr('href').replace(/\S+?(\d{1,})\/\S+?$/,'$1'),
								team_2_id = td.eq(6).find('a').attr('href').replace(/\S+?(\d{1,})\/\S+?$/,'$1'),
								team_1_name = td.eq(3).find('img').attr('title'),
								team_2_name = td.eq(5).find('img').attr('title'),
								result = td.eq(4).find('a'),
								result = result.length ? result.text() : td.eq(4).text().replace(/\s?(\d{1,2}\:\d{1,2})\s?$/,"$1"),
								score1,
								score2,
								time = time == '-' ? '00:00':time,
								//play_at = moment([date,time].join(' ')).format('YYYY-MM-DD HH:mm:ss');
								play_at = moment.tz([date,time].join(' '), "MMM D, YYYY h:mm A", "Europe/Luxembourg").utc().format('YYYY-MM-DD HH:mm:ss');
								if(/\d{1,2}\:\d{1,2}/.test(result)){
									result = result.split(':');
									score1 = result[0],
									score2 = result[1],
									console.log([matchday_id,play_at,team_1_name,score1,score2,team_2_name].join('<<<>>>'));
								};
								getTeamIdByTeamName(team_1_name,(function(team_name,matchday_id,play_at,score_1,score_2){
									return function(team_1_id){
										getTeamIdByTeamName(team_name,function(team_2_id){
											var data = {play_at:play_at};
											if(score_1 && score_2){
												data.score1 = score_1;
												data.score2 = score_2;
											};
											pool.getConnection(function(err, connection) {
												var sql = mysql.format('UPDATE `matchs` SET ? WHERE round_id = ? AND team1_id = ? AND team2_id = ?', [data,matchday_id,team_1_id,team_2_id]);
												//console.log(sql);
												connection.query(sql, function(err,rows) {
													if (err) throw err;
													connection.release();
												});
											});
										})
									}
								})(team_2_name,matchday_id,play_at,score1,score2))
								data_array.push(date);
								//console.log([matchday_id,play_at,team_1_name,team_2_name].join('-------'));
							};
						}
					})(trow));
				});
			});
		});
    };
}).on('complete',function(){
	console.log('complete');
}).on('fetcherror',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
}).on('fetchclienterror',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
});
/*crawler.queueURL(host + '/cristiano-ronaldo/transfers/spieler/8198');
crawler.start();*/
pool.getConnection(function(err, connection) {
	connection.query("SELECT transfermarket_competition.uri FROM `competition` JOIN `nation` ON competition.nation_id = nation.id JOIN `transfermarket_nation` ON nation.full_name = transfermarket_nation.name JOIN `transfermarket_competition` ON transfermarket_competition.nation_id = transfermarket_nation.id WHERE transfermarket_competition.competition_name IN (SELECT name FROM `competition`)", function(err,rows) {
	    if (err) throw err;
	    connection.release();
	    for (var i = rows.length - 1; i >= 0; i--) {
		    var path = rows[i].uri;
		    path = path.replace('startseite','gesamtspielplan');
	    	crawler.queueURL(host + path);
	    };
	    crawler.start();
	});
});
function getTeamIdByTeamName(team_name,callback){
	pool.getConnection(function(err, connection) {
		var sql = mysql.format("SELECT id FROM team WHERE team_name = ?", [team_name]);
		connection.query(sql, function(err,rows) {
		    if (err) throw err;
		    connection.release();
		    callback(rows[0].id)
		});
	});
}
function getRound(event_id,matchday,pos,callback){
	pool.getConnection(function(err, connection) {
		connection.query('SELECT id FROM `rounds` WHERE event_id = ? AND name = ?', [event_id,matchday], function(err,rows) {
			if (err) throw err;
			connection.release();
			if(rows.length){
				callback(rows[0].id)
			}
		});
	});
}