var StringDecoder = require('string_decoder').StringDecoder,
decoder = new StringDecoder('utf8'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
get_stages = require('../../model/whoscored/stage').get_stages,
get_regions = require('../../model/whoscored/region').get_regions,
get_seasons = require('../../model/whoscored/season').get_seasons,
get_tournaments = require('../../model/whoscored/tournament').get_tournaments,
WhoscoredMatch = require('../../model/whoscored/matches'),
Team = require('../../model/whoscored/team'),
Match = require('../../model/kick11/match').model;
module.exports = function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8'),content = decoder.write(responseBuffer);
    console.log('matchesfeed')
    //将teams里没有的team放到teams;
    matchesfeed = eval(content);
    return get_stages(matchesfeed[1]).then(function(){
        console.log('get stages complete!')
        return get_regions(matchesfeed[1])
    },function(err){
        console.log(err)
    }).then(function(){
        console.log('get regions complete!')
        return get_seasons(matchesfeed[1]);
    },function(err){
        console.log(err)
    }).then(function(){
        console.log('get seasons complete!')
        return get_tournaments(matchesfeed[1]);
    },function(err){
        console.log(err)
    }).then(function(){
        console.log('get tournaments complete!');
        return matchesfeed[2].reduce(function(sequence, match){
            console.log('get matchesfeed')
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
            if(score != 'vs'){
                values.score1 = score.split(/\s\:\s/)[0];
                values.score2 = score.split(/\s\:\s/)[1];
            }
            var whoscoredMatch = new WhoscoredMatch(values);
            var team1 = new Team({
                id : team1_id,
                name : match[5]
            }),team2 = new Team({
                id : team2_id,
                name : match[9]
            });
            var promise = sequence.then(function(){
                console.log('get match')
                return whoscoredMatch.save();
                //return get_match(match,queueItem.path.replace(/^\/matchesfeed\/\?d\=(\d{4})(\d{2})(\d{2})$/,"$1-$2-$3"))
            }).then(function(){
                return Match.save_from_whoscored(values);
            }).then(function(){
                return team1.save()
            }).then(function(){
                return team2.save();
            }).then(function(){
                console.log('get team complete')
                return Promise.resolve()
            });
            if(match[14] && match[15]){
                promise.then(function(){
                    return excute('SELECT 1 FROM `whoscored_registration` WHERE match_id = '+match_id).then(function(row){
                        if(!row.length){
                            crawler.queueURL(host + '/MatchesFeed/'+match_id+'/MatchCentre2');
                        }
                        return Promise.resolve()
                    })
                }).then(function(){
                    return excute(mysql.format('SELECT * FROM `whoscored_match_player_statistics` WHERE matchId = ? AND teamId = ?',[match_id,match[4]])).then(function(row){
                        if(!row.length){
                            crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+match[4]+'&matchId='+match_id);
                            crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=passing&statsAccumulationType=0&teamIds='+match[4]+'&matchId='+match_id);
                            crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=defensive&statsAccumulationType=0&isCurrent=true&teamIds='+match[4]+'&matchId='+match_id);
                            crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=offensive&statsAccumulationType=0&isCurrent=true&teamIds='+match[4]+'&matchId='+match_id);
                        }
                        return Promise.resolve()
                    })
                }).then(function(){
                    return excute(mysql.format('SELECT 1 FROM `whoscored_match_player_statistics` WHERE matchId = ? AND teamId = ?',[match_id,match[8]])).then(function(row){
                        if(!row.length){
                            crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+match[8]+'&matchId='+match_id);
                            crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=passing&statsAccumulationType=0&teamIds='+match[8]+'&matchId='+match_id);
                            crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=defensive&statsAccumulationType=0&isCurrent=true&teamIds='+match[8]+'&matchId='+match_id);
                            crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=offensive&statsAccumulationType=0&isCurrent=true&teamIds='+match[8]+'&matchId='+match_id);
                        }
                        return Promise.resolve()
                    })
                });
            }
            return promise;
        },Promise.resolve())
    },function(err){
        console.log(err)
    });
    return Promise.resolve();
}