/**
 * @author nttdocomo
 */
 var excute = require('../../excute'),mysql = require('mysql');
module.exports = function(stages,fn){
    stages.forEach(function(stage){
        var season_id = stage[6];
        if(!fn(season_id)){
            excute(mysql.format('INSERT INTO whoscored_seasons SET ?',{
	        	id:season_id
	        }));
        }
    })
};