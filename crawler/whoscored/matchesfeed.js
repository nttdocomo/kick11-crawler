/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
_ = require('underscore'),
crawler = require('./matchesfeedconfig');
var date = [],
condition = 0,
now = moment.utc().tz('Europe/London'),
last,recent,
clone = now.clone();
excute('SELECT DISTINCT play_at FROM whoscored_matches ORDER BY play_at ASC').then(function(row){
    last = moment.utc(row[0].play_at).tz('Europe/London');
    recent = moment.utc(row[row.length - 1].play_at).tz('Europe/London');
    row.forEach(function(match,i){
        var play_at = moment.utc(match.play_at),
        dateString = play_at.tz('Europe/London').format('YYYYMMDD');
        if(_.indexOf(date,dateString) == -1){
            date.push(dateString)
        }
    })
    return Promise.resolve();
}).then(function(){
    return promiseWhile(function(){
        return recent.diff(last,'d') > 0;
    },function(){
        var play_at = last.add(1, 'days').format('YYYYMMDD'),
        url;
        if(_.indexOf(date,play_at) == -1 && now.diff(last,'d') >= 1){
            url = '/matchesfeed/?d=' + play_at;
            console.log(url)
            crawler.queueURL(host + url);
        }
    })
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