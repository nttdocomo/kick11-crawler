var http = require("http"),
url = require('url'),
cheerio = require('cheerio'),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
Crawler = require("simplecrawler"),
pool  = require('../../../pool'),
trim = require('../utils').trim,
excute = require('../../../excute'),
asyncLoop = require('../../../asyncLoop'),
_ = require('underscore'),
host = 'http://www.transfermarkt.co.uk',
seasons = [],
competitions = [],
events = [],
crawler = new Crawler('www.transfermarkt.co.uk');
crawler.maxConcurrency = 2;
crawler.interval = 300;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.customHeaders = {
	Cookie:'__qca=P0-912270038-1403184571295; 22ea10c3df12eecbacbf5e855c1fc2b3=4b2f77b042760e0b6c4403263173b81a02199e1da%3A4%3A%7Bi%3A0%3Bs%3A6%3A%22561326%22%3Bi%3A1%3Bs%3A9%3A%22nttdocomo%22%3Bi%3A2%3Bi%3A31536000%3Bi%3A3%3Ba%3A0%3A%7B%7D%7D; POPUPCHECK=1406040912765; PHPSESSID=kjuus3jlq0md5vhhq0hn2p7571; __utma=1.264986923.1403184483.1406010530.1406012399.139; __utmb=1.1.10.1406012399; __utmc=1; __utmz=1.1405646456.117.3.utmcsr=transfermarkt.com|utmccn=(referral)|utmcmd=referral|utmcct=/wettbewerbe/national/wettbewerbe/26'
}
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8'),tables;
    if(/^\/\S+\/gesamtspielplan\/wettbewerb\/\S+?$/.test(queueItem.path)){
    	var query = url.parse(queueItem.url,true).query;
    	$ = cheerio.load(decoder.write(responseBuffer));
    	if(_.isEmpty(query)){
    		//console.log($('[name="saison_id"]')['0'])
    		_.each($('[name="saison_id"]').find('option'),function(option){
    			crawler.queueURL(host + queueItem.path + '?saison_id=' + $(option).attr('value'));
    		})
    	} else {
            tables = $('#main > .row > .six.columns');
            if(tables.length){
                var season_id = query.saison_id,
                competition_id = queueItem.path.match(/.*?([A-Z0-9]{1,5}).*?/)[1];
                console.log(queueItem.path.match(/.*?([A-Z0-9]{1,5}).*?/)[1])
                if(seasons.indexOf(season_id) < 0){
                    excute('INSERT INTO `transfermarket_season` SET id = ' + season_id);
                }
                var competition = _.find(competitions,function(item){
                    return item.competition_id == competition_id;
                }),
                transfermarket_event = _.find(events,function(item){
                    return item.season_id == season_id && item.competition_id == competition.id;
                });
                if(transfermarket_event){
                    matches(transfermarket_event.id,tables)
                } else {
                    excute(mysql.format('INSERT INTO `transfermarket_event` SET ?',{
                        season_id:season_id,
                        competition_id:competition.id
                    }),function(result){
                        var event_id = result.insertId;
                        matches(event_id,tables)
                    });
                }
            }
        }
    };
}).on('complete',function(){
	console.log('complete');
}).on('fetcherror',function(queueItem, response){
	console.log('fetcherror:'+ queueItem.path);
	crawler.queueURL(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
	console.log('fetchtimeout:'+ queueItem.path);
	crawler.queueURL(host + queueItem.path);
}).on('fetchclienterror',function(queueItem, response){
	console.log('fetchclienterror:'+ queueItem.path);
	crawler.queueURL(host + queueItem.path);
});
var currentYear = moment().get('year');
console.log(currentYear)
excute("SELECT transfermarket_competition.uri FROM `competition` JOIN `nation` ON competition.nation_id = nation.id JOIN `transfermarket_nation` ON nation.full_name = transfermarket_nation.name JOIN `transfermarket_competition` ON transfermarket_competition.nation_id = transfermarket_nation.id WHERE transfermarket_competition.competition_name IN (SELECT name FROM `competition`)", function(rows) {
    for (var i = rows.length - 1; i >= 0; i--) {
	    var path = rows[i].uri;
	    path = path.replace('startseite','gesamtspielplan');
    	crawler.queueURL(host + path);
    };
    crawler.start();
});
var init_func = [function(cb){
    excute('SELECT id FROM `transfermarket_season`',function(rows){//先从数据库里将所有stages取出来
        if(rows.length){
            seasons = rows.map(function(season){
                return season.id;
            })
        }
        cb()
    });
},function(cb){
    excute('SELECT id,competition_id FROM `transfermarket_competition`',function(rows){//先从数据库里将所有stages取出来
        if(rows.length){
            seasons = rows
        }
        cb()
    });
},function(cb){
    excute('SELECT * FROM `transfermarket_event`',function(rows){//先从数据库里将所有stages取出来
        if(rows.length){
            events = rows
        }
        cb()
    });
}]
function matches(event_id,tables){
    asyncLoop(tables.length, function(loop){
        var table = $(tables[loop.iteration()]).find('table'),
        trs = table.find('> tbody > tr');
        console.log(trs.length)
        asyncLoop(trs.length,function(loop){
            var i = loop.iteration(),
            tr = trs[i],
            td = $(tr).children(),
            round = i+1,
            match_date = td.eq(0).find('a').text(),
            match_time = trim(td.eq(1).text()),
            team_1_id = td.eq(2).find('a').attr('href').replace(/\S+?\/(\d{1,})\/\S+?$/,'$1'),
            team_2_id = td.eq(6).find('a').attr('href').replace(/\S+?\/(\d{1,})\/\S+?$/,'$1'),
            team_1_name = td.eq(3).find('img').attr('title'),
            team_2_name = td.eq(5).find('img').attr('title'),
            result = td.eq(4).find('a'),
            match_id = result.attr('href').match(/.*?(\d{1,9})$/)[1],
            result = result.length ? result.text() : td.eq(4).text().replace(/\s?(\d{1,2}\:\d{1,2})\s?$/,"$1"),
            play_at = moment.tz([match_date,match_time].join(' '), "MMM D, YYYY h:mm A", "Europe/Luxembourg").utc().format('YYYY-MM-DD HH:mm:ss');
            console.log([event_id,round,play_at,match_id,team_1_id,team_2_id,result].join('==='));
        },function(){
            console.log('match complete')
        })
        loop.next();
    },function(){
        console.log('table complete')
    })
}