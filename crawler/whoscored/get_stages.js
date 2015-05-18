/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),mysql = require('mysql');
module.exports = function(stages,fn){
    return Promise.resolve().then(function(){
        return stages.filter(function(stage){
            return !fn(stage[0]);
        }).reduce(function(sequence, stage){
            var stage_id = stage[0],
            tournament_id = stage[4],
            season_id = stage[6];
            return sequence.then(function(){
                return excute(mysql.format('INSERT INTO whoscored_stages SET ?', {
                    id:stage_id,
                    tournament_id:tournament_id,
                    season_id:season_id
                }))
            });
        },Promise.resolve())
    })
};