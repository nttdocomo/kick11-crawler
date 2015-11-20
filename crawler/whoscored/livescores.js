/**
 * @author nttdocomo
 */
var http = require("http"),
excute = require('../../promiseExcute'),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
moment = require('moment-timezone'),
Match = require('../../model/whoscored/matches'),
MatchPlayerStatistic = require('../../model/kick11/statistic'),
//migrate = require('../../migrate/whoscored/migrate').migrate,
_ = require('underscore'),
input_date = process.argv[2],
host = 'http://www.whoscored.com',
crawler = require('./test_matchesfeedconfig');
var date = [],
condition = 0,
now = moment.utc(),
clone = now.clone();
excute('SELECT * FROM `whoscored_match` WHERE id NOT IN (SELECT whoscored_match_id FROM `whoscored_match_match`)').then(function(whoscored_matches){
    if(whoscored_matches.length){
        return whoscored_matches.reduce(function(sequence,match,i){
            return sequence.then(function(){
                return Match.insert_match(match).catch(function(err){
                    console.log(err)
                    return Promise.resolve()
                })
            })
        },Promise.resolve())
    }
    return Promise.resolve();
}).then(function(){
    return excute('SELECT * FROM `whoscored_match_player_statistics` WHERE id NOT IN (SELECT whoscored_match_player_statistics_id FROM `whoscored_match_player_statistics_relation`)').then(function(whoscored_match_player_statistics){
        if(whoscored_match_player_statistics.length){
            console.log('migrate match_player_statistics')
            return whoscored_match_player_statistics.reduce(function(sequence,whoscored_match_player_statistic){
                return sequence.then(function(){
                    return MatchPlayerStatistic.getMatchCentrePlayerStatistics(whoscored_match_player_statistic)
                })
            },Promise.resolve())
        }
        return Promise.resolve()
    })
})/*.then(function(){
    return excute(mysql.format('SELECT DISTINCT play_at FROM whoscored_match WHERE play_at < ? ORDER BY play_at DESC',[moment.utc().format('YYYY-MM-DD HH:mm')]));
}).then(function(row){
    if(row.length){
        var play_at = _.find(row,function(item){
            var play = moment.utc(item.play_at);
            return clone.diff(play,'m') > 1 && clone.diff(play,'m') < 180;
        })
        if(play_at){
            console.log('there is macth there not complete')
            crawler.queueURL(host + '/matchesfeed/?d=' + now.tz('Europe/London').format('YYYYMMDD'));
        }
    } else {
        console.log('there no today matches in database')
        crawler.queueURL(host + '/matchesfeed/?d=' + now.tz('Europe/London').format('YYYYMMDD'));
    }
    return Promise.resolve();
}).then(function(){
    return excute('SELECT DISTINCT play_at FROM whoscored_match ORDER BY play_at ASC')
}).then(function(row){
    if(row.length){
        crawler.queueURL(host + '/matchesfeed/?d='+moment(row[0].play_at).subtract(1,'d').format('YYYYMMDD'));
    }
    return Promise.resolve();
}).then(function(){
    crawler.start();
}).catch(function(err){
    console.log(err)
})*/.then(function(){
    //crawler.queueURL(host + '/MatchesFeed/959599/MatchCentre2');
    //crawler.queueURL(host + '/matchesfeed/?d=20151108');
    //crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds=7121&matchId=1017566');
    //crawler.start();
    console.log('complete')
    process.exit()
})
/*crawler.queueURL(host + '/Regions/81/Tournaments/3');
crawler.start();*/
//http://www.whoscored.com/matchesfeed/?d=20141021
//http://www.whoscored.com/tournamentsfeed/9155/Fixtures/?d=2014W42&isAggregate=false