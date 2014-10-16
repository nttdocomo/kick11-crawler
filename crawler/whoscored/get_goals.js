/**
 * @author nttdocomo
 */
var fs = require('fs'), cheerio = require('cheerio'),excute = require('../transfermarkt.co.uk/excute'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),moment = require('moment'),moment_tz = require('moment-timezone'),
pool  = require('../transfermarkt.co.uk/pool'),moment = require('moment'),
input_match_id = process.argv[2],
host = 'http://www.whoscored.com';
_ = require('underscore');
module.exports = function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8'),
    $ = cheerio.load(decoder.write(responseBuffer)),
    match_id = queueItem.path.replace(/^\/\w+?\/(\d{1,})\/\w+$/,'$1');
    //console.log($('script').eq(16).html().replace(/\n/ig,'\\n').replace(/\s/ig,'\\s').replace(/\t/ig,'\\t'));
    $('script').each(function(i,script){
        var html = $(script).html().replace(/[\s|\n]/ig,"");

        if(/^var\S+?(\[\[\[.+?\])\;\S+?\)\;$/.test(html)){
            html = $(script).html().replace(/[\n|\r]/ig,'').replace(/\s{2,}/ig,'').replace(/\s(\;)/ig,'$1').replace(/(\,)\s(\d)/ig,'$1$2');
            //console.log($(script).html().replace(/\n/ig,'').replace(/\s{2,}/ig,'').replace(/\s/ig,'\\s').replace(/\t/ig,''));
            //console.log(html.replace(/.+?(\[\[\[.+\,\d\])\;.+/,'$1'))
            /*fs.open('./index.html', 'w', 0666, function(e, fd) {
                if (e) {
                  console.log('错误信息：' + e);
                } else {
                  fs.write(fd, html.replace(/.+?(\[\[\[.+\,\d\])\;.+/,'$1'), 0, 'utf8', function(e) {
                    if (e) {
                      console.log('出错信息：' + e);
                    } else {
                      fs.closeSync(fd);
                    }
                  });
                }
            });*/
            var data = eval(html.replace(/.+?(\[\[\[.+\,\d\])\;.+/,'$1'))[0],
            match_summary = data[0],
            events = data[1][0];
            events.forEach(function(event){
                var minute = event[0],
                event_summary = event[1].length ? event[1][0] : event[2][0],
                team_id = match_summary[event[1].length ? 0 : 1],
                player_id = event_summary[6],
                player_name = event_summary[0],
                event_name = event_summary[2],assists_player,assists_player_id;
                excute(mysql.format('INSERT INTO whoscored_player (id,name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_player WHERE id = ?)', [[player_id,player_name],player_id]));
                if(event_name == 'goal' || event_name == 'owngoal'){
                    assists_player = event_summary[1];
                    assists_player_id = event_summary[7];
                    score1 = event_summary[3].replace(/[\(|\)]/g,'').split('-')[0];
                    score2 = event_summary[3].replace(/[\(|\)]/g,'').split('-')[1];
                    console.log(player_id,match_id,team_id,minute,score1,score2)
                    var row_data = [player_id,match_id,team_id,minute,score1,score2];
                    if(event_name == 'owngoal'){
                        row_data.push(1);
                    }
                    row_data.push(moment.utc().format('YYYY-MM-DD hh:mm:ss'));
                    excute(mysql.format('INSERT INTO whoscored_goals (player_id,match_id,team_id,minute,score1,score2,'+(event_name == 'owngoal' ? 'owngoal,':'')+'created_at) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM whoscored_goals WHERE player_id = ? AND match_id = ? AND team_id = ? AND minute = ?)', [row_data,player_id,match_id,team_id,minute]));
                }
            })
        }
    })
};