/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
BaseModel = require('../../model'),
moment = require('moment'),
_ = require('underscore'),
Season = require('./season'),
Event = require('./event'),
Competition = require('../kick11/competition'),
Event_Standing = require('../kick11/event_standings'),
Team = require('../kick11/team'),
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
Model.get_competition = function($){
	var name = $("select[name='wettbewerb_select_breadcrumb']").find("option:selected").text(),
	code = $("select[name='wettbewerb_select_breadcrumb']").find("option:selected").val(),
	nation_id = $("select[name='land_select_breadcrumb']").find("option:selected").val(),
	year = $("select[name='saison_id']").find("option:selected").val(),
	title = $("select[name='saison_id']").find("option:selected").text(),
	transfermarkt_competition_id,
	competition_id;
	return excute(mysql.format('SELECT id FROM `transfermarkt_competition` WHERE code = ? LIMIT 1',[code])).then(function(row){
		if(!row.length){
			return excute(mysql.format('INSERT INTO `transfermarkt_competition` SET ?',{
				name : name,
				code : code,
				nation_id:nation_id
			})).then(function(result){
				transfermarkt_competition_id = result.insertId;
				return Competition.get_competition_from_transfermarkt(name,code,nation_id).then(function(insertId){
					competition_id = insertId;
					return excute(mysql.format('INSERT INTO `transfermarkt_competition_competition` SET ?',{
						transfermarkt_competition_id:transfermarkt_competition_id,
						competition_id:competition_id
					}))
				})
			})
		} else {
			transfermarkt_competition_id = row[0].id;
			return Competition.get_competition_from_transfermarkt(name,code,nation_id).then(function(insertId){
				competition_id = insertId;
				return excute(mysql.format('SELECT 1 FROM `transfermarkt_competition_competition` WHERE transfermarkt_competition_id = ? LIMIT 1',[transfermarkt_competition_id]))
			}).then(function(row){
				if(!row.length){
					return excute(mysql.format('INSERT INTO `transfermarkt_competition_competition` SET ?',{
						transfermarkt_competition_id:transfermarkt_competition_id,
						competition_id:competition_id
					}))
				}
				return Promise.resolve();
			})
			return Promise.resolve();
		}
	}).then(function(){
		return Season.get_season($)
	}).then(function(){
		return Event.get_event(title,{
			transfermarkt_competition_id:transfermarkt_competition_id,
			competition_id:competition_id
		})
	}).then(function(event){
        var teams = _.map($('#yw1 .hide-for-small > a.vereinprofil_tooltip'),function(el,i){
        	return {
        		id:$(el).attr('id'),
        		team_name:$(el).text()
        	};
        })
        return teams.reduce(function(sequence,team){
        	var team_id,event_id;
        	return sequence.then(function(){
        		return excute(mysql.format('SELECT 1 FROM `transfermarkt_team` WHERE id = ? LIMIT 1',[team.id]));
        	}).then(function(row){
        		if(!row.length){
        			return excute(mysql.format('INSERT INTO `transfermarkt_team` SET ?',team))
        		}
        		return Promise.resolve();
        	}).then(function(){
        		return excute(mysql.format('SELECT team_id FROM `transfermarkt_team_team` WHERE transfermarkt_team_id = ? LIMIT 1',[team.id])).then(function(row){
        			if(!row.length){
				        return Team.save(team).then(function(id){
		    				team_id = id;
		    				return excute(mysql.format('INSERT INTO `transfermarkt_team_team` SET ?',{
		    					transfermarkt_team_id:team.id,
		    					team_id:team_id
		    				}))
				        })
			        }
			        team_id = row[0].team_id
			        return Promise.resolve();
    			});
        	}).then(function(){
        		return excute(mysql.format('SELECT event_id,team_id FROM `transfermarkt_event_team` WHERE event_id = ? AND team_id = ? LIMIT 1',[event.transfermarkt_event_id,team.id])).then(function(row){
	        		if(!row.length){
	        			return excute(mysql.format('INSERT INTO `transfermarkt_event_team` SET ?',{
	        				event_id:event.transfermarkt_event_id,
	        				team_id:team.id
	        			}))
	        		}
	        		return Promise.resolve();
	        	})
        	})/*.then(function(){
        		return excute(mysql.format('SELECT team_id FROM `transfermarkt_team_team` WHERE transfermarkt_team_id = ? LIMIT 1',[team]))
        	})*/.then(function(){
        		return excute(mysql.format('SELECT event_id FROM `transfermarkt_event_event` WHERE transfermarkt_event_id = ? LIMIT 1',[event.transfermarkt_event_id]))
        	}).then(function(row){
        		event_id = row[0].event_id;
        		return excute(mysql.format('SELECT 1 FROM `event_team` WHERE event_id = ? AND team_id = ? LIMIT 1',[event_id,team_id]))
        	}).then(function(row){
        		if(row.length){
	                return Promise.resolve();
	            }
        		return excute(mysql.format('INSERT INTO `event_team` SET ?',{
        			event_id:event_id,
        			team_id:team_id
        		}))
        	}).then(function(){
        		return Event_Standing.add_event_standings(event_id,team_id)
        	}).catch(function(err){
        		console.log(err)
        		return Promise.resolve();
        	})
        },Promise.resolve())
	}).catch(function(err){
		console.log(err)
		return Promise.resolve();
	})
}
module.exports = Model;
