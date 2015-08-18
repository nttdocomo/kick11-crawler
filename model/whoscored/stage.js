/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
difference = require('../../utils').difference,
Model = require('../../model'),
Stage = Model.extend({
    tableName:'whoscored_stages',
    is_exist:function(){
        return excute(mysql.format('SELECT 1 FROM '+this.constructor.table+' WHERE id = ?',[this.get('id')])).then(function(row){
            return row.length;
        })
    },
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
Stage.excute = excute;
Stage.table = 'whoscored_stages';
Stage.get_by_id = function(id){
    excute(mysql.format('SELECT 1 FROM '+this.table+' WHERE id = ?',[id]))
}
Stage.get_stages = function(stages){
    return stages.reduce(function(sequence, item){
        return sequence.then(function(){
            var stage = new Stage({
                id:item[0],
                tournament_id:item[4],
                season_id:item[6]
            });
            return stage.save();
        });
    },Promise.resolve())
};
module.exports = Stage