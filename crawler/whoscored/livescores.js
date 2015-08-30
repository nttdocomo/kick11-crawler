/**
 * @author nttdocomo
 */
var http = require("http"),
excute = require('../../promiseExcute'),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
Crawler = require("simplecrawler"),
//migrate = require('../../migrate/whoscored/migrate').migrate,
_ = require('underscore'),
input_date = process.argv[2],
host = 'http://www.whoscored.com',
crawler = require('./matchesfeedconfig');
var date = [],
condition = 0,
now = moment.utc(),
clone = now.clone();
excute(mysql.format('SELECT DISTINCT play_at FROM whoscored_matches WHERE play_at = ? ORDER BY play_at DESC',[moment.utc().format('YYYY-MM-DD HH:mm')])).then(function(row){
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
    crawler.start();
})

function promiseWhile(condition, body) {
  return new Promise(function(resolve,reject){

    function loop() {
      Promise.resolve(condition()).then(function(result){
        // When the result of calling `condition` is no longer true, we are done.
        if (!result){
          resolve();
        } else {
          // When it completes loop again otherwise, if it fails, reject
          Promise.resolve(body()).then(loop,reject);
        }
      });
    }

    // Start running the loop
    loop();
  });
}

//http://www.whoscored.com/matchesfeed/?d=20141021
//http://www.whoscored.com/tournamentsfeed/9155/Fixtures/?d=2014W42&isAggregate=false