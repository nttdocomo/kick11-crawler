/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
add_or_update_event_standings = function(){
	return excute('SELECT id FROM `event`').then(function(events){
		return events.reduce(function(sequence,event){
			return sequence.then(function(){//查看event_standings里有没有对应的event_id的记录
				return excute(mysql.format('SELECT id FROM `event_standings` WHERE event_id = ? LIMIT 1',[event.id]));
			}).then(function(row){
				if(!row.length){
					return excute(mysql.format('INSERT INTO `event_standings` SET ?',{
						event_id:event.id
					})).then(function(result){
						return result.insertId
					})
				}
				return row[0].id;
			}).then(function(event_standing_id){
				console.log(event_standing_id)
				return excute(mysql.format('SELECT team_id FROM `event_team` WHERE event_id = ?',[event.id])).then(function(event_team){
					var event_standing_entries = [];
					return event_team.reduce(function(sequence,item){
						return sequence.then(function(){
							var pts = played = won = lost = drawn = goals_for = goals_against = 0,team_id = item.team_id;
							return excute(mysql.format('SELECT * FROM `match` WHERE round_id IN (SELECT id FROM `round` WHERE event_id = ?) AND (team1_id = ? OR team2_id = ?) AND score1 IS NOT NULL AND score2 IS NOT NULL',[event.id,item.team_id,item.team_id])).then(function(matches){
								return matches.reduce(function(sequence,match){
									played += 1;
									if(match.score1 == match.score2){
										pts += 1;
										drawn += 1;
									} else {
										console.log([match.score1,match.score2].join(':'))
										if(match.team1_id == item.team_id){
											goals_for += match.score1;
											goals_against += match.score2;
											if(match.score1 > match.score2){
												pts += 3;
												won += 1;
											}
											if(match.score1 < match.score2){
												lost += 1;
											}
										}
										if(match.team2_id == item.team_id){
											goals_for += match.score2;
											goals_against += match.score1;
											if(match.score1 > match.score2){
												lost += 1;
											}
											if(match.score1 < match.score2){
												pts += 3;
												won += 1;
											}
										}
									}
									return sequence;
								},Promise.resolve())
							}).then(function(){
								event_standing_entries.push({
									"event_standing_id":event_standing_id,
									"team_id":team_id,
									"pts":pts,
									"played":played,
									"won":won,
									"lost":lost,
									"drawn":drawn,
									"goals_for":goals_for,
									"goals_against":goals_against
								})
								return event_standing_entries
							})
						})
					},Promise.resolve())
				}).then(function(event_standing_entries){
					event_standing_entries.sort(function(a, b) {
						if(a.pts < b.pts){
							return 1;
						}
						if(a.pts == b.pts){
							if(a.goals_for - a.goals_against < b.goals_for - b.goals_against){
								return 1;
							}
							if(a.goals_for - a.goals_against == b.goals_for - b.goals_against){
								if(a.goals_for > b.goals_for){
									return 1;
								}
								return -1;
							}
							return -1;
						}
						return -1;
					});
					return event_standing_entries.reduce(function(sequence,event_standing_entry,i){
						event_standing_entry.pos = i+1;
						return sequence.then(function(){
							return excute(mysql.format('SELECT 1 FROM `event_standing_entries` WHERE event_standing_id = ? AND team_id = ? LIMIT 1',[event_standing_entry.event_standing_id,event_standing_entry.team_id]))
						}).then(function(row){
							if(!row.length){
								return excute(mysql.format('INSERT INTO `event_standing_entries` SET ?',event_standing_entry))
							} else {
								return excute(mysql.format('UPDATE `event_standing_entries` SET ? WHERE event_standing_id = ? AND team_id = ?',[event_standing_entry,event_standing_entry.event_standing_id,event_standing_entry.team_id]))
							}
						})
					},Promise.resolve())
				}).catch(function(err){
					console.log(err)
				})
			})
		},Promise.resolve())
	}).then(function(){
		process.exit()
	})
};
module.exports.add_or_update_event_standings = add_or_update_event_standings
add_or_update_event_standings()