var excute = require('../../promiseExcute'),
Match = require('../../model/whoscored/matches');
module.exports = function(){
    return excute('SELECT * FROM `whoscored_match` WHERE id NOT IN (SELECT whoscored_match_id FROM `whoscored_match_match`)').then(function(whoscored_matches){
        if(whoscored_matches.length){
            return whoscored_matches.reduce(function(sequence,match,i){
                return sequence.then(function(){
                    return Match.insert_match(match).catch(function(err){
                        console.log(err)
                        return Promise.resolve()
                    })
                })
            },Promise.resolve())
        }
        return Promise.resolve();
    })
}