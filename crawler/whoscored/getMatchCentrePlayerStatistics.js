/**
 * @author nttdocomo
 */
var http = require("http"),
excute = require('../../promiseExcute'),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
moment = require('moment-timezone'),
migrate_match = require('./migrate_match'),
migrate_match_player_statistics = require('./migrate_match_player_statistics'),
//migrate = require('../../migrate/whoscored/migrate').migrate,
_ = require('underscore'),
teamId = process.argv[2],
matchId = process.argv[3],
host = 'http://www.whoscored.com',
crawler = require('./matchesfeedconfig');
migrate_match().then(migrate_match_player_statistics).then(function(){
	return excute('SELECT id,team1_id,team2_id FROM `whoscored_match` WHERE id IN (SELECT whoscored_match_id FROM `whoscored_match_match`)')
}).then(function(row){
	return row.reduce(function(sequence, match,i){
		return excute(mysql.format('SELECT 1 FROM `whoscored_match_player_statistics` WHERE teamId = ? AND matchId = ? LIMIT 1',[match.team1_id,match.id])).then(function(stats){
    		if(!stats.length){
					console.log(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+match.team1_id+'&matchId='+match.id)
    			crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+match.team1_id+'&matchId='+match.id);
    		}
    		return Promise.resolve();
    	}).then(function(){
    		return excute(mysql.format('SELECT 1 FROM `whoscored_match_player_statistics` WHERE teamId = ? AND matchId = ? LIMIT 1',[match.team2_id,match.id]))
    	}).then(function(stats){
    		if(!stats.length){
    			crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+row[0].team2_id+'&matchId='+row[0].id);
    		}
    		return Promise.resolve();
    	})
	},Promise.resolve())
	//crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=passing&statsAccumulationType=0&teamIds=24&matchId=959591');
    if(teamId && matchId){
        crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+teamId+'&matchId='+matchId);
    	return Promise.resolve();
    } else {
    	return excute(mysql.format('SELECT 1 FROM `whoscored_match_player_statistics` WHERE teamId = ? AND matchId = ? LIMIT 1',[row[0].team1_id,row[0].id])).then(function(stats){
    		if(!stats.length){
    			crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+row[0].team1_id+'&matchId='+row[0].id);
    		}
    		return Promise.resolve();
    	}).then(function(){
    		return excute(mysql.format('SELECT 1 FROM `whoscored_match_player_statistics` WHERE teamId = ? AND matchId = ? LIMIT 1',[row[0].team2_id,row[0].id]))
    	}).then(function(stats){
    		if(!stats.length){
    			crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+row[0].team2_id+'&matchId='+row[0].id);
    		}
    		return Promise.resolve();
    	})
    }
})
/*.then(function(){
	crawler.queueURL('http://www.whoscored.com/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=&statsAccumulationType=0&isCurrent=true&playerId=&teamIds=23&matchId=959649&stageId=&tournamentOptions=&sortBy=&sortAscending=&age=&ageComparisonType=&appearances=&appearancesComparisonType=&field=&nationality=&positionOptions=&timeOfTheGameEnd=&timeOfTheGameStart=&isMinApp=&page=&includeZeroValues=&numberOfPlayersToPick=');
})*/.then(function(){
    crawler.start();
}).catch(function(err){
    console.log(err)
})
