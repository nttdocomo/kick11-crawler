var Class = require('../class'),
mysql = require('mysql'),
_ = require('underscore'),
moment = require('moment'),
excute = require('../promiseExcute');
module.exports = Class.extend({
	init:function(data){
		this.attributes = {};
	    _.extend(this.attributes,data);
	},
	save:function(){
		var me = this,
		data = this.attributes;
		return this.is_exist().then(function(row){
    		if(row.length){
    			var diff = me.needToUpdate(data,row[0]);
    			if(!_.isEmpty(diff)){
    				return me.update(diff)
    			}
    		} else {
    			return me.insert(data)
    		}
		})
	},
	is_exist:function(){
		console.log(this.get_by_id())
		return this.get_by_id().then(function(row){
			return row;
		})
	},
	needToUpdate:function(data,row){
		delete row.id;
		delete row.created_at;
		delete row.update_at;
	},
	get_by_id:function(){
		return excute(mysql.format('SELECT * FROM `'+this.tableName+'` WHERE id = ?',[this.attributes.id]));
	},
	get:function(key){
		return this.attributes[key];
	},
	update:function(data,id){
		if(!id){
			id = this.attributes.id;
		}
		data.updated_at = moment.utc().format('YYYY-MM-DD HH:mm:ss');
		return excute(mysql.format('UPDATE `'+this.tableName+'` SET ? WHERE id = ?',[data,id]))
	},
	insert:function(data){
		//console.log('insert '+data.id)
		data.created_at = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    	return excute(mysql.format('INSERT INTO `'+this.tableName+'` SET ?',data));
	}
});