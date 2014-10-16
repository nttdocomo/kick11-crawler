/**
 * @author nttdocomo
 */
var http = require("http"), fs = require('fs'), cheerio = require('cheerio'),excute = require('../transfermarkt.co.uk/excute'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),moment = require('moment'),moment_tz = require('moment-timezone'),
Crawler = require("simplecrawler"),pool  = require('../transfermarkt.co.uk/pool'),
host = 'http://www.whoscored.com';
_ = require('underscore');
crawler = new Crawler('www.whoscored.com');
crawler.maxConcurrency = 2;
crawler.interval = 300;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.customHeaders = {
    Host:'www.whoscored.com',
    Referer:'http://www.whoscored.com/LiveScores',
    'X-Requested-With':'XMLHttpRequest',
    Cookie:'__gads=ID=7400c9eb48861252:T=1407717687:S=ALNI_MZbNZufnguyMAdt6A2DXy8Hirg7oA; ebNewBandWidth_.www.whoscored.com=863%3A1408183698417; ui=nttdocomo:bjmU8NSBC0WzoKOkAO-9TQ:3619521175:SHKLWvTkwNCw4YKgZQA0cg8IkHCbOnpSkXIJdsjHZI8; ua=nttdocomo:bjmU8NSBC0WzoKOkAO-9TQ:3619521175:Cmahf0NIXa_v-sD8BkI3Tg9HVIkTt2NruY5jcRetDrM; mp_430958bdb5bff688df435b09202804d9_mixpanel=%7B%22distinct_id%22%3A%20%22147c283461b55-0841a221e-4e46072c-1fa400-147c283461d11f%22%2C%22%24initial_referrer%22%3A%20%22http%3A%2F%2Fwww.whoscored.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.whoscored.com%22%7D; _ga=GA1.2.458243098.1407717765'
}
var statistics = [],
full_statistics = [],
gk_statistics = [],
pl_statistics = [];
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8');
    //console.log(decoder.write(responseBuffer));
    if(/^\/\w+?\/\?d\=\d{8}$/.test(queueItem.path)){
        var data = eval(decoder.write(responseBuffer)),
        stages = data[1],
        matches = data[2];
        stages.forEach(function(stage){
            var id = stage[0],
            region_id = stage[1],
            country_name = stage[3],
            season_id = stage[6],
            stage_name = stage[7]
        })
        matches.forEach(function(match){
            var id = match[1],
            stage_id = match[0],
            team1_id = match[4],
            team2_id = match[8],
            team1_name = match[5],
            team2_name = match[9],
            result = match[12];
            crawler.queueURL(host + '/Matches/'+id+'/LiveStatistics');
        })
    }
    if(/^\/\w+?\/(\d{1,})\/\w+$/.test(queueItem.path)){
        var $ = cheerio.load(decoder.write(responseBuffer));
        var match_id = queueItem.path.replace(/^\/\w+?\/(\d{1,})\/\w+$/,'$1');
        $('script').each(function(index,script){
            var html = $(script).html().replace(/[\s|\n]/ig,"");
            if(/^var\S+?(\[\[\[.+?\])\;\$\S+?\}\)\;$/.test(html)){
                html = $(script).html().replace(/[\n|\r]/ig,'').replace(/\s{2,}/ig,'').replace(/\s(\;)/ig,'$1').replace(/(\,)\s(\d)/ig,'$1$2');
                var data = eval(html.replace(/.+?(\[\[\[.+\,\d{1,3}\])\;.+/,'$1'))[0],
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

                team1_players.forEach(function(player,i){
                    var player_id = player[0],
                    player_name = player[1],
                    player_match_position = player[5],
                    player_position = player[9],
                    player_age = player[10],
                    player_height = player[11],
                    player_weight = player[12],
                    player_substution_time = player[8],
                    player_substution_in_out = player[7],
                    player_pos = player[6];
                    if(player[3].length){
                        if(player_position == 'GK'){
                            player[3][0].forEach(function(item){
                                if(gk_statistics.indexOf(item[0]) == -1){
                                    gk_statistics.push(item[0])
                                }
                            })
                        } else {
                            player[3][0].forEach(function(item){
                                /*if(item[0] === 'diving_save'){
                                    console.log(player_name)
                                }*/
                                if(pl_statistics.indexOf(item[0]) == -1){
                                    pl_statistics.push(item[0])
                                }
                            })
                        }
                    }
                    //console.log([player_id,player_name,player_position].join('-----'));
                });
                team2_players.forEach(function(player,i){
                    var player_id = player[0],
                    player_name = player[1],
                    player_match_position = player[5],
                    player_position = player[9],
                    player_age = player[10],
                    player_height = player[11],
                    player_weight = player[12],
                    player_substution_time = player[8],
                    player_substution_in_out = player[7],
                    player_pos = player[6];
                    if(player[3].length){
                        if(player_position == 'GK'){
                            player[3][0].forEach(function(item){
                                if(gk_statistics.indexOf(item[0]) == -1){
                                    gk_statistics.push(item[0])
                                }
                            })
                        } else {
                            player[3][0].forEach(function(item){
                                /*if(item[0] === 'diving_save'){
                                    console.log(player_name)
                                }*/
                                if(pl_statistics.indexOf(item[0]) == -1){
                                    pl_statistics.push(item[0])
                                }
                            })
                        }
                    }
                });
            }
        });
    }
    //console.log($('script').eq(17).html().replace(/[\s|\n]/ig,"").replace(/^var\S+?(\[\[\[.+?\])\;\$\S+?\}\)\;$/ig,"$1"));
    /*var decoder = new StringDecoder('utf8');
    var matches = eval(decoder.write(responseBuffer).replace(/[\n|\r|\n\r]/gi,""));
    matches.forEach(function(item){
        var match_id = item[0], date = item[2],time = item[3],team1_id = item[4],team1_name = item[5],team2_id = item[7],team2_name = item[8],result = item[10],score1 = /\d{1,2}\s\:\s\d{1,2}/.test(result) ? result.split(':')[0].replace(/^\s\d{1,2}\s$/,'$1'):'',score2 = /\d{1,2}\s\:\s\d{1,2}/.test(result) ? result.split(':')[1].replace(/^\s\d{1,2}\s$/,'$1') : '';
        console.log([date,time,team1_id,team1_name,score1,score2,team2_name,team2_id].join('<<>>'));
        console.log('http://www.whoscored.com/Matches/'+match_id+'/LiveStatistics')
    })*/
}).on('complete',function(){
    console.log('complete');
    statistics = _.intersection(gk_statistics,pl_statistics);
    //console.log(_.difference(gk_statistics, statistics).sort());
    //console.log(_.difference(pl_statistics, statistics).sort());
    //console.log(statistics.sort());
    console.log(_.union(gk_statistics,pl_statistics).length);
    fs.open('./index.html', 'w', 0666, function(e, fd) {
        if (e) {
            console.log('错误信息：' + e);
        } else {
            fs.write(fd, _.union(gk_statistics,pl_statistics).sort().join(',\n'), 0, 'utf8', function(e) {
                if (e) {
                  console.log('出错信息：' + e);
                } else {
                  fs.closeSync(fd);
                }
            });
        }
    });
}).on('fetcherror',function(queueItem, response){
    console.log('fetcherror')
    console.log(queueItem.path)
}).on('fetchtimeout',function(queueItem, response){
    console.log('fetchtimeout')
    console.log(queueItem.path)
}).on('fetchclienterror',function(queueItem, errorData){
    console.log('fetchclienterror')
    console.log(queueItem.path)
});
//crawler.queueURL(host + '/tournamentsfeed/9155/Fixtures/?d=201408&isAggregate=false');
/*excute('CREATE TABLE IF NOT EXISTS `whoscored_player` (\
    `id` int(10) unsigned NOT NULL,\
    `name` varchar(30) NOT NULL,\
    PRIMARY KEY (`id`)\
) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
excute('CREATE TABLE IF NOT EXISTS `whoscored_player_match_statistics` (\
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
    `match_id` int(10) unsigned NOT NULL,\
    `player_id` int(10) unsigned NOT NULL,\
    `leftside_pass` tinyint(2) unsigned DEFAULT NULL,\
    `accurate_pass` tinyint(2) unsigned DEFAULT NULL,\
    `total_final_third_passes` tinyint(2) unsigned DEFAULT NULL,\
    `rightside_pass` tinyint(2) unsigned DEFAULT NULL,\
    `attempts_conceded_ibox` tinyint(2) unsigned DEFAULT NULL,\
    `touches` tinyint(2) unsigned DEFAULT NULL,\
    `total_fwd_zone_pass` tinyint(2) unsigned DEFAULT NULL,\
    `accurate_fwd_zone_pass` tinyint(2) unsigned DEFAULT NULL,\
    `attempts_conceded_obox` tinyint(2) unsigned DEFAULT NULL,\
    `ball_recovery` tinyint(2) unsigned DEFAULT NULL,\
    `poss_won_def_3rd` tinyint(2) unsigned DEFAULT NULL,\
    `accurate_back_zone_pass` tinyint(2) unsigned DEFAULT NULL,\
    `successful_open_play_pass` tinyint(2) unsigned DEFAULT NULL,\
    `total_back_zone_pass` tinyint(2) unsigned DEFAULT NULL,\
    `total_long_balls` tinyint(2) unsigned DEFAULT NULL,\
    `goals_conceded_ibox` tinyint(2) unsigned DEFAULT NULL,\
    `open_play_pass` tinyint(2) unsigned DEFAULT NULL,\
    `total_pass` tinyint(2) unsigned DEFAULT NULL,\
    `total_launches` tinyint(2) unsigned DEFAULT NULL,\
    `fwd_pass` tinyint(2) unsigned DEFAULT NULL,\
    `game_started` tinyint(2) unsigned DEFAULT NULL,\
    `long_pass_own_to_opp` tinyint(2) unsigned DEFAULT NULL,\
    `successful_final_third_passes` tinyint(2) unsigned DEFAULT NULL,\
    `poss_lost_all` tinyint(2) unsigned DEFAULT NULL,\
    `accurate_long_balls` tinyint(2) unsigned DEFAULT NULL,\
    `poss_lost_ctrl` tinyint(2) unsigned DEFAULT NULL,\
    `final_third_entries` tinyint(2) unsigned DEFAULT NULL,\
    `mins_played` tinyint(2) unsigned DEFAULT NULL,\
    `long_pass_own_to_opp_success` tinyint(2) unsigned DEFAULT NULL,\
    `formation_place` tinyint(2) unsigned DEFAULT NULL,\
    `position` tinyint(2) unsigned DEFAULT NULL,\
    `cross_inaccurate` tinyint(2) unsigned DEFAULT NULL,\
    `dribble_lost` tinyint(2) unsigned DEFAULT NULL,\
    `duel_ground_lost` tinyint(2) unsigned DEFAULT NULL,\
    `duel_ground_won` tinyint(2) unsigned DEFAULT NULL,\
    `goal_normal` tinyint(2) unsigned DEFAULT NULL,\
    `keeper_claim_high_lost` tinyint(2) unsigned DEFAULT NULL,\
    `keeper_claim_lost` tinyint(2) unsigned DEFAULT NULL,\
    `keeper_sweeper_lost` tinyint(2) unsigned DEFAULT NULL,\
    `pass_backzone_inaccurate` tinyint(2) unsigned DEFAULT NULL,\
    `pass_forwardzone_inaccurate` tinyint(2) unsigned DEFAULT NULL,\
    `pass_inaccurate` tinyint(2) unsigned DEFAULT NULL,\
    `pass_longball_inaccurate` tinyint(2) unsigned DEFAULT NULL,\
    `pass_throughball_inacurate` tinyint(2) unsigned DEFAULT NULL,\
    `penalty_missed` tinyint(2) unsigned DEFAULT NULL,\
    `tackle_lost` tinyint(2) unsigned DEFAULT NULL,\
    `rating` float unsigned DEFAULT NULL,\
    `rating_points` float unsigned DEFAULT NULL,\
    `rating_offensive` float unsigned DEFAULT NULL,\
    `rating_offensive_points` float unsigned DEFAULT NULL,\
    `rating_defensive` float unsigned DEFAULT NULL,\
    `rating_defensive_points` float unsigned DEFAULT NULL,\
    `penalty_shootout_scored` tinyint(2) unsigned DEFAULT NULL,\
    `penalty_shootout_missed_off_target` tinyint(2) unsigned DEFAULT NULL,\
    `penalty_shootout_saved` tinyint(2) unsigned DEFAULT NULL,\
    PRIMARY KEY (`id`)\
) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
excute('CREATE TABLE IF NOT EXISTS `gk_player_match_statistics` (\
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
    `player_match_statistics_id` int(10) unsigned NOT NULL,\
    `diving_save` tinyint(2) unsigned DEFAULT NULL,\
    `keeper_pick_up` tinyint(2) unsigned DEFAULT NULL,\
    `goals_conceded_gk` tinyint(2) unsigned DEFAULT NULL,\
    `saves` tinyint(2) unsigned DEFAULT NULL,\
    `accurate_keeper_throws` tinyint(2) unsigned DEFAULT NULL,\
    `goal_kicks` tinyint(2) unsigned DEFAULT NULL,\
    `keeper_throws` tinyint(2) unsigned DEFAULT NULL,\
    `accurate_launches` tinyint(2) unsigned DEFAULT NULL,\
    `accurate_goal_kicks` tinyint(2) unsigned DEFAULT NULL,\
    `saved_obox` tinyint(2) unsigned DEFAULT NULL,\
    `stand_catch` tinyint(2) unsigned DEFAULT NULL,\
    `goals_conceded_obox_gk` tinyint(2) unsigned DEFAULT NULL,\
    `goal_scored_by_team_gk` tinyint(2) unsigned DEFAULT NULL,\
    `penalty_shootout_saved_gk` tinyint(2) unsigned DEFAULT NULL,\
    `penalty_shootout_conceded_gk` tinyint(2) unsigned DEFAULT NULL,\
    PRIMARY KEY (`id`)\
) ENGINE=InnoDB DEFAULT CHARSET=utf8;')
excute('CREATE TABLE IF NOT EXISTS `simple_player_match_statistics` (\
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
    `player_match_statistics_id` int(10) unsigned NOT NULL,\
    `duel_lost` tinyint(2) unsigned DEFAULT NULL,\
    `won_tackle` tinyint(2) unsigned DEFAULT NULL,\
    `was_fouled` tinyint(2) unsigned DEFAULT NULL,\
    `won_contest` tinyint(2) unsigned DEFAULT NULL,\
    `total_chipped_pass` tinyint(2) unsigned DEFAULT NULL,\
    `effective_head_clearance` tinyint(2) unsigned DEFAULT NULL,\
    `goals_conceded_dc` tinyint(2) unsigned DEFAULT NULL,\
    `total_scoring_att` tinyint(2) unsigned DEFAULT NULL,\
    `blocked_pass` tinyint(2) unsigned DEFAULT NULL,\
    `passes_right` tinyint(2) unsigned DEFAULT NULL,\
    `att_openplay` tinyint(2) unsigned DEFAULT NULL,\
    `poss_won_mid_3rd` tinyint(2) unsigned DEFAULT NULL,\
    `put_through` tinyint(2) unsigned DEFAULT NULL,\
    `head_clearance` tinyint(2) unsigned DEFAULT NULL,\
    `aerial_won` tinyint(2) unsigned DEFAULT NULL,\
    `outfielder_block` tinyint(2) unsigned DEFAULT NULL,\
    `att_bx_centre` tinyint(2) unsigned DEFAULT NULL,\
    `duel_won` tinyint(2) unsigned DEFAULT NULL,\
    `successful_put_through` tinyint(2) unsigned DEFAULT NULL,\
    `total_tackle` tinyint(2) unsigned DEFAULT NULL,\
    `passes_left` tinyint(2) unsigned DEFAULT NULL,\
    `att_ibox_miss` tinyint(2) unsigned DEFAULT NULL,\
    `head_pass` tinyint(2) unsigned DEFAULT NULL,\
    `shot_off_target` tinyint(2) unsigned DEFAULT NULL,\
    `att_hd_total` tinyint(2) unsigned DEFAULT NULL,\
    `effective_clearance` tinyint(2) unsigned DEFAULT NULL,\
    `att_hd_miss` tinyint(2) unsigned DEFAULT NULL,\
    `interception` tinyint(2) unsigned DEFAULT NULL,\
    `backward_pass` tinyint(2) unsigned DEFAULT NULL,\
    `interception_won` tinyint(2) unsigned DEFAULT NULL,\
    `goals_conceded_obox_dc` tinyint(2) unsigned DEFAULT NULL,\
    `fouls` tinyint(2) unsigned DEFAULT NULL,\
    `total_contest` tinyint(2) unsigned DEFAULT NULL,\
    `total_clearance` tinyint(2) unsigned DEFAULT NULL,\
    `att_miss_high` tinyint(2) unsigned DEFAULT NULL,\
    `goal_scored_by_team_dc` tinyint(2) unsigned DEFAULT NULL,\
    PRIMARY KEY (`id`)\
) ENGINE=InnoDB DEFAULT CHARSET=utf8;');*/
crawler.queueURL(host+'/Matches/829517/LiveStatistics');
crawler.queueURL(host+'/Matches/788350/LiveStatistics');
crawler.queueURL(host+'/Matches/829543/LiveStatistics');
crawler.queueURL(host+'/Matches/885686/LiveStatistics');
crawler.queueURL(host+'/Matches/885687/LiveStatistics');
crawler.queueURL(host+'/Matches/885710/LiveStatistics');
crawler.queueURL(host+'/Matches/885711/LiveStatistics');
crawler.queueURL(host+'/Matches/885734/LiveStatistics');
crawler.queueURL(host+'/Matches/885735/LiveStatistics');
crawler.queueURL(host+'/Matches/885723/LiveStatistics');
crawler.queueURL(host+'/Matches/885722/LiveStatistics');
//crawler.queueURL('http://www.whoscored.com/matchesfeed/?d=20140914');
crawler.start();