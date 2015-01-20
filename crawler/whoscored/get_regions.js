/**
 * @author nttdocomo
 */
 var excute = require('../../excute'),mysql = require('mysql');
module.exports = function(stages,fn){
    stages.forEach(function(stage){
        var region_id = stage[1],
        region_short_name = stage[2],
        region_name = stage[3];
        if(!fn(region_id)){
            excute(mysql.format('INSERT INTO whoscored_regions SET ?', {
                id:region_id,
                name:region_name,
                short_name:region_short_name
            }));
        }
    })
};