/**
 * @author nttdocomo
 */
var http = require("http"), cheerio = require('cheerio'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),moment = require('moment'),moment_tz = require('moment-timezone'),
Crawler = require("simplecrawler"),pool  = require('../transfermarkt.co.uk/pool'),
host = 'http://www.whoscored.com';
_ = require('underscore');
crawler = new Crawler('www.whoscored.com');
crawler.maxConcurrency = 10;
crawler.interval = 300;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8');
    //var html = decoder.write(responseBuffer);//.replace(/\sinitialData\s\=\s(\[\[\[.+?\d{1}\])\s;.+?/,"$1");
    var $ = cheerio.load(decoder.write(responseBuffer));
    //console.log($('script').eq(16).html().replace(/\n/ig,'\\n').replace(/\s/ig,'\\s').replace(/\t/ig,'\\t'));
    $('script').each(function(i,script){
        var html = $(script).html().replace(/[\s|\n]/ig,"");
        if(/^var\S+?(\[\[\[.+?\])\;\$\S+?\}\)\;$/.test(html)){
            console.log(i);
            var data = eval(html.replace(/^var\S+?(\[\[\[.+?\])\;\$\S+?\}\)\;$/,"$1"))[0],
            team1_id = data[0][0],
            team2_id = data[0][1],
            match_time = data[0][4],
            match_time = moment.tz(match_time, "MM/DD/YYYY HH:mm:ss", "Europe/London").utc().format('YYYY-MM-DD HH:mm:ss');
            team1 = data[1][0],
            team2 = data[1][1],
            team1_statistics = team1[3][0],
            team2_statistics = team2[3][0],
            team1_players = team1[4],
            team2_players = team2[4];

            var statistics = [],len = 0;
            gk_statistics = team1_players[0][3][0].map(function(statistic){
                if(len < statistic[1][0].length){
                    len = statistic[1][0].length;
                };
                return statistic[0]
            });
            pl_statistics = team1_players[1][3][0].map(function(statistic){
                if(len < statistic[1][0].length){
                    len = statistic[1][0].length;
                };
                return statistic[0]
            });
            statistics = _.intersection(gk_statistics,pl_statistics);

            //sql = mysql.format("SELECT player1_id FROM `player_player` WHERE player2_id = ?", [player_id]);
            var sql = mysql.format("SELECT team1_id FROM `team_team` WHERE team2_id = ?", [team1_id]);
            pool.getConnection(function(err, connection) {
                connection.query(sql, function(err,rows) {
                    if (err) throw err;
                    connection.release();
                    if(rows.length){
                        var team1_ref_id = rows[0].team1_id,team2_ref_id;
                        sql = mysql.format("SELECT team1_id FROM `team_team` WHERE team2_id = ?", [team2_id]);
                        pool.getConnection(function(err, connection) {
                            connection.query(sql, function(err,rows) {
                                if (err) throw err;
                                connection.release();
                                if(rows.length){
                                    team2_ref_id = rows[0].team1_id;
                                    sql = mysql.format("SELECT id FROM `matchs` WHERE team1_id = ? AND team2_id = ? AND play_at = ?", [team1_ref_id,team2_ref_id,match_time]);
                                    pool.getConnection(function(err, connection) {
                                        connection.query(sql, function(err,rows) {
                                            if (err) throw err;
                                            connection.release();
                                            if(rows.length){
                                                var match_id = rows[0].id
                                                team1_players.forEach(function(player){
                                                    var player_id = player[0],
                                                    player_name = player[1],
                                                    player_match_position = player[5],
                                                    player_position = player[9],
                                                    player_age = player[10],
                                                    player_height = player[11],
                                                    player_weight = player[12],
                                                    player_substution_time = player[8],
                                                    player_substution_in_out = player[7],
                                                    player_pos = player[6],
                                                    player_statistics = _.object(player[3][0].map(function(item){
                                                        return [item[0],item[1][0]];
                                                    })),
                                                    statistics_data = _.pick(player_statistics,function(value, key, object){
                                                        return statistics.indexOf(key) > -1;
                                                    });
                                                    //sql = mysql.format('SELECT player1_id FROM `player_player` WHERE player2_id = ?', [player_id]);
                                                    pool.getConnection(function(err, connection) {
                                                        connection.query('SELECT player1_id FROM `player_player` WHERE player2_id = ?', [player_id], function(err,rows) {
                                                            if (err) throw err;
                                                            connection.release();
                                                            if(rows.length){
                                                                pool.getConnection(function(err, connection) {
                                                                    connection.query('INSERT INTO player_match_statistics SET ?', _.extend({},statistics_data,{
                                                                        player_id:rows[0].player1_id,
                                                                        match_id:match_id
                                                                    }), function(err,rows) {
                                                                        if (err) throw err;
                                                                        connection.release();
                                                                    });
                                                                })
                                                            }
                                                        });
                                                    });
                                                    console.log([player_id,player_name,player_position].join('-----'));
                                                });
                                                team2_players.forEach(function(player){
                                                    var player_id = player[0],
                                                    player_name = player[1],
                                                    player_match_position = player[5],
                                                    player_position = player[9],
                                                    player_age = player[10],
                                                    player_height = player[11],
                                                    player_weight = player[12],
                                                    player_substution_time = player[8],
                                                    player_substution_in_out = player[7],
                                                    player_pos = player[6],
                                                    player_statistics = player[3][0]
                                                    //console.log([player_id,player_name,player_position].join('-----'));
                                                });
                                            }
                                        });
                                    })
                                }
                            });
                        })
                    }
                });
            });
            /*console.log(statistics);
            console.log(_.difference(gk_statistics,statistics))
            console.log(_.difference(pl_statistics,statistics))
            console.log(len);
            console.log('CREATE TABLE IF NOT EXISTS `player_match_statistics` (\n  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\n  `match_id` int(10) unsigned NOT NULL,\n  `player_id` int(10) unsigned NOT NULL,\n' + statistics.map(function(item){
                return '  `' + item + '` tinyint(2) unsigned DEFAULT NULL';
            }).join(',\n') + ',\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
            console.log('CREATE TABLE IF NOT EXISTS `player_match_gk_statistics` (\n  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\n  `player_match_statistics_id` int(10) unsigned NOT NULL,\n' + _.difference(gk_statistics,statistics).map(function(item){
                return '  `' + item + '` tinyint(2) unsigned DEFAULT NULL';
            }).join(',\n') + ',\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
            console.log('CREATE TABLE IF NOT EXISTS `player_match_simple_statistics` (\n  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\n  `player_match_statistics_id` int(10) unsigned NOT NULL,\n' + _.difference(pl_statistics,statistics).map(function(item){
                return '  `' + item + '` tinyint(2) unsigned DEFAULT NULL';
            }).join(',\n') + ',\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8;');*/
            /*CREATE TABLE IF NOT EXISTS `team` (
              `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
              `owner_id` int(10) unsigned NOT NULL,
              `type` tinyint(1) unsigned NOT NULL,
              `team_name` varchar(15) NOT NULL,
              `level` tinyint(2) unsigned NOT NULL,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB  DEFAULT CHARSET=utf8;*/
            team_statistics = team1_statistics.map(function(statistic){
                return statistic[0]
            }).join(',')
        }
    })
    //console.log($('script').eq(17).html().replace(/[\s|\n]/ig,"").replace(/^var\S+?(\[\[\[.+?\])\;\$\S+?\}\)\;$/ig,"$1"));
	/*var decoder = new StringDecoder('utf8');
    var matches = eval(decoder.write(responseBuffer).replace(/[\n|\r|\n\r]/gi,""));
    matches.forEach(function(item){
    	var match_id = item[0], date = item[2],time = item[3],team1_id = item[4],team1_name = item[5],team2_id = item[7],team2_name = item[8],result = item[10],score1 = /\d{1,2}\s\:\s\d{1,2}/.test(result) ? result.split(':')[0].replace(/^\s\d{1,2}\s$/,'$1'):'',score2 = /\d{1,2}\s\:\s\d{1,2}/.test(result) ? result.split(':')[1].replace(/^\s\d{1,2}\s$/,'$1') : '';
    	console.log([date,time,team1_id,team1_name,score1,score2,team2_name,team2_id].join('<<>>'));
    	console.log('http://www.whoscored.com/Matches/'+match_id+'/LiveStatistics')
    })*/
}).on('complete',function(){
	console.log('complete')
}).on('fetcherror',function(queueItem, response){
	console.log('fetcherror')
}).on('fetchtimeout',function(queueItem, response){
	console.log('fetchtimeout')
}).on('fetchclienterror',function(queueItem, errorData){
	console.log('fetchclienterror')
	console.log(errorData)
});
//crawler.queueURL(host + '/tournamentsfeed/9155/Fixtures/?d=201408&isAggregate=false');
crawler.queueURL(host + '/Matches/829517/LiveStatistics');
crawler.start();