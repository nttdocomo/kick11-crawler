/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
difference = require('../../utils').difference,
BaseModel = require('../../model'),
Model = BaseModel.extend({
    tableName:'whoscored_match_event_type',
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
Model.excute = excute;
Model.table = 'whoscored_match_event_type';
Model.get_event_type = function(event_type){
    return excute(mysql.format('SELECT * FROM `whoscored_match_event_type` WHERE id = ? LIMIT 1',[event_type.value])).then(function(row){
        if(row.length){
            return row[0].id
        }
        event_type.id = event_type.value;
        delete event_type.value;
        return excute(mysql.format('INSERT INTO `whoscored_match_event_type` SET ?',event_type)).then(function(){
            excute(mysql.format('INSERT INTO `match_event_type` SET ?',event_type))
        });
    }).catch(function(err){
        console.log(err)
        return Promise.resolve()
    })
}
module.exports = Model;