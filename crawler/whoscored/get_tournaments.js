/**
 * @author nttdocomo
 */
 var excute = require('../../promiseExcute'),mysql = require('mysql');
module.exports = function(stages,fn){
    return Promise.resolve().then(function(){
        return stages.filter(function(stage){
            return !fn(stage[4]);
        }).reduce(function(sequence, stage){
            var region_id = stage[1],
            tournament_id = stage[4],
            tournament_short_name = stage[5],
            tournament_name = stage[7];
            return sequence.then(function(){
                return excute(mysql.format('INSERT INTO whoscored_tournaments SET ?', {
                    id:tournament_id,
                    region_id:region_id,
                    name:tournament_name,
                    short_name:tournament_short_name
                }));
            });
        },Promise.resolve())
    });
};