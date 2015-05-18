/**
 * @author nttdocomo
 */
 var excute = require('../../promiseExcute'),mysql = require('mysql');
module.exports = function(stages,fn){
    return Promise.resolve().then(function(){
        return stages.filter(function(stage){
            return !fn(region[1]);
        }).reduce(function(sequence, stage){
            var region_id = stage[1],
            region_short_name = stage[2],
            region_name = stage[3];
            return sequence.then(function(){
                return excute(mysql.format('INSERT INTO whoscored_regions SET ?', {
                    id:region_id,
                    name:region_name,
                    short_name:region_short_name
                }));
            });
        },Promise.resolve())
    })
};