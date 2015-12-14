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
input_date = process.argv[2],
host = 'http://www.whoscored.com',
crawler = require('./matchesfeedconfig');
var date = [],
condition = 0,
now = moment.utc(),
clone = now.clone();
migrate_match().then(migrate_match_player_statistics).then(function(){
    if(input_date){
        crawler.queueURL(host + '/matchesfeed/?d='+input_date);
        return Promise.resolve();
    }
    return excute('SELECT DISTINCT play_at FROM whoscored_match ORDER BY play_at ASC LIMIT 1').then(function(row){
        if(row.length){
            crawler.queueURL(host + '/matchesfeed/?d='+moment(row[0].play_at).subtract(1,'d').format('YYYYMMDD'));
        }
        return Promise.resolve();
    })
}).then(function(){
    crawler.start();
}).catch(function(err){
    console.log(err)
})
