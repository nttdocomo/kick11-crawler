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
_ = require('underscore'),
input_date = process.argv[2],
host = 'http://www.whoscored.com',
crawler = require('./matchesfeedconfig');
var date = [],
condition = 0,
now = moment.utc(),
clone = now.clone();
migrate_match().then(migrate_match_player_statistics).then(function(){
    crawler.queueURL(host + '/matchesfeed/?d='+moment().subtract(1,'d').format('YYYYMMDD'));
    crawler.start();
})
