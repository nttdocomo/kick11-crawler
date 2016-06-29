/**
 * @author nttdocomo
 */
var http = require("http"),
fs = require('fs'),
StringDecoder = require('string_decoder').StringDecoder,
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
decoder = new StringDecoder('utf8'),
clone = now.clone();
fs.readFile('./cookie.txt', function(err, data){
    //if (err) throw err;
    console.log(decoder.write(data));
    crawler.customHeaders.Cookie = decoder.write(data);
    crawler.queueURL(host + '/LiveScores');
    crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
        console.log("Completed fetching resource:", queueItem.path);
        console.log(crawler.interval)
        //console.log(queueItem.status.redirected)
        var next, decoder = new StringDecoder('utf8'),content = decoder.write(responseBuffer);
        //console.log(decoder.write(responseBuffer));
        if(content && content !== null && content != 'null'){
            if(/^\/LiveScores$/.test(queueItem.path) || /^\/$/.test(queueItem.path)){//获取首页的Model-Last-Mode
                //crawler.queueURL(host + '/matchesfeed/?d=20160101');
                next = this.wait();
                content = content.replace(/(.*[\n|\r])+?.+?Model\-Last\-Mode.+'(\S+?)'.+?[\n|\r](.*[\n|\r])+/,'$2')
                //console.log(content)
                //console.log(/^[a-zA-Z0-9\+\/]([a-zA-Z0-9\+\/])+[a-zA-Z0-9=]$/.test(content))
                if(/^[a-zA-Z0-9\+\/]([a-zA-Z0-9\+\/])+[a-zA-Z0-9=]$/.test(content)){
                    modelLastMode = content;
                    console.log('Model-Last-Mode:' + modelLastMode)
                    crawler.customHeaders['Model-Last-Mode'] = modelLastMode;

                    migrate_match().then(migrate_match_player_statistics).then(function(){
                        if(input_date){
                            crawler.queueURL(host + '/matchesfeed/?d='+input_date);
                            return Promise.resolve();
                        }
                        return excute('SELECT DISTINCT play_at FROM whoscored_match ORDER BY play_at ASC LIMIT 1').then(function(row){
                            if(row.length){
                                console.log('add api')
                                crawler.queueURL(host + '/matchesfeed/?d='+moment(row[0].play_at).subtract(1,'d').format('YYYYMMDD'));
                                //console.log(crawler.queue.length)
                            }
                            return Promise.resolve();
                        })
                    }).then(function(){
                        crawler.queue.forEach(function(item){
                            console.log(item.path)
                        })
                        next();
                    }).catch(function(err){
                        console.log(err)
                        next();
                    })
                } else {
                    next();
                }
            }
        }
    })
    crawler.start();
});