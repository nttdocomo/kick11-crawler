/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
tournament = require('./tournament');
module.exports = function(stages,fn){
    return stages.reduce(function(sequence, stage){
        return sequence.then(function(){
            var region_id,
            tournament_id = stage[4],
            tournament_short_name,
            tournament_name;
            return tournament.get_tournament_by_id(tournament_id).then(function(rows){
                if(!rows.length){
                    region_id = stage[1],
                    tournament_short_name = stage[5],
                    tournament_name = stage[7];
                    return excute(mysql.format('INSERT INTO whoscored_tournaments SET ?', {
                        id:tournament_id,
                        region_id:region_id,
                        name:tournament_name,
                        short_name:tournament_short_name
                    }));
                }
            })
        });
    },Promise.resolve())
};