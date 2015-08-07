var Class = require('./class'),
mysql = require('mysql'),
moment = require('moment'),
excute = require('./promiseExcute');
module.exports = Class.extend({
	init:function(){
		this.attributes = {};
	},
	save:function(data){
		var me = this;
		return this.get_by_id().then(function(row){
    		if(row.length){
    			var diff = me.needToUpdate(data,row[0]);
    			if(diff){
    				return me.update(diff)
    			}
    		} else {
				console.log(data.id + ' save!')
    			return me.insert(data)
    		}
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
	update:function(data,id){
		if(!id){
			id = this.attributes.id;
		}
		data.updated_at = moment.utc().format('YYYY-MM-DD HH:mm:ss');
		return excute(mysql.format('UPDATE `'+this.tableName+'` SET ? WHERE id = ?',[data,id]))
	},
	insert:function(data){
		data.created_at = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    	return excute(mysql.format('INSERT INTO `'+tableName+'` SET ?',data));
	}
});