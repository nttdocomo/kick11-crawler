/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql');
excute('SELECT id FROM `event`').then(function(events){
	return events.reduce(function(sequence,event){
		return excute(mysql.format('SELECT 1 FROM `event_standings` WHERE event_id = ? LIMIT 1',[event.id])).then(function(row){
			if(!row.length){
				return excute(mysql.format('INSERT INTO `event_standings` SET ?',{
					event_id:event.id
				})).then(function(result){
					return result.insertId
				})
			}
			return row[0].id;
		}).then(function(event_standing_id){
			return excute('SELECT team_id FROM `event_team` WHERE event_id = ?',[event.id]).then(function(event_team){
				return event_team.reduce(function(sequence,item){
					return excute(mysql.format('SELECT 1 FROM `event_standing_entries` WHERE event_id = ? AND team_id = ? LIMIT 1',[event.id,item.team_id])).then(function(row){
						if(!row.length){
							
						}
					})
				},Promise.resolve())
			})
		})
	},Promise.resolve())
})