/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
region = require('./region');
module.exports = function(stages,fn){
    return stages.reduce(function(sequence, stage){
        return sequence.then(function(){
            var region_id = stage[1],region_short_name,region_name;
            return region.get_region_by_id(region_id).then(function(rows){
                if(!rows.length){
                    region_short_name = stage[2],
                    region_name = stage[3];
                    return excute(mysql.format('INSERT INTO whoscored_regions SET ?', {
                        id:region_id,
                        name:region_name,
                        short_name:region_short_name
                    }));
                }
            })
        });
    },Promise.resolve())
};