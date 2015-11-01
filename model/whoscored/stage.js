/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
difference = require('../../utils').difference,
Model = require('../../model'),
Stage = Model.extend({
    tableName:'whoscored_stage',
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
Stage.table = 'whoscored_stage';
Stage.get_by_id = function(id){
    return excute(mysql.format('SELECT 1 FROM '+this.table+' WHERE id = ?',[id]))
}
Stage.get_stages = function(stages){
    return stages.reduce(function(sequence, item,i){
        var stage = new Stage({
            id:item[0],
            tournament_id:item[4],
            event_id:item[6]
        });
        return sequence.then(function(){
            return stage.save();
        });
    },Promise.resolve())
};
module.exports = Stage