var StringDecoder = require('string_decoder').StringDecoder,
decoder = new StringDecoder('utf8'),
mysql = require('mysql'),
excute = require('../../promiseExcute'),
moment = require('moment-timezone'),
get_stages = require('../../model/whoscored/stage').get_stages,
get_regions = require('../../model/whoscored/region').get_regions,
get_seasons = require('../../model/whoscored/season').get_seasons,
get_tournaments = require('../../model/whoscored/tournament').get_tournaments,
Match = require('../../model/whoscored/matches'),
Team = require('../../model/whoscored/team'),
Event = require('../../model/whoscored/event');
//crawler = require('./matchesfeedconfig');
//Match = require('../../model/kick11/match').model;
module.exports = function(queueItem, matchesfeed, response,crawler){
    var host = crawler.initialProtocol + '://' + crawler.host;
    console.log('matchesfeed')
    //将teams里没有的team放到teams;
    return get_stages(matchesfeed[1]).then(function(){
        console.log('get stages complete!')
        return get_regions(matchesfeed[1])
    })/*.then(function(){
        console.log('get regions complete!')
        return Event.get_event_by_tournament(matchesfeed[1]);
    })*/.then(function(){
        console.log('get regions complete!')
        return get_tournaments(matchesfeed[1]);
    }).then(function(){
        console.log('get tournaments complete!');
        return matchesfeed[2].reduce(function(sequence, match,i){
            var match_id = match[1],
            //console.log(match_id)
            stage_id = match[0],
            team1_id = match[4],
            team2_id = match[8],
            play_at = moment.tz([queueItem.path.replace(/^\/matchesfeed\/\?d\=(\d{4})(\d{2})(\d{2})$/,"$1-$2-$3"),match[3]].join(' '),"Europe/London").utc().format('YYYY-MM-DD HH:mm'),
            score = match[12],
            values = {
                'id':match_id,
                'team1_id':team1_id,
                'team2_id':team2_id,
                'play_at':play_at,
                'stage_id':stage_id
            };
            if(score == 'vs'){
              return sequence
            }
            if(match[17] == 'AET' || match[17] == 'PEN'){
              score = score.replace(/\*/g,'');
            }
            score = score.split(/\s\:\s/);
            values.score1 = score[0];
            values.score2 = score[1];
            //var whoscoredMatch = new WhoscoredMatch(values);
            var team1 = new Team({
                id : team1_id,
                name : match[5]
            }),team2 = new Team({
                id : team2_id,
                name : match[9]
            });
            if(!values.score1 && !values.score2){
              console.log(i)
            }
            var promise = sequence.then(function(){
                return Match.get_match(values)
            }).then(function(){
                return team1.save()
            }).then(function(){
                return team2.save();
            });
            //match[14]是否分出胜负,match[15]是否有matchreport
            if((match[17] == 'FT' || match[17] == 'AET' || match[17] == 'PEN') && match[15]){
                //console.log([match[17],match[15]].join('----'))
                promise.then(function(){
                    //console.log(mysql.format('SELECT 1 FROM `whoscored_registration` WHERE match_id = ? LIMIT 1',[match_id]))
                    return excute(mysql.format('SELECT 1 FROM `whoscored_match_registration` WHERE match_id = ? LIMIT 1',[match_id]))
                }).then(function(row){
                    //console.log([match[17],match[15]].join('||||'))
                    if(!row.length){
                        crawler.queueURL(host + '/MatchesFeed/'+match_id+'/MatchCentre2');
                    }
                    return Promise.resolve()
                }).then(function(){
                    return excute(mysql.format('SELECT * FROM `whoscored_match_player_statistics` WHERE matchId = ? AND teamId = ? LIMIT 1',[match_id,match[4]]))
                }).then(function(row){
                    if(!row.length){
                        crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+match[4]+'&matchId='+match_id);
                    }
                    return Promise.resolve()
                }).then(function(){
                    return excute(mysql.format('SELECT 1 FROM `whoscored_match_player_statistics` WHERE matchId = ? AND teamId = ? LIMIT 1',[match_id,match[8]]))
                }).then(function(row){
                    if(!row.length){
                        crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+match[8]+'&matchId='+match_id);
                    }
                    return Promise.resolve()
                });
            }
            return promise.catch(function(err){
                console.log(err)
                return Promise.resolve()
            });
        },Promise.resolve())
    }).catch(function(err){
        console.log(err)
        return Promise.resolve()
    });
}
