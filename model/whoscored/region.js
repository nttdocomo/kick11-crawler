/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
difference = require('../../utils').difference,
Model = require('../../model'),
Region = Model.extend({
    tableName:'whoscored_regions',
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
Region.excute = excute;
Region.table = 'whoscored_regions';
Region.get_by_id = function(id){
    return excute(mysql.format('SELECT 1 FROM '+this.table+' WHERE id = ?',[id]))
};
Region.get_regions = function(regions){
    return regions.reduce(function(sequence, item){
        var region = new Region({
            id:item[1],
            name:item[3],
            short_name:item[2]
        })
        return sequence.then(function(){
            return region.save();
        });
    },Promise.resolve())
};
module.exports = Region;