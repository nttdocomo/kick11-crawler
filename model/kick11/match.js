/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
difference = require('../../utils').difference,
Model = require('../../model'),
Match = Model.extend({
	tableName:'match',
    is_exist:function(){
		return excute(mysql.format('SELECT * FROM `matchs` WHERE team1_id = ? AND team2_id = ? AND play_at = ?',[this.get('team1_id'), this.get('team2_id'), this.get('play_at')]))
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
Match.excute = excute;
Match.table = 'match';
Match.all = function(){
	console.log(this.table)
    return excute('SELECT * FROM '+this.table+' ORDER BY play_at ASC');
};
Match.save_from_whoscored = function(data){
	var team1_id,team2_id,play_at = data.play_at;
	return excute(mysql.format('SELECT * FROM `match` WHERE team'))excute(mysql.format('SELECT team_id FROM whoscored_team_team WHERE whoscored_team_id = ? LIMIT 1',[data.team1_id]))
	.then(function(result){
		team1_id = result[0].team_id;
		return excute(mysql.format('SELECT team_id FROM whoscored_team_team WHERE whoscored_team_id = ? LIMIT 1',[data.team2_id]));
	}).then(function(result){
		team2_id = result[0].team_id
		var match = new Match({
			team1_id:team1_id,
			team2_id:team2_id,
			play_at:play_at,
			score1:data.score1,
			score2:data.score2
		})
		return match.save();
	}).then(function(){
		console.log('event_standings')
		return excute(mysql.format('SELECT event_id FROM `event_team` WHERE team_id = ? LIMIT 1',[team1_id])).then(function(event_team){
			if(event_team.length){
				var event_id = event_team[0].event_id;
				return excute(mysql.format('SELECT id FROM `event_standings` WHERE event_id = ? LIMIT 1',[event_id])).then(function(event_standings){
					if(!event_standings.length){
						return excute(mysql.format('INSERT INTO `event_standings` SET ?',{
							event_id:event.id
						})).then(function(result){
							return result.insertId
						})
					}
					return event_standings[0].id
				}).then(function(event_standing_id){
					return excute(mysql.format('SELECT id FROM `event_standing_entries` WHERE event_standing_id = ? AND team_id = ? LIMIT 1',[event_standing_id,team1_id])).then(function(event_standing_entries){
						var pts = played = won = lost = drawn = goals_for = goals_against = 0;
						return excute(mysql.format('SELECT * FROM `match` WHERE round_id IN (SELECT id FROM `round` WHERE event_id = ?) AND (team1_id = ? OR team2_id = ?) AND score1 IS NOT NULL AND score2 IS NOT NULL',[event_id,team1_id,team1_id])).then(function(matches){
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
							if(event_standing_entries.length){
								return excute(mysql.format('UPDATE `event_standing_entries` SET ? WHERE id = ?',[{
									"team_id":team_id,
									"pts":pts,
									"played":played,
									"won":won,
									"lost":lost,
									"drawn":drawn,
									"goals_for":goals_for,
									"goals_against":goals_against
								},event_standing_entries[0].id]))
							} else {
								return excute(mysql.format('INSERT INTO `event_standing_entries` SET ?',{
									"event_standing_id":event_standing_id,
									"team_id":team_id,
									"pts":pts,
									"played":played,
									"won":won,
									"lost":lost,
									"drawn":drawn,
									"goals_for":goals_for,
								}))
							}
						})
					})
				})
			}
		})
	}).then(function(row){
	})catch(function(err){
		console.log(err);
		return Promise.resolve()
	});
};
module.exports.model = Match;