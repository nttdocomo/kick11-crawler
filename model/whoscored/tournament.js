/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
difference = require('../../utils').difference,
Model = require('../../model'),
Tournament = Model.extend({
    table:'whoscored_tournaments',
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
Tournament.excute = excute;
Tournament.table = 'whoscored_tournaments';
Tournament.get_by_id = function(id){
    return excute(mysql.format('SELECT 1 FROM '+this.table+' WHERE id = ?',[id]))
}
Tournament.get_tournaments = function(tournaments){
    return tournaments.reduce(function(sequence, item, i){
    	var tournament = new Tournament({
            id:item[4],
            region_id:item[1],
            name:item[7],
            short_name:item[5]
        })
        return sequence.then(function(){
            return tournament.save();
        });
    },Promise.resolve())
};
module.exports = Tournament;