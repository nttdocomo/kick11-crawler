/**
 * @author nttdocomo
 */
var http = require("http"),
cheerio = require('cheerio'),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
excute = require('../../../promiseExcute'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
Crawler = require("simplecrawler"),
TransfermarktRound = require('../../../model/transfermarkt.co.uk/round'),
Round = require('../../../model/kick11/round'),
Match = require('../../../model/transfermarkt.co.uk/match'),
Team = require('../../../model/transfermarkt.co.uk/team'),
TransfermarktEvent = require('../../../model/transfermarkt.co.uk/event'),
trim = require('../utils').trim,
host = 'http://www.transfermarkt.co.uk';
crawler = new Crawler('www.transfermarkt.co.uk');
crawler.maxConcurrency = 1;
crawler.interval = 5000;
crawler.timeout = 10000;
crawler.discoverResources = false;
crawler.customHeaders = {
	Cookie:'__qca=P0-912270038-1403184571295; 22ea10c3df12eecbacbf5e855c1fc2b3=4b2f77b042760e0b6c4403263173b81a02199e1da%3A4%3A%7Bi%3A0%3Bs%3A6%3A%22561326%22%3Bi%3A1%3Bs%3A9%3A%22nttdocomo%22%3Bi%3A2%3Bi%3A31536000%3Bi%3A3%3Ba%3A0%3A%7B%7D%7D; POPUPCHECK=1406040912765; PHPSESSID=kjuus3jlq0md5vhhq0hn2p7571; __utma=1.264986923.1403184483.1406010530.1406012399.139; __utmb=1.1.10.1406012399; __utmc=1; __utmz=1.1405646456.117.3.utmcsr=transfermarkt.com|utmccn=(referral)|utmcmd=referral|utmcct=/wettbewerbe/national/wettbewerbe/26'
}
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8');
    console.log("Completed fetching resource:", queueItem.path);
    if(/^\/\S+\/gesamtspielplan\/wettbewerb\/\S+?$/.test(queueItem.path)){
    	var $ = cheerio.load(decoder.write(responseBuffer)),
    	tables = $('#main > .six.columns'),
    	year = $("select[name='saison_id']").find("option:selected").val(),
    	//season = $("select[name='saison_id']").find("option:selected").text(),
    	transfermarkt_competition,
    	transfermarkt_competition_url = $('#submenue > li').eq(1).find('a').attr('href'),
    	transfermarkt_competition_id = competition_url.replace(/^\/\S+?\/([A-Z\d]{2,4})(\/\S+?)?(\/saison_id\/\d{4})?$/,'$1');
    	console.log(year + season.replace(/\d{2}(\/\d{2})/,'$1'));
    	console.log(competition_id);
    	excute(mysql.format('SELECT * FROM transfermarket_competition WHERE competition_id = ? LIMIT 1',[competition_id])).then(function(rows){
    		transfermarkt_competition_id = rows[0].id;
    		competition_id = rows[0].ref_id;
    		return excute(mysql.format('SELECT * FROM transfermarkt_season WHERE id = ? LIMIT 1',[year]))
    	}).then(function(season){
    		if(season.length){
    			return season[0].id
    		} else {
    			var season = new Season({
    				id:year
    			});
    			return season.save().then(function(result){
    				return result.insertId
    			});
    		}
    	}).then(function(season_id){
    		return excute(mysql.format('SELECT * FROM transfermarkt_event WHERE season_id = ? AND competition_id = ? LIMIT 1',[year,transfermarkt_competition_id]))
    	}).then(function(transfermarkt_event){
    		if(transfermarkt_event.length){
    			return transfermarkt_event[0].id
    		} else {
    			var transfermarkt_event = new TransfermarktEvent({
    				season_id:season_id,
    				competition_id:transfermarkt_competition_id
    			});
    			return transfermarkt_event.save().then(function(result){
    				return result.insertId
    			});
    		}
    	}).then(function(transfermarkt_event_id){
		    var event_id = transfermarkt_event_id;
			return tables.reduce(function(sequence,el,index){
				var $el = $(el),
				matchday = $el.find('.table-header').text(),
				date,
				data_array = [],
				time,
				play_at,
				pos = index+1,
				table = $el.find('> table'),
				tr = table.find('> tbody > tr');
				return sequence.then(function(){
					return TransfermarktRound.get_round_id(event_id,pos);
				}).then(function(round_id){
					return tr.reduce(function(sequence,row){
						var td = row.children(),
						date = td.eq(0).find('a').text() || date,
						time = trim(td.eq(1).text()) || time,
						transfermarkt_team1_id = td.eq(2).find('a').attr('href').replace(/\S+?(\d{1,})\/\S+?$/,'$1'),
						transfermarkt_team2_id = td.eq(6).find('a').attr('href').replace(/\S+?(\d{1,})\/\S+?$/,'$1'),
						team1_name = td.eq(3).find('img').attr('title'),
						team2_name = td.eq(5).find('img').attr('title'),
						team2_id,
						team1_id,
						result = td.eq(4).find('a'),
						result = result.length ? result.text() : td.eq(4).text().replace(/\s?(\d{1,2}\:\d{1,2})\s?$/,"$1"),
						score1,
						score2,
						time = time == '-' ? '00:00':time,
						//play_at = moment([date,time].join(' ')).format('YYYY-MM-DD HH:mm:ss');
						play_at = moment.tz([date,time].join(' '), "MMM D, YYYY h:mm A", "Europe/Luxembourg").utc().format('YYYY-MM-DD HH:mm');
						if(/\d{1,2}\:\d{1,2}/.test(result)){
							result = result.split(':');
							score1 = result[0];
							score2 = result[1];
							console.log([matchday_id,play_at,team_1_name,score1,score2,team_2_name].join('<<<>>>'));
						};
						var match = new Match({
							round_id:round_id,
							team1_id:transfermarkt_team1_id,
							team2_id:transfermarkt_team2_id,
							score1 : score1,
							score2 : score1,
							play_at:play_at
						});
						return sequence.then(function(){
							return match.save()
						}).then(function(){
							return Team.get_team_by_id(team1_id)
						}).then(function(team){
							if(team.length){
								team1_id = team[0].ref_id
								return Team.get_team_by_id(team2_id)
							}
							throw {
								'msg':'there is no team1'
							};
						}).then(function(team){
							if(team.length){
								team2_id = team[0].ref_id;
								return excute(mysql.format('SELECT * FROM ?? WHERE competition_id = ? AND season_id = ? LIMIT 1',['events',competition_id,year]))
							}
							throw {
								'msg':'there is no team2'
							};
						}).then(function(result){
							if(result.length){
								return Round.get_round_id(result[0].id,pos)
							}
							throw {
								'msg':'there is no event!'
							};
						}).then(function(round_id){
							return excute(mysql.format('SELECT * FROM ?? WHERE team1_id = ? AND team2_id = ? AND play_at = ?',['matchs',team1_id,team2_id,play_at])).then(function(result){
								if(result.length){
									match = new Match(result[0]);
									match.set('round_id',round_id);
									return match.save();
								}
								throw {
									'msg':'there is no event!'
								};
							})
						}).catch(function(err) {
							console.log(err)
						})
					},Promise.resolve())
				});
			},Promise.resolve());
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
function getTeamIdByTeamName(team_name,callback){
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
}