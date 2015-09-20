var StringDecoder = require('string_decoder').StringDecoder,
decoder = new StringDecoder('utf8'),
get_player = require('../../model/whoscored/player').get_player,
MatchEvent = require('../../model/kick11/event').model,
get_events = require('./events').get_events,
get_goals = require('./goals').get_goals,
get_registration = require('./registration').get_registration;
module.exports = function(queueItem, content, response){
    var match_id = queueItem.path.replace(/^\/MatchesFeed\/(\d{1,})\/MatchCentre2$/,"$1");
    console.log('MatchesFeed started');
    next = this.wait();
    return get_player(content).then(function(){
        console.log('get player complete!')
        return get_registration(content, match_id)
    }).then(function(){
        return get_goals(content, match_id)
    }).then(function(){
        return get_events(content, match_id)
    }).then(function(){
        return MatchEvent.save_from_whoscored(content, match_id)
    })
    return Promise.resolve();
}