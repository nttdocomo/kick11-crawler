/**
 * @author nttdocomo
 */
var http = require("http"),
excute = require('../../promiseExcute'),
mysql = require('mysql'),
moment = require('moment-timezone'),
migrate_match = require('./migrate_match'),
migrate_match_player_statistics = require('./migrate_match_player_statistics'),
//migrate = require('../../migrate/whoscored/migrate').migrate,
_ = require('underscore'),
input_date = process.argv[2],
host = 'https://www.whoscored.com',
crawler = require('./matchesfeedconfig');
var date = [],
condition = 0,
now = moment.utc(),
clone = now.clone();
crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds=2200&matchId=982381');
crawler.start();
