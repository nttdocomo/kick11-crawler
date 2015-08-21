var excute = require('../../promiseExcute'),
mysql = require('mysql'),
cheerio = require('cheerio'),
StringDecoder = require('string_decoder').StringDecoder,
Crawler = require("simplecrawler"),
_ = require('underscore'),
host = 'http://www.whoscored.com',
crawler = new Crawler('www.whoscored.com');
crawler.maxConcurrency = 1;
crawler.interval = 600;
crawler.timeout = 10000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8'),
    next;
    if(/^\/Regions\/\d{1,}\/Tournaments\/\d{1,}/i.test(queueItem.path)){//competition
    	next = this.wait();
    	var content = decoder.write(responseBuffer);
    	var $ = cheerio.load(content);
    	var stage_condotion = $('#seasons').val().match(/\/Regions\/252\/Tournaments\/(\d{1,})\/Seasons\/(\d{1,})/);
    	//next = this.wait();
    	var calendar = JSON.parse(content.match(/(\{\d{4}\:.*\}\}\})/)[0].replace(/\:/g,'":').replace(/\{/g,'{"').replace(/\,/g,',"'));
    	excute(mysql.format('SELECT id FROM `whoscored_stages` WHERE tournament_id = ? AND season_id = ? LIMIT 1',[stage_condotion[1],stage_condotion[2]])).then(function(stages){
    		return excute(mysql.format('SELECT 1 FROM `whoscored_stage_event` WHERE stage_id = ?',[stages[0].id]));
    	}).then(function(stages){
    		if(stages.length){
		    	_.each(calendar,function(months,year){
		    		_.each(months,function(days,month){
		    			month = (parseInt(month)+1)+'';
		    			if(/^\d{1}$/.test(month)){
		    				month = '0'+month;
		    			}
		    			console.log('/tournamentsfeed/'+stages[0].id+'/Fixtures/?d='+[year,month].join('')+'&isAggregate=false')
		    		})
		    	});
    		}
	    	next();
    	})
    };
}).on('complete',function(){
	console.log('complete');
}).on('fetcherror',function(queueItem, response){
	console.log('fetcherror ' + queueItem.path)
	crawler.queueURL(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
	console.log('fetchtimeout ' + queueItem.path)
	crawler.queueURL(host + queueItem.path);
}).on('fetchclienterror',function(queueItem, response){
	console.log('fetchclienterror ' + queueItem.path)
	crawler.queueURL(host + queueItem.path);
});
/*excute(mysql.format('SELECT * FROM `whoscored_stage_event` WHERE stage_id = ?',[stages[0].id])).then(function(stage_events){
	return stage_events.reduce(function(sequence, stage_event){
		return sequence.then(function(){
			return excute(mysql.format('SELECT * FROM `whoscored_stages` WHERE id = ? LIMIT 1',[stage_event.stage_id]))
		}).then(function(whoscored_stages){
			return excute(mysql.format('SELECT * FROM `whoscored_tournaments` WHERE id = ? LIMIT 1',[whoscored_stages[0].tournament_id]))
		}).then(function(whoscored_tournaments){
			console.log('/Regions/'+tournament.region_id+'/Tournaments/'+tournament.id)
		})
	})
})*/
excute(mysql.format('SELECT * FROM `whoscored_regions`')).then(function(regions){
	return regions.reduce(function(sequence, region){
		return sequence.then(function(){
			return excute(mysql.format('SELECT * FROM `whoscored_tournaments` WHERE region_id = ?',[region.id]))
		}).then(function(tournaments){
			tournaments.forEach(function(tournament){
				console.log('/Regions/'+tournament.region_id+'/Tournaments/'+tournament.id)
				//crawler.queueURL(host + '/Regions/'+tournament.region_id+'/Tournaments/'+tournament.id);
			})
			//Regions/252/Tournaments/2/England-Premier-League
		})
	},Promise.resolve())
}).then(function(){
	crawler.start();
})
/*crawler.queueURL(host + '/Regions/252/Tournaments/2');
crawler.queueURL(host + '/Regions/81/Tournaments/3');
crawler.queueURL(host + '/Regions/206/Tournaments/4');
crawler.queueURL(host + '/Regions/108/Tournaments/5');
crawler.queueURL(host + '/Regions/74/Tournaments/22');
crawler.start();*/