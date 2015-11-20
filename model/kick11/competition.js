/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
BaseModel = require('../../model'),
moment = require('moment'),
_ = require('underscore'),
mysql = require('mysql'),
difference = require('../../crawler/transfermarkt.co.uk/utils').difference,
Model = BaseModel.extend({
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
})
Model.table = 'transfermarkt_competition';
Model.get_competition_from_transfermarkt = function(name,code,nation_id){
	var transfermarkt_competition_id,
	competition_id;
	return excute(mysql.format('SELECT nation_id FROM `transfermarkt_nation_nation` WHERE transfermarkt_nation_id = ? LIMIT 1',[nation_id])).then(function(row){
		return excute(mysql.format('INSERT INTO `competition` SET ?',{
			name:name,
			code:code,
			nation_id:row[0].nation_id
		}))
	})
}
module.exports = Model;