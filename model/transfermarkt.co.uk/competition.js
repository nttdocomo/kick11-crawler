/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
Model = require('../../model'),
moment = require('moment'),
_ = require('underscore'),
mysql = require('mysql'),
difference = require('../../crawler/transfermarkt.co.uk/utils').difference,
Competition = Model.extend({
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
Competition.table = 'transfermarkt_competition';
Competition.get_competition = function($){
	var name = $("select[name='wettbewerb_select_breadcrumb']").find("option:selected").text(),
	code = $("select[name='wettbewerb_select_breadcrumb']").find("option:selected").val(),
	nation_id = $("select[name='land_select_breadcrumb']").find("option:selected").val();
	return excute(mysql.format('SELECT id FROM `transfermarkt_competition` WHERE code = ?',[code])).then(function(row){
		if(!row.length){
			return excute(mysql.format('INSERT INTO `transfermarkt_competition` SET ?',{
				name : name,
				code : code,
				nation_id:nation_id
			})).then(function(result){
				transfermarkt_competition_id = result.insertId;
				return excute(mysql.format('SELECT nation_id FROM `transfermarkt_nation_nation` WHERE transfermarkt_nation_id = ?',[nation_id])).then(function(row){
					return excute(mysql.format('INSERT INTO `competition` SET ?',{
	    				name:name,
	    				code:code,
	    				nation_id:row[0].nation_id
	    			}))
				}).then(function(competition){
					competition_id = competition.insertId;
					return excute(mysql.format('INSERT INTO `transfermarkt_competition_competition` SET ?',{
						transfermarkt_competition_id:transfermarkt_competition_id,
						competition_id:competition_id
					}))
				}).catch(function(err){
					console.log(err);
					return Promise.resolve();
				})
			})
		} else {
			return Promise.resolve();
		}
	})
}
module.exports = Competition;