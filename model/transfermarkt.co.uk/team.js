/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
Model = require('../../model'),
moment = require('moment'),
_ = require('underscore'),
mysql = require('mysql'),
difference = require('../../crawler/transfermarkt.co.uk/utils').difference,
trim = require('../../crawler/transfermarkt.co.uk/utils').trim,
Team = Model.extend({
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
Team.table = 'transfermarkt_team';
Team.get_team = function($){
	var is_club = $('#wettbewerb_select_breadcrumb').val() ? 1:0,
  team_name = trim($('.spielername-profil').text().replace(/^\s+(.+?)\s+$/,'$1')),
  club_url = $('#submenue > li').eq(1).find('a').attr('href').replace(/(^\/\S+?\/startseite\/verein\/\d+?)(\/saison_id\/\d{4})?$/,'$1'),
	transfermarkt_team_id = club_url.replace(/^\/\S+?\/startseite\/verein\/(\d+?)(\/\S+)?$/,'$1'),
  nation_id = $('[data-placeholder="Country"]').val(),
  club_id = $('#verknupftevereine > img').attr('src') && $('#verknupftevereine > img').attr('src').replace(/^\S+?\/(\d+?)\.png.*/,'$1'),
  foundation = $("th:contains('Foundation:')").next().text(),
	streetAddress = $('[itemprop="streetAddress"]').text(),
	postalCode = $('[itemprop="postalCode"]').text(),
	addressLocality = $('[itemprop="addressLocality"]').text(),
	wettbewerb_select_breadcrumb = $("select[name='wettbewerb_select_breadcrumb']").find("option:selected").val(),
	verein_select_breadcrumb = $("select[name='verein_select_breadcrumb']").find("option:selected").val(),
	national = !wettbewerb_select_breadcrumb && verein_select_breadcrumb ? 1 : 0,
    team_id,
	address = '';
	if(streetAddress && postalCode && addressLocality){
		address = [streetAddress,postalCode,addressLocality].join(' ');
	}
    if(foundation){
		foundation = moment(foundation, "MMM D, YYYY").format('YYYY-MM-DD');
	}
    var team = new Team({
    	team_name:team_name,
    	club:is_club,
    	national:national,
    	id:transfermarkt_team_id,
    	owner_id:is_club ? club_id:0,
    	country_id:nation_id,
    	profile_uri:club_url,
    	foundation:foundation,
    	address:address
    });
    return team.save().then(function(){
    	return excute(mysql.format('SELECT team_id FROM `transfermarkt_team_team` WHERE transfermarkt_team_id = ? LIMIT 1',[transfermarkt_team_id]))
    }).then(function(row){
    	if(!row.length){
    		return excute(mysql.format('SELECT * FROM `transfermarkt_nation_nation` WHERE transfermarkt_nation_id = ? LIMIT 1',[nation_id])).then(function(nation){
                return excute(mysql.format('INSERT INTO `team` SET ?',{
                    name:team_name,
                    club:is_club,
                    national:national,
                    country_id:nation[0].nation_id
                }))
    		}).then(function(result){
                team_id = result.insertId;
                return excute(mysql.format('INSERT INTO `transfermarkt_team_team` SET ?',{
                    transfermarkt_team_id:transfermarkt_team_id,
                    team_id:team_id
                }))
            })
    	} else {
            team_id = row[0].team_id;
            return excute(mysql.format('SELECT * FROM `transfermarkt_nation_nation` WHERE transfermarkt_nation_id = ? LIMIT 1',[nation_id])).then(function(nation){
                return excute(mysql.format('UPDATE `team` SET ? WHERE id = ?',[{
                    name:team_name,
                    club:is_club,
                    national:national,
                    country_id:nation[0].nation_id
                },row[0].transfermarkt_team_id]))
            })
    	}
    }).then(function(){
        return excute(mysql.format('SELECT event_id FROM `transfermarkt_event_team` WHERE team_id = ? ',[transfermarkt_team_id]))
    }).then(function(row){
        return excute(mysql.format('SELECT event_id FROM `transfermarkt_event_event` WHERE transfermarkt_event_id = ? LIMIT 1',[row[0].event_id]))
    }).then(function(row){
        var event_id = row[0].event_id;
        return excute(mysql.format('SELECT 1 FROM `event_team` WHERE event_id = ? AND team_id = ? LIMIT 1',[event_id,team_id])).then(function(row){
            if(!row.length){
                return excute(mysql.format('INSERT INTO `event_team` SET ?',{
                    event_id:event_id,
                    team_id:team_id
                }))
            }
            return Promise.resolve();
        })
    }).catch(function(err){
        console.log(err)
        return Promise.resolve();
    });
};
Team.get_team_by_transfers = function($){
    var teams = _.map($('table:not([class]) > tbody > tr:not(:first-child) > td:nth-child(6) > a[title],table:not([class]) > tbody > tr:not(:first-child) > td:nth-child(10) > a[title]'),function(team,i){
        return team
    });
    //去掉重复的队伍
    teams = _.uniq(teams,function(item){
        return $(item).attr('href').replace(/^\/\S+?\/(\d+?)(\/\S+?\/\d{4})?$/,'$1');
    });
    return teams.reduce(function(sequence, el){
        var $el = $(el),
        name = $el.attr('title'),
        transfermarkt_team_id = $el.attr('href').replace(/^\/\S+?\/(\d+?)(\/\S+?\/\d{4})?$/,'$1');
        return sequence.then(function(){
            if(transfermarkt_team_id != '75'){
                return excute(mysql.format('SELECT 1 FROM `transfermarkt_team_team` WHERE transfermarkt_team_id = ? LIMIT 1',[transfermarkt_team_id])).then(function(row){
                    if(!row.length){
                        return excute(mysql.format('INSERT INTO `team` SET ?',{
                            name:name
                        })).then(function(result){
                            return excute(mysql.format('INSERT INTO `transfermarkt_team_team` SET ?',{
                                transfermarkt_team_id:transfermarkt_team_id,
                                team_id:result.insertId
                            }))
                        }).then(function(){
                            return excute(mysql.format('INSERT INTO `transfermarkt_team` SET ?',{
                                id:transfermarkt_team_id,
                                team_name:name
                            }))
                        })
                    } else {
                        return Promise.resolve();
                    }
                })
            } else {
                return Promise.resolve();
            }
        })
    },Promise.resolve())
}
Team.get_team_by_match_plan = function($){
    var teams = _.map($('table:not([class]) > tbody > tr:not(:first-child) > td:nth-child(3) > a[title],table:not([class]) > tbody > tr:not(:first-child) > td:nth-child(6) > a[title]'),function(team,i){
        return team;
    });
    teams = _.uniq(teams,function(item){
        return $(item).attr('href').replace(/^\/\S+?\/(\d+?)(\/\S+?\/\d{4})?$/,'$1');
    });
    return teams.reduce(function(sequence, el){
        var $el = $(el),
        name = $el.attr('title'),
        transfermarkt_team_id = $el.attr('href').replace(/^\/\S+?\/(\d+?)(\/\S+?\/\d{4})?$/,'$1');
        return sequence.then(function(){
            if(transfermarkt_team_id != '75'){
                return excute(mysql.format('SELECT 1 FROM `transfermarkt_team` WHERE id = ? LIMIT 1',[transfermarkt_team_id])).then(function(row){
                    if(!row.length){
                        return excute(mysql.format('INSERT INTO `transfermarkt_team` SET ?',{
                            id:transfermarkt_team_id,
                            team_name:name
                        })).then(function(){
                            return excute(mysql.format('INSERT INTO `team` SET ?',{
                                name:name
                            }))
                        }).then(function(result){
                            return excute(mysql.format('INSERT INTO `transfermarkt_team_team` SET ?',{
                                transfermarkt_team_id:transfermarkt_team_id,
                                team_id:result.insertId
                            }))
                        })
                    } else {
                        return Promise.resolve();
                    }
                })
            } else {
                return Promise.resolve();
            }
        })
    },Promise.resolve())
}
Team.get_team_by_id = function(id){
    return excute(mysql.format('SELECT * FROM ?? WHERE id = ?',[this.table,id]));
};
module.exports = Team;
