/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
season = require('./season');
module.exports = function(stages){
    return stages.reduce(function(sequence, stage){
        return sequence.then(function(){
            var season_id = stage[6];
            return season.get_season_by_id(season_id).then(function(rows){
                if(!rows.length){
                    return excute(mysql.format('INSERT INTO whoscored_seasons SET ?',{
                        id:season_id
                    }));
                }
            })
	    });
    },Promise.resolve())
};