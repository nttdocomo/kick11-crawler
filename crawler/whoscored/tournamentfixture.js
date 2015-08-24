var excute = require('../../promiseExcute'),
mysql = require('mysql'),
cheerio = require('cheerio'),
StringDecoder = require('string_decoder').StringDecoder,
moment = require('moment'),
moment_tz = require('moment-timezone'),
Crawler = require("simplecrawler"),
WhoscoredMatch = require('../../model/whoscored/matches'),
Team = require('../../model/whoscored/team'),
Match = require('../../model/kick11/match').model,
_ = require('underscore'),
host = 'http://www.whoscored.com',
crawler = new Crawler('www.whoscored.com');
crawler.maxConcurrency = 1;
crawler.interval = 5000;
crawler.timeout = 10000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8'),
    next;
    console.log("Completed fetching resource:", queueItem.path);
    if(/^\/Regions\/\d{1,}\/Tournaments\/\d{1,}/i.test(queueItem.path)){//competition
    	next = this.wait();
    	var content = decoder.write(responseBuffer);
    	var $ = cheerio.load(content);
    	var stage_condotion = $('#seasons').val().match(/\/Regions\/\d+\/Tournaments\/(\d{1,})\/Seasons\/(\d{1,})/);
    	//next = this.wait();
    	var calendar = JSON.parse(content.match(/(\{\d{4}\:.*\}\}\})/)[0].replace(/\:/g,'":').replace(/\{/g,'{"').replace(/\,/g,',"'));
    	excute(mysql.format('SELECT id FROM `whoscored_stages` WHERE tournament_id = ? AND season_id = ? LIMIT 1',[stage_condotion[1],stage_condotion[2]])).then(function(stages){
    		return excute(mysql.format('SELECT * FROM `whoscored_stage_event` WHERE stage_id = ? LIMIT 1',[stages[0].id]));
    	}).then(function(stages){
    		if(stages.length){
                console.log(stages)
		    	_.each(calendar,function(months,year){
		    		_.each(months,function(days,month){
		    			month = (parseInt(month)+1)+'';
		    			if(/^\d{1}$/.test(month)){
		    				month = '0'+month;
		    			}
		    			console.log('/tournamentsfeed/'+stages[0].stage_id+'/Fixtures/?d='+[year,month].join('')+'&isAggregate=false')
                        crawler.queueURL(host + '/tournamentsfeed/'+stages[0].stage_id+'/Fixtures/?d='+[year,month].join('')+'&isAggregate=false');
		    		})
		    	});
    		}
	    	next();
    	})
    };
    if(/^\/tournamentsfeed\/\d{1,}\/Fixtures\/\?d\=\d{6}.+$/i.test(queueItem.path)){//competition
    	next = this.wait();
    	var content = decoder.write(responseBuffer),
    	matchesfeed = eval(content),
    	stage_id = queueItem.path.match(/^\/tournamentsfeed\/(\d{1,})\/Fixtures\/\?d\=\d{6}.+$/)[1];
        Promise.resolve().then(function(){
            console.log(matchesfeed.length)
            return matchesfeed.reduce(function(sequence, match){
                var match_id = match[0],
                team1_id = match[4],
                team2_id = match[7],
                play_at =  moment.tz([match[2],match[3]].join(' '), "dddd, MMM D YYYY HH:mm", "Europe/London").utc().format('YYYY-MM-DD HH:mm'),
                score = match[10],
                values = {
                    'id':match_id,
                    'team1_id':team1_id,
                    'team2_id':team2_id,
                    'play_at':play_at,
                    'stage_id':stage_id
                };
                console.log('aaaa')
                if(score != 'vs'){
                    values.score1 = score.split(/\s\:\s/)[0];
                    values.score2 = score.split(/\s\:\s/)[1];
                }
                var whoscoredMatch = new WhoscoredMatch(values);
                var team1 = new Team({
                    id : team1_id,
                    name : match[5]
                }),team2 = new Team({
                    id : team2_id,
                    name : match[8]
                });
                var promise = sequence.then(function(){
                    console.log('get match')
                    return whoscoredMatch.save();
                    //return get_match(match,queueItem.path.replace(/^\/matchesfeed\/\?d\=(\d{4})(\d{2})(\d{2})$/,"$1-$2-$3"))
                }).then(function(){
                    return Match.save_from_whoscored(values);
                }).then(function(){
                    return team1.save()
                }).then(function(){
                    return team2.save();
                }).then(function(){
                    console.log('get team complete')
                    return Promise.resolve()
                });
                return promise;
            },Promise.resolve())
        }).then(function(){
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
}).on('fetchredirect',function(queueItem, parsedURL, errorData){
    console.log('fetchredirect');
    console.log(queueItem.path);
    return false;
    //crawler.queueURL(host + queueItem.path);
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
/*excute(mysql.format('SELECT * FROM `whoscored_regions`')).then(function(regions){
	return regions.reduce(function(sequence, region){
		return sequence.then(function(){
			return excute(mysql.format('SELECT * FROM `whoscored_tournaments` WHERE region_id = ?',[region.id]))
		}).then(function(tournaments){
			tournaments.forEach(function(tournament){
				console.log('/Regions/'+tournament.region_id+'/Tournaments/'+tournament.id)
				crawler.queueURL(host + '/Regions/'+tournament.region_id+'/Tournaments/'+tournament.id);
			})
			//Regions/252/Tournaments/2/England-Premier-League
		})
	},Promise.resolve())
}).then(function(){
	crawler.start();
})*/
crawler.queueURL(host + '/Regions/252/Tournaments/2');
/*crawler.queueURL(host + '/Regions/81/Tournaments/3');
crawler.queueURL(host + '/Regions/206/Tournaments/4');
crawler.queueURL(host + '/Regions/108/Tournaments/5');
crawler.queueURL(host + '/Regions/74/Tournaments/22');*/
crawler.start();