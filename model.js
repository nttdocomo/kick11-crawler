var Class = require('./class'),
mysql = require('mysql2'),
_ = require('underscore'),
moment = require('moment'),
excute = require('./promiseExcute');
module.exports = Class.extend({
	init:function(data){
		this.attributes = {};
	    _.extend(this.attributes,data);
	},
	save:function(){
		var me = this,
		data = this.attributes;
		const is_exist = this.is_exist()
		return is_exist.then(function(row){
    		if(row.length){
    			return me.update(data)
    		} else {
    			//console.log(me.get('id') + ' is not in the databse')
    			return me.insert(data)
    		}
    		return Promise.resolve()
		}).catch(function(err){
			console.log(err)
			return Promise.resolve()
		})
	},
	is_exist:function(){
		return this.get_by_id()
	},
	needToUpdate:function(data,row){
		delete row.id;
		delete row.created_at;
		delete row.update_at;
	},
	get_by_id:function(){
		const ret = excute(mysql.format('SELECT * FROM `'+this.constructor.table+'` WHERE id = ?',[this.get('id')]));
		return ret;
	},
	get:function(key){
		return this.attributes[key];
	},
	set:function(key,value){
		return this.attributes[key] = value;
	},
	query:function(sql){
		return excute(sql).then(function(result){

		});
	},
	update:function(data,id){
		if(!id){
			id = this.attributes.id;
		}
		//data.updated_at = moment.utc().format('YYYY-MM-DD HH:mm:ss');
		//console.log(mysql.format('UPDATE `'+this.constructor.table+'` SET ? WHERE id = ?',[data,id]))
		return excute(mysql.format('UPDATE `'+this.constructor.table+'` SET ? WHERE id = ?',[data,id]))
	},
	insert:function(data){
		//console.log('insert '+data.id)
		//data.created_at = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    	return excute(mysql.format('INSERT INTO `'+this.constructor.table+'` SET ?',data));
	}
});
