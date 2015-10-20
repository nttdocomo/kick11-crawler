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
	return Promise.resolve().then(function(){
		var $ = cheerio.load(content),
    	tables = $('#main .six.columns:not(.mobile-four)'),
    	year = $("select[name='saison_id']").find("option:selected").val(),
    	transfermarkt_competition_name = $("select[name='wettbewerb_select_breadcrumb']").find("option:selected").text(),
    	nation_id = $("select[name='land_select_breadcrumb']").find("option:selected").val()
    	season = $("select[name='saison_id']").val(),
    	transfermarkt_competition,
    	//transfermarkt_competition_url = $('#submenue > li').eq(1).find('a').attr('href'),
    	transfermarkt_competition_id = $("select[name='wettbewerb_select_breadcrumb']").find("option:selected").val();
    	console.log(year + season.replace(/\d{2}(\/\d{2})/,'$1'));
    	console.log(transfermarkt_competition_id);
    	return excute(mysql.format('SELECT 1 FROM `transfermarkt_competition` WHERE competition_id = ?',[transfermarkt_competition_id])).then(function(row){
    		if(row.length){
    			return row[0].id
    		} else {
    			return excute(mysql.format('INSERT INTO `transfermarkt_competition` SET ?',{
    				competition_name:transfermarkt_competition_name,
    				competition_id:transfermarkt_competition_id,
    				nation_id:nation_id
    			})).then(function(){
    				return excute(mysql.format('SELECT nation_id FROM `transfermarkt_nation_nation` WHERE transfermarkt_nation_id = ?',[nation_id])).then(function(row){
    					return excute(mysql.format('INSERT INTO `competition` SET ?',{
		    				name:transfermarkt_competition_name,
		    				code:transfermarkt_competition_id,
		    				nation_id:nation_id
		    			}))
    				})
    			})
    		}
    	}).then(function(){
    		excute(mysql.format('SELECT * FROM transfermarkt_competition WHERE competition_id = ? LIMIT 1',[transfermarkt_competition_id]))
    	}).then(function(rows){
    		transfermarkt_competition_id = rows[0].id;
    		competition_id = rows[0].competition_ref_id;
    		return excute(mysql.format('SELECT * FROM transfermarkt_season WHERE id = ? LIMIT 1',[year]))
    	}).then(function(season){
    		if(season.length){
    			return season[0].id
    		} else {
    			var season = new Season({
    				id:year
    			});
    			return season.save().then(function(result){
    				return result.insertId
    			});
    		}
    	}).then(function(season_id){
    		console.log('season_id:'+season_id)
    		return excute(mysql.format('SELECT * FROM transfermarkt_event WHERE season_id = ? AND competition_id = ? LIMIT 1',[season_id,transfermarkt_competition_id])).then(function(transfermarkt_event){
	    		if(transfermarkt_event.length){
	    			return transfermarkt_event[0].id
	    		} else {
	    			var transfermarkt_event = new TransfermarktEvent({
	    				season_id:season_id,
	    				competition_id:transfermarkt_competition_id
	    			});
	    			return transfermarkt_event.save().then(function(result){
	    				return result.insertId
	    			});
	    		}
	    	})
    	}).then(function(transfermarkt_event_id){
		    var event_id = transfermarkt_event_id,
		    matchdays = [];
		    tables.each(function(i,el){
		    	matchdays.push(el);
		    });
			return matchdays.reduce(function(sequence,el,index){
				var $el = $(el),
				matchday = $el.find('.table-header').text(),
				data_array = [],
				play_at,
				pos = index+1,
				table = $el.find('> table'),
				tr = table.find('> tbody > tr:not(.bg_blau_20)');
				return sequence.then(function(){
					return TransfermarktRound.get_round_id(event_id,pos);
				}).then(function(round_id){
    				console.log('round_id:'+round_id)
    				var trows = [],
					date,
					time;
					tr.each(function(i,el){
						trows.push(el);
					});
					return trows.reduce(function(sequence,row){
						var td = $(row).children();
						date = td.eq(0).find('a').text() || date;
						time = trim(td.eq(1).text()) || time;
						var transfermarkt_team1_id = td.eq(2).find('a').attr('href').replace(/\S+?(\d{1,})\/\S+?$/,'$1'),
						transfermarkt_team2_id = td.eq(6).find('a').attr('href').replace(/\S+?(\d{1,})\/\S+?$/,'$1'),
						team1_name = td.eq(3).find('img').attr('title'),
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
						var match = new Match({
							round_id:round_id,
							team1_id:transfermarkt_team1_id,
							team2_id:transfermarkt_team2_id,
							score1 : score1,
							score2 : score1,
							play_at:play_at
						});
						return sequence.then(function(){
							return match.save()
						}).then(function(){
							return Team.get_team_by_id(transfermarkt_team1_id)
						}).then(function(team){
							if(team.length){
								team1_id = team[0].ref_id
								return Team.get_team_by_id(transfermarkt_team2_id)
							}
							throw {
								'msg':'there is no team1:'+team1_id+'---'+team1_name
							};
						}).then(function(team){
							if(team.length){
								team2_id = team[0].ref_id;
								return excute(mysql.format('SELECT * FROM ?? WHERE year = ? LIMIT 1',['seasons',year]))
							}
							throw {
								'msg':'there is no team2:'+team2_id+'----'+team2_name
							};
						}).then(function(season){
							if(season.length){
								season = season[0];
								return excute(mysql.format('SELECT * FROM ?? WHERE competition_id = ? AND season_id = ? LIMIT 1',['events',competition_id,season.id]))
							}
						}).then(function(result){
							if(result.length){
								console.log('event:---'+result[0].id)
								return Round.get_round_id(result[0].id,pos)
							}
							throw {
								'msg':'there is no event!'
							};
						}).then(function(round_id){
							console.log('round_id=======' + round_id)
							return excute(mysql.format('SELECT * FROM ?? WHERE team1_id = ? AND team2_id = ? AND play_at = ?',['matchs',team1_id,team2_id,play_at])).then(function(result){
								if(result.length){
									match = new Match(result[0]);
									match.set('round_id',round_id);
									return match.save();
								}
								throw {
									'msg':'there is no event!'
								};
							})
						}).catch(function(err) {
							//console.log(err)
						})
					},Promise.resolve())
				});
			},Promise.resolve());
    	}).catch(function(err){
    		console.log(err);
    		next();
    	})
	})
}