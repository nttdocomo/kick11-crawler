/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
difference = require('../../utils').difference,
Model = require('../../model'),
Event = Model.extend({
    is_exist:function(){
		return excute(mysql.format('SELECT * FROM ?? WHERE season_id = ? AND competition_id = ?',[this.constructor.table,this.get('team_id'), this.get('player_id')]))
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
Event.excute = excute;
Event.table = 'transfermarkt_event';
Event.all = function(){
    return excute('SELECT * FROM '+this.table+' ORDER BY play_at ASC');
};
Event.get_event = function(title,competition){
	var transfermarkt_competition_id = competition.transfermarkt_competition_id,
	competition_id = competition.competition_id,
	transfermarkt_season_id,
	season_id,
	transfermarkt_event_id,
	event_id;
	return excute(mysql.format('SELECT * FROM `transfermarkt_season` WHERE title = ? LIMIT 1',[title])).then(function(transfermarkt_season){
		transfermarkt_season_id = transfermarkt_season[0].id;
		return excute(mysql.format('SELECT id FROM transfermarkt_event WHERE competition_id = ? AND season_id = ? LIMIT 1',[transfermarkt_competition_id,transfermarkt_season_id]))
	}).then(function(row){
		if(!row.length){
			return excute(mysql.format('INSERT INTO `transfermarkt_event` SET ?',{
				competition_id : transfermarkt_competition_id,
				season_id : transfermarkt_season_id
			})).then(function(result){
				transfermarkt_event_id = result.insertId;
				if(competition_id){
    				return excute(mysql.format('SELECT * FROM `seanson` WHERE title = ? LIMIT 1;',[title])).then(function(season){
    					season_id = season[0].id
    					return excute(mysql.format('INSERT INTO `event` SET ?',{
		    				competition_id:competition_id,
		    				season_id:season_id
		    			}))
    				}).then(function(season){
						event_id = season.insertId;
						return excute(mysql.format('INSERT INTO `transfermarkt_event_event` SET ?',{
							transfermarkt_event_id:transfermarkt_event_id,
							event_id:event_id
						}))
					})
				} else {
					return Promise.resolve();
				}
			})
		} else {
			transfermarkt_event_id = row[0].id;
			return excute(mysql.format('SELECT * FROM `transfermarkt_event_event` WHERE transfermarkt_event_id = ?',[transfermarkt_event_id])).then(function(row){
				if(row.length){
					event_id = row[0].event_id;
				} else {
    				if(competition_id){
	    				return excute(mysql.format('INSERT INTO `event` SET ?',{
		    				competition_id:competition_id,
		    				season_id:season.season_id
		    			})).then(function(event){
							event_id = event.insertId;
							return excute(mysql.format('INSERT INTO `transfermarkt_event_event` SET ?',{
								transfermarkt_event_id:transfermarkt_event_id,
								event_id:event_id
							}))
						})
    				} else {
    					return Promise.resolve();
    				}
				}
			})
		}
	}).then(function(){
		return {
			transfermarkt_event_id:transfermarkt_event_id,
			event_id:event_id
		}
	})
};
module.exports = Event;