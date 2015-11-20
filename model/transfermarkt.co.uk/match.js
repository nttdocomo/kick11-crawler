/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
cheerio = require('cheerio'),
moment = require('moment-timezone'),
mysql = require('mysql'),
_ = require('underscore'),
difference = require('../../utils').difference,
Season = require('./season'),
Event = require('./event'),
Model = require('../../model'),
trim = require('../../utils').trim,
Match = Model.extend({
	tableName:'transfermarkt_match',
    is_exist:function(){
		return excute(mysql.format('SELECT * FROM ?? WHERE team1_id = ? AND team2_id = ? AND play_at = ?',[this.constructor.table,this.get('team1_id'), this.get('team2_id'), this.get('play_at')]))
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
Match.table = 'transfermarkt_match';
Match.all = function(){
	console.log(this.table)
    return excute('SELECT * FROM '+this.table+' ORDER BY play_at ASC');
};
Match.save_from_whoscored = function(data){
	var team1_id,team2_id,match,play_at = data.play_at;
	return excute(mysql.format('SELECT team_id FROM whoscored_team_team WHERE whoscored_team_id = ? LIMIT 1',[data.team1_id]))
	.then(function(result){
		if(result.length){
			team1_id = result[0].team_id;
			return excute(mysql.format('SELECT team_id FROM whoscored_team_team WHERE whoscored_team_id = ? LIMIT 1',[data.team2_id]));
		}
		return Promise.resolve();
	}).then(function(result){
		if(result && result.length){
			team2_id = result[0].team_id
			//console.log([team1_id,team2_id,play_at].join('--'))
			if(team1_id && team2_id){
				//console.log([team1_id,team2_id,play_at].join('--'))
				var match = new Match({
					team1_id:team1_id,
					team2_id:team2_id,
					play_at:play_at,
					score1:data.score1,
					score2:data.score2
				})
				return match.save();
			}
		}
		return Promise.resolve()
	});
};
Match.insert_match_by_competition = function($){
	var tables = $('#main .six.columns:not(.mobile-four)'),
	year = $("select[name='saison_id']").find("option:selected").val(),
	name = $("select[name='wettbewerb_select_breadcrumb']").find("option:selected").text(),
	nation_id = $("select[name='land_select_breadcrumb']").find("option:selected").val(),
	year = $("select[name='saison_id']").find("option:selected").val(),
	title = $("select[name='saison_id']").find("option:selected").text(),
	transfermarkt_competition,
	transfermarkt_competition_id,
	transfermarkt_season_id,
	transfermarkt_event_id,
	competition_id,
	season_id,
	event_id,
	code = $("select[name='wettbewerb_select_breadcrumb']").find("option:selected").val();
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
			transfermarkt_competition_id = row[0].id;
			return excute(mysql.format('SELECT * FROM `transfermarkt_competition_competition` WHERE transfermarkt_competition_id = ?',[row[0].id])).then(function(row){
				if(row.length){
					competition_id = row[0].competition_id;
				} else {
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
					})
				}
			})
		}
	}).then(function(row){
		return Season.get_season($)
	}).then(function(season){
		return Event.get_event(season,{
			transfermarkt_competition_id:transfermarkt_competition_id,
			competition_id:competition_id
		});
	}).then(function(event){
	    var matchdays = [],
	    transfermarkt_event_id = event.transfermarkt_event_id,
	    event_id = event.event_id;
	    tables.each(function(i,el){
	    	matchdays.push(el);
	    });
		return matchdays.reduce(function(sequence,el,index){
			var $el = $(el),
			matchday = $el.find('.table-header').text(),
			data_array = [],
			play_at,
			pos = index+1,
			transfermarkt_round_id,
			round_id,
			table = $el.find('> table'),
			tr = table.find('> tbody > tr:not(.bg_blau_20)');
			return sequence.then(function(){
				return excute(mysql.format('SELECT id FROM `transfermarkt_round` WHERE event_id = ? AND round = ? LIMIT 1',[transfermarkt_event_id,pos])).then(function(round){
					if(round.length){
						transfermarkt_round_id = round[0].id;
						return excute(mysql.format('SELECT * FROM `transfermarkt_round_round` WHERE transfermarkt_round_id = ?',[round[0].id])).then(function(row){
							round_id = row[0].round_id;
						})
					} else {
						return excute(mysql.format('INSERT INTO `transfermarkt_round` SET ?',{
							event_id:transfermarkt_event_id,
							name:matchday,
							round:pos
						})).then(function(round){
							transfermarkt_round_id = round.insertId;
							if(event_id){
								return excute(mysql.format('INSERT INTO `round` SET ?',{
									event_id:event_id,
									name:matchday,
									round:pos
								})).then(function(round){
									round_id = round.insertId;
									return excute(mysql.format('INSERT INTO `transfermarkt_round_round` SET ?',{
										transfermarkt_round_id:transfermarkt_round_id,
										round_id:round_id
									}))
								})
							}
						})
					}
				})
			}).then(function(){
				var trows = [],
				date,
				time;
				tr.each(function(i,el){
					trows.push(el);
				});
				return trows.reduce(function(sequence,row){
					var td = $(row).children(),
					transfermarkt_team1_id = td.eq(2).find('a').attr('href').replace(/\S+?\/(\d{1,})\/\S+?$/,'$1'),
					transfermarkt_team2_id = td.eq(6).find('a').attr('href').replace(/\S+?\/(\d{1,})\/\S+?$/,'$1'),
					team1_name = td.eq(3).find('img').attr('title'),
					transfermarkt_match_id = td.eq(4).find('a').attr('href').replace(/\S+?(\d{1,})$/,'$1'),
					team2_name = td.eq(5).find('img').attr('title'),
					team2_id,
					team1_id,
					result = td.eq(4).find('a'),
					result = result.length ? result.text() : td.eq(4).text().replace(/\s?(\d{1,2}\:\d{1,2})\s?$/,"$1"),
					score1,
					score2;
					date = td.eq(0).find('a').attr('href').replace(/\S+(\d{4}\-\d{2}\-\d{2})/,'$1') || date;
					time = trim(td.eq(1).text()) == "" ? time : trim(td.eq(1).text());
					//play_at = moment([date,time].join(' ')).format('YYYY-MM-DD HH:mm:ss');
					//console.log('-----'+(trim(td.eq(1).text()) == "")+'||||||'+[date,time,moment.tz([date,time].join(' '), "YYYY-MM-DD h:mm A", "Europe/London").utc().format('YYYY-MM-DD HH:mm')].join(' '))
					var play_at = moment.tz([date,time].join(' '), "YYYY-MM-DD h:mm A", "Europe/London").utc().format('YYYY-MM-DD HH:mm');
					//console.log([date,time,moment.tz([date,time].join(' '), "YYYY-MM-DD h:mm A", "Europe/London").utc().format('YYYY-MM-DD HH:mm')].join(' '))
					if(/\d{1,2}\:\d{1,2}/.test(result)){
						result = result.split(':');
						score1 = result[0];
						score2 = result[1];
						//console.log([round_id,play_at,transfermarkt_team1_id,team1_name,score1,score2,team2_name,transfermarkt_team2_id].join('<<<>>>'));
					};
					return sequence.then(function(){
						return excute(mysql.format('SELECT * FROM `transfermarkt_match_match` WHERE transfermarkt_match_id = ? LIMIT 1',[transfermarkt_match_id])).then(function(match){
							if(!match.length){
								return excute(mysql.format('INSERT INTO `transfermarkt_match` SET ?',{
									id:transfermarkt_match_id,
									round_id:transfermarkt_round_id,
									team1_id:transfermarkt_team1_id,
									team2_id:transfermarkt_team2_id,
									score1 : score1,
									score2 : score2,
									play_at:play_at
								})).then(function(){
									return excute(mysql.format('SELECT team_id FROM `transfermarkt_team_team` WHERE transfermarkt_team_id = ? LIMIT 1',[transfermarkt_team1_id]))
								}).then(function(team){
									//console.log('team1_id')
									//console.log(team[0])
									team1_id=team[0].team_id;
									return excute(mysql.format('SELECT team_id FROM `transfermarkt_team_team` WHERE transfermarkt_team_id = ? LIMIT 1',[transfermarkt_team2_id]))
								}).then(function(team){
									//console.log('team2_id')
									//console.log(team[0])
									team2_id=team[0].team_id;
									return excute(mysql.format('INSERT INTO `match` SET ?',{
										round_id:round_id,
										team1_id:team1_id,
										team2_id:team2_id,
										score1 : score1,
										score2 : score1,
										play_at:play_at
									}))
								}).then(function(match){
									return excute(mysql.format('INSERT INTO `transfermarkt_match_match` SET ?',{
										transfermarkt_match_id:transfermarkt_match_id,
										match_id:match.insertId
									}))
								})
							} else {
								return excute(mysql.format('UPDATE `transfermarkt_match` SET ? WHERE id = ?',[{
									round_id:transfermarkt_round_id,
									team1_id:transfermarkt_team1_id,
									team2_id:transfermarkt_team2_id,
									score1 : score1,
									score2 : score1,
									play_at:play_at
								},transfermarkt_match_id])).then(function(){
									return excute(mysql.format('SELECT team_id FROM `transfermarkt_team_team` WHERE transfermarkt_team_id = ? LIMIT 1',[transfermarkt_team1_id])).then(function(team){
										//console.log('update team1_id')
										//console.log(team[0])
										team1_id=team[0].team_id;
										return excute(mysql.format('SELECT team_id FROM `transfermarkt_team_team` WHERE transfermarkt_team_id = ? LIMIT 1',[transfermarkt_team2_id]))
									}).then(function(team){
										//console.log('update team2_id')
										//console.log(team[0])
										team2_id=team[0].team_id;
										return excute(mysql.format('UPDATE `match` SET ? WHERE id = ?',[{
											round_id:round_id,
											team1_id:team1_id,
											team2_id:team2_id,
											score1 : score1,
											score2 : score1,
											play_at:play_at
										},match[0].match_id]))
									}).catch(function(err) {
										console.log(err)
										return Promise.resolve()
									})
								})
								return Promise.resolve()
							}
						})//match.save()
					}).catch(function(err) {
						console.log(err)
						return Promise.resolve()
					})
				},Promise.resolve())
			});
		},Promise.resolve());
	}).catch(function(err){
		console.log(err);
		return Promise.resolve()
	})
};
module.exports = Match;