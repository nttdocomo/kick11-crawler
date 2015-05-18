/**
 * @author nttdocomo
 */
 var excute = require('../../promiseExcute'),mysql = require('mysql');
module.exports = function(stages,fn){
	return Promise.resolve().then(function(){
        return stages.filter(function(stage){
            return !fn(stage[6]);
        }).reduce(function(sequence, stage){
            var season_id = stage[6];
            return sequence.then(function(){
            	return excute(mysql.format('INSERT INTO whoscored_seasons SET ?',{
		        	id:season_id
		        }));
		    });
        },Promise.resolve())
    })
};