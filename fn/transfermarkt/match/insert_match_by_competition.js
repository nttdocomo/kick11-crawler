var cheerio = require('cheerio'),
mysql = require('mysql'),
excute = require('../../../promiseExcute'),
moment = require('moment-timezone'),
Crawler = require("simplecrawler"),
TransfermarktRound = require('../../../model/transfermarkt.co.uk/round'),
Round = require('../../../model/kick11/round'),
Match = require('../../../model/transfermarkt.co.uk/match'),
Team = require('../../../model/transfermarkt.co.uk/team'),
TransfermarktEvent = require('../../../model/transfermarkt.co.uk/event'),
Season = require('../../../model/transfermarkt.co.uk/season'),
trim = require('../../../utils').trim;
require('moment-timezone')
module.exports = function(content){
	var $ = cheerio.load(content),
	tables = $('#main .six.columns:not(.mobile-four)'),
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
		return excute(mysql.format('SELECT id FROM `transfermarkt_season` WHERE title = ?',[title])).then(function(row){
			if(!row.length){
    			return excute(mysql.format('INSERT INTO `transfermarkt_season` SET ?',{
    				year : year,
    				title : title
    			})).then(function(result){
    				transfermarkt_season_id = result.insertId;
    				return excute(mysql.format('INSERT INTO `season` SET ?',{
	    				year:year,
	    				title:title
	    			})).then(function(season){
						season_id = season.insertId;
						return excute(mysql.format('INSERT INTO `transfermarkt_season_season` SET ?',{
							transfermarkt_season_id:transfermarkt_season_id,
							season_id:season_id
						}))
					})
    			})
    		} else {
    			return excute(mysql.format('SELECT * FROM `transfermarkt_season_season` WHERE transfermarkt_season_id = ?',[row[0].id])).then(function(row){
    				transfermarkt_season_id = row[0].transfermarkt_season_id;
    				season_id = row[0].season_id;
    			})
    		}
		})
	}).then(function(){
		return excute(mysql.format('SELECT id FROM transfermarkt_event WHERE competition_id = ? AND season_id = ? LIMIT 1',[transfermarkt_competition_id,transfermarkt_season_id])).then(function(row){
			if(!row.length){
    			return excute(mysql.format('INSERT INTO `transfermarkt_event` SET ?',{
    				competition_id : transfermarkt_competition_id,
    				season_id : transfermarkt_season_id
    			})).then(function(result){
    				transfermarkt_event_id = result.insertId;
    				if(competition_id){
	    				return excute(mysql.format('INSERT INTO `event` SET ?',{
		    				competition_id:competition_id,
		    				season_id:season_id
		    			})).then(function(season){
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
			    				season_id:season_id
			    			})).then(function(season){
								event_id = season.insertId;
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
		})
	}).then(function(){
	    var matchdays = [];
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
					date = td.eq(0).find('a').text() || date,
					time = trim(td.eq(1).text()) || time,
					transfermarkt_team1_id = td.eq(2).find('a').attr('href').replace(/\S+?(\d{1,})\/\S+?$/,'$1'),
					transfermarkt_team2_id = td.eq(6).find('a').attr('href').replace(/\S+?(\d{1,})\/\S+?$/,'$1'),
					team1_name = td.eq(3).find('img').attr('title'),
					transfermarkt_match_id = td.eq(4).find('a').attr('href').replace(/\S+?(\d{1,})$/,'$1'),
					team2_name = td.eq(5).find('img').attr('title'),
					team2_id,
					team1_id,
					result = td.eq(4).find('a'),
					result = result.length ? result.text() : td.eq(4).text().replace(/\s?(\d{1,2}\:\d{1,2})\s?$/,"$1"),
					score1,
					score2,
					//play_at = moment([date,time].join(' ')).format('YYYY-MM-DD HH:mm:ss');
					play_at = moment.tz([date,time].join(' '), "MMM D, YYYY h:mm A", "Europe/Luxembourg").utc().format('YYYY-MM-DD HH:mm');
					if(/\d{1,2}\:\d{1,2}/.test(result)){
						result = result.split(':');
						score1 = result[0];
						score2 = result[1];
						console.log([round_id,play_at,team1_name,score1,score2,team2_name].join('<<<>>>'));
					};
					return sequence.then(function(){
						return excute(mysql.format('SELECT 1 FROM `transfermarkt_match` WHERE id = ? LIMIT 1',[transfermarkt_match_id])).then(function(match){
							if(!match.length){
								return excute(mysql.format('INSERT INTO `transfermarkt_match` SET ?',{
									id:transfermarkt_match_id,
									round_id:transfermarkt_round_id,
									team1_id:transfermarkt_team1_id,
									team2_id:transfermarkt_team2_id,
									score1 : score1,
									score2 : score1,
									play_at:play_at
								})).then(function(){
									return excute(mysql.format('SELECT * FROM `transfermarkt_team_team` WHERE transfermarkt_team_id = ? LIMIT 1',[transfermarkt_team1_id]))
								}).then(function(team1){
									team1_id=team1[0].id
									return excute(mysql.format('SELECT * FROM `transfermarkt_team_team` WHERE transfermarkt_team_id = ? LIMIT 1',[transfermarkt_team2_id]))
								}).then(function(team2){
									team2_id=team2[0].id
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
								return excute(mysql.format('SELECT 1 FROM `transfermarkt_match_match` WHERE transfermarkt_match_id = ?',[match[0].id])).then(function(row){
									if(!row.length){
										return excute(mysql.format('SELECT * FROM `transfermarkt_team_team` WHERE transfermarkt_team_id = ? LIMIT 1',[transfermarkt_team1_id])).then(function(team1){
											team1_id=team1[0].id
											return excute(mysql.format('SELECT * FROM `transfermarkt_team_team` WHERE transfermarkt_team_id = ? LIMIT 1',[transfermarkt_team2_id]))
										}).then(function(team2){
											team2_id=team2[0].id
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
										}).catch(function(err) {
											console.log(err)
											return Promise.resolve()
										})
									} else {
										return Promise.resolve()
									}
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
}