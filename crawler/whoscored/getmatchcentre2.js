var StringDecoder = require('string_decoder').StringDecoder,
decoder = new StringDecoder('utf8'),
Player = require('../../model/whoscored/player'),
//MatchEvent = require('../../model/kick11/event').model,
get_events = require('../../model/whoscored/matchEvents').get_events,
//get_goals = require('../../model/whoscored/goals').get_goals,
get_registration = require('../../model/whoscored/registration').get_registration;
module.exports = function(queueItem, content, response){
    var content = JSON.parse(content),
    match_id = queueItem.path.replace(/^\/MatchesFeed\/(\d{1,})\/MatchCentre2$/,"$1");
    console.log('MatchesFeed started');

    return get_registration(content, match_id)/*.then(function(){
        return get_goals(content, match_id)
    })*/.then(function(){
        return get_events(content, match_id)
    })/*.then(function(){
        return MatchEvent.save_from_whoscored(content, match_id)
    })*/.catch(function(err){
        console.log(err)
        return Promise.resolve()
    })
    return Promise.resolve();
}