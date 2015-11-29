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
    var whoscored_match_event_type_id = event_type.value,match_event_type_id;
    return excute(mysql.format('SELECT * FROM `whoscored_match_event_type` WHERE id = ? LIMIT 1',[event_type.value])).then(function(row){
        if(!row.length){
          event_type.id = event_type.value;
          delete event_type.value;
          return excute(mysql.format('INSERT INTO `whoscored_match_event_type` SET ?',event_type))
        }
        return Promise.resolve();
    }).then(function(){
        return excute(mysql.format('SELECT id FROM `match_event_type` WHERE displayName = ? LIMIT 1',[event_type.displayName]))
    }).then(function(row){
        if(row.length){
            match_event_type_id = row[0].id
            return Promise.resolve();
        }
        delete event_type.id;
        delete event_type.value;
        return excute(mysql.format('INSERT INTO `match_event_type` SET ?',event_type)).then(function(result){
          match_event_type_id = result.insertId;
          return Promise.resolve();
        })
    }).then(function(){
      return excute(mysql.format('SELECT 1 FROM `whoscored_match_event_type_relation` WHERE whoscored_match_event_type_id = ? AND match_event_type_id = ? LIMIT 1',[whoscored_match_event_type_id,match_event_type_id]))
    }).then(function(row){
      if(row.length){
        return Promise.resolve();
      }
      return excute(mysql.format('INSERT INTO `whoscored_match_event_type_relation` SET ?',{
        whoscored_match_event_type_id:whoscored_match_event_type_id,
        match_event_type_id:match_event_type_id
      }))
    }).catch(function(err){
        console.log(err)
        return Promise.resolve()
    })
}
module.exports = Model;
