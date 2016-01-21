/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
difference = require('../../utils').difference,
Model = require('../../model'),
Season = Model.extend({
    is_exist:function(){
		return excute(mysql.format('SELECT * FROM ?? WHERE id = ? LIMIT 1',[this.constructor.table,this.get('id')]))
    },
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
Season.excute = excute;
Season.table = 'transfermarkt_season';
Season.all = function(){
    return excute('SELECT * FROM '+this.table+' ORDER BY play_at ASC');
};
Season.get_season = function($){
	var year = $("select[name='saison_id']").find("option"),
	transfermarkt_season_season,
	seasons = [];
	year.each(function(i,el){
		seasons.push({
			title:$(this).text(),
			year:$(this).val()
		})
	})
	return seasons.reduce(function(sequence,season){
		return sequence.then(function(){
			var year = season.year,title = season.title;
			return excute(mysql.format('SELECT id FROM `transfermarkt_season` WHERE title = ? LIMIT 1',[title])).then(function(row){
				if(!row.length){
					return excute(mysql.format('INSERT INTO `transfermarkt_season` SET ?',{
						year : year,
						title : title
					})).then(function(result){
						var transfermarkt_season_id = result.insertId;
						return excute(mysql.format('INSERT INTO `season` SET ?',{
		    				year:year,
		    				title:title
		    			})).then(function(season){
							var season_id = season.insertId;
							transfermarkt_season_season = {
								transfermarkt_season_id:transfermarkt_season_id,
								season_id:season_id
							};
							return excute(mysql.format('INSERT INTO `transfermarkt_season_season` SET ?',transfermarkt_season_season))
						})
					}).then(function(){
						return transfermarkt_season_season
					})
				} else {
					return excute(mysql.format('SELECT * FROM `transfermarkt_season_season` WHERE transfermarkt_season_id = ? LIMIT 1',[row[0].id])).then(function(row){
						return {
							transfermarkt_season_id : row[0].transfermarkt_season_id,
							season_id : row[0].season_id
						}
					})
				}
			})
		})
	},Promise.resolve())
}
module.exports = Season;