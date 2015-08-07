/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
Model = require('../../model'),
mysql = require('mysql');
model = Model.extend({
	tableName:'whoscored_teams',
	init:function(data){
		this._super();
	    _.extend(this.attributes,data);
	}
})
module.exports.get_team_by_id = function(id){
    return excute(mysql.format('SELECT 1 FROM whoscored_teams WHERE id = ?',[id]));
};