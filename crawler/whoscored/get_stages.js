/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
stage = require('./stage');
module.exports = function(stages){
    return stages.reduce(function(sequence, item){
        return sequence.then(function(){
            var stage_id = item[0],tournament_id,season_id;
            return stage.get_stage_by_id(stage_id).then(function(rows){
                if(!rows.length){
                    tournament_id = item[4];
                    season_id = item[6];
                    return excute(mysql.format('INSERT INTO whoscored_stages SET ?', {
                        id:stage_id,
                        tournament_id:tournament_id,
                        season_id:season_id
                    }))
                }
            })
        });
    },Promise.resolve())
};