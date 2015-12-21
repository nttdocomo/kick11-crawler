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
var date = [],
condition = 0,
now = moment.utc(),
clone = now.clone();
migrate_match().then(migrate_match_player_statistics).then(function(){
	return excute('SELECT * FROM `whoscored_match` WHERE id IN (SELECT whoscored_match_id FROM `whoscored_match_match` WHERE whoscored_match_id NOT IN (SELECT matchId FROM `whoscored_match_player_statistics`))')
}).then(function(row){
	//crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=passing&statsAccumulationType=0&teamIds=24&matchId=959591');
    if(teamId && matchId){
        crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+teamId+'&matchId='+matchId);
        crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=passing&subcategory=all&statsAccumulationType=0&teamIds='+teamId+'&matchId='+matchId);
        crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=defensive&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+teamId+'&matchId='+matchId);
        crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=offensive&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+teamId+'&matchId='+matchId);
    } else {
    	if(row.length){
    		row.forEach(function(item){
    			crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+item.team1_id+'&matchId='+item.id);
		        crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=passing&subcategory=all&statsAccumulationType=0&teamIds='+item.team1_id+'&matchId='+item.id);
		        crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=defensive&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+item.team1_id+'&matchId='+item.id);
		        crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=offensive&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+item.team1_id+'&matchId='+item.id);
    			crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+item.team2_id+'&matchId='+item.id);
		        crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=passing&subcategory=all&statsAccumulationType=0&teamIds='+item.team2_id+'&matchId='+item.id);
		        crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=defensive&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+item.team2_id+'&matchId='+item.id);
		        crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=offensive&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+item.team2_id+'&matchId='+item.id);
    		})
    	}
    }
    return Promise.resolve();
}).then(function(){
    crawler.start();
}).catch(function(err){
    console.log(err)
})
