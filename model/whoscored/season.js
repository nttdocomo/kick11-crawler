/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
difference = require('../../utils').difference,
Model = require('../../model'),
Season = Model.extend({
    tableName:'whoscored_seasons',
    needToUpdate:function(data,row){
        this._super(data,row);
        var diff;
        if(!_.isEqual(data,row)){
            diff = difference(row,data);
            return diff;
            //return excute(mysql.format('UPDATE `transfermarket_team` SET ? WHERE id = ?',[diff,id]))
        }
        return false;
    }
});
Season.excute = excute;
Season.table = 'whoscored_seasons';
Season.get_by_id = function(id){
    return excute(mysql.format('SELECT 1 FROM '+this.table+' WHERE id = ?',[id]))
};
Season.get_seasons = function(seasons){
    return seasons.reduce(function(sequence, item){
        var season = new Season({
            id:item[6]
        })
        return sequence.then(function(){
            return season.save();
        });
    },Promise.resolve())
};
Season.get_seasons_by_tournament = function($){
    var options = $('#seasons').find("option");
    options = _.map(options,function(option){
        return option;
    })
    return options.reduce(function(sequence,option){
        var id = $(option).val().replace(/^\/\S+\/(\d+?)$/,'$1'),
        name = $(option).text(),
        year = name.replace(/(\d{4})\/\d{4}/,'$1');
        return sequence.then(function(){
            return excute(mysql.format('SELECT 1 FROM `whoscored_seasons` WHERE id = ?',[id]))
        }).then(function(row){
            if(row.length){
                return excute(mysql.format('UPDATE `whoscored_seasons` SET ? WHERE id = ?',[{
                    name:name,
                    year:year
                },id]))
            } else {
                return excute(mysql.format('INSERT INTO `whoscored_seasons` SET ?',[{
                    id:id,
                    name:name,
                    year:year
                },id]))
            }
        })
    },Promise.resolve())
};
module.exports = Season;