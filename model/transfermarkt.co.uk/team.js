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
	var is_club = !$('#verknupftevereine > img').attr('class') ? 1:0,
    team_name = trim($('.spielername-profil').text().replace(/^\s+(.+?)\s+$/,'$1')),
    club_url = $('#submenue > li').eq(1).find('a').attr('href').replace(/(^\/\S+?\/startseite\/verein\/\d+?)(\/saison_id\/\d{4})?$/,'$1'),
	team_id = club_url.replace(/^\/\S+?\/startseite\/verein\/(\d+?)(\/\S+)?$/,'$1'),
    nation_id = $('[data-placeholder="Country"]').val(),
    club_id = $('#verknupftevereine > img').attr('src') && $('#verknupftevereine > img').attr('src').replace(/^\S+?\/(\d{1,6})\w{0,1}\.png/,'$1'),
    foundation = $("th:contains('Foundation:')").next().text(),
	streetAddress = $('[itemprop="streetAddress"]').text(),
	postalCode = $('[itemprop="postalCode"]').text(),
	addressLocality = $('[itemprop="addressLocality"]').text(),
	wettbewerb_select_breadcrumb = $("select[name='wettbewerb_select_breadcrumb']").find("option:selected").val(),
	verein_select_breadcrumb = $("select[name='verein_select_breadcrumb']").find("option:selected").val(),
	national = !wettbewerb_select_breadcrumb && verein_select_breadcrumb ? 1 : 0,
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
    	id:team_id,
    	owner_id:is_club ? club_id:0,
    	country_id:nation_id,
    	profile_uri:club_url,
    	foundation:foundation,
    	address:address
    });
    return team.save().then(function(){
    	return excute(mysql.format('SELECT 1 FROM `transfermarkt_team_team` WHERE transfermarkt_team_id = ? LIMIT 1',[team_id]))
    }).then(function(row){
    	if(!row.length){
    		return excute(mysql.format('SELECT * FROM `transfermarkt_nation_nation` WHERE transfermarkt_nation_id = ?',[nation_id])).then(function(nation){
                return excute(mysql.format('INSERT INTO `team` SET ?',{
                    name:team_name,
                    club:is_club,
                    national:national,
                    country_id:nation[0].nation_id
                }))
    		}).then(function(result){
                return excute(mysql.format('INSERT INTO `transfermarkt_team_team` SET ?',{
                    transfermarkt_team_id:team_id,
                    team_id:result.insertId
                }))
            })
    	} else {
            return excute(mysql.format('SELECT * FROM `transfermarkt_nation_nation` WHERE transfermarkt_nation_id = ?',[nation_id])).then(function(nation){
                return excute(mysql.format('UPDATE `team` SET ? WHERE id = ?',[{
                    name:team_name,
                    club:is_club,
                    national:national,
                    country_id:nation[0].nation_id
                },row[0].team_id]))
            })
    	}
    }).catch(function(err){
        console.log(err)
        return Promise.resolve();
    });
};
Team.get_team_by_transfers = function($){
    var transfer_table = $('.responsive-table > table'),transfer_tbody = transfer_table.find('>tbody'),transfers_tr = [];
    transfer_tbody.find(' > tr.zeile-transfer').each(function(i,tr){
        transfers_tr.push(tr);
    });
    return transfers_tr.reduce(function(sequence, el){
        var $el = $(el),
        releasing_team_nation_img = $el.children().eq(3).find('img').attr('src'),
        transfermarkt_releasing_team_nation_id = releasing_team_nation_img.replace(/\S+\/(\d+)\.png/,'$1'),
        releasing_team_nation_name = $el.children().eq(3).find('img').attr('title'),
        transfermarkt_releasing_team_id = $el.children().eq(5).find('a').attr('href').replace(/^\/\S+?\/transfers\/verein\/(\d+?)(\/\S+)?$/,'$1'),
        releasing_team_name = $el.children().eq(5).find('a').attr('title'),
        taking_team_nation_img = $el.children().eq(7).find('img').attr('src'),
        transfermarkt_taking_team_nation_id = releasing_team_nation_img.replace(/\S+\/(\d+)\.png/,'$1'),
        taking_team_nation_name = $el.children().eq(7).find('img').attr('title'),
        transfermarkt_taking_team_id = $el.children().eq(9).find('a').attr('href').replace(/^\/\S+?\/transfers\/verein\/(\d+?)(\/\S+)?$/,'$1'),
        taking_team_name = $el.children().eq(9).find('a').attr('title');
        /*var team = new Team({
            team_name:team_name,
            club:is_club,
            national:national,
            id:team_id,
            owner_id:is_club ? club_id:0,
            country_id:nation_id,
            profile_uri:club_url,
            foundation:foundation,
            address:address
        });*/
        return sequence.then(function(){
            return excute(mysql.format('SELECT * FROM `transfermarkt_team` WHERE id = ? LIMIT 1',[transfermarkt_releasing_team_id])).then(function(row){
                if(!row.length){
                    return excute(mysql.format('INSERT INTO `transfermarkt_team` SET ?',{
                        id:transfermarkt_releasing_team_id,
                        team_name:releasing_team_name,
                        country_id:transfermarkt_releasing_team_nation_id
                    })).then(function(){
                        return excute(mysql.format('SELECT * FROM `transfermarkt_nation_nation` WHERE transfermarkt_nation_id = ?',[transfermarkt_releasing_team_nation_id]))
                    }).then(function(nation){
                        return excute(mysql.format('INSERT INTO `team` SET ?',{
                            name:releasing_team_name,
                            country_id:nation.nation_id
                        }))
                    }).then(function(result){
                        return excute(mysql.format('INSERT INTO `transfermarkt_team_team` SET ?',{
                            transfermarkt_team_id:transfermarkt_releasing_team_id,
                            team_id:result.insertId
                        }))
                    })
                } else {
                    return Promise.resolve();
                }
            }).then(function(){
                return excute(mysql.format('SELECT 1 FROM `transfermarkt_team_team` WHERE transfermarkt_team_id = ? LIMIT 1',[transfermarkt_taking_team_id]))
            }).then(function(row){
                if(!row.length){
                    return excute(mysql.format('INSERT INTO `transfermarkt_team` SET ?',{
                        id:transfermarkt_taking_team_id,
                        team_name:taking_team_name,
                        country_id:transfermarkt_taking_team_nation_id
                    })).then(function(){
                        return excute(mysql.format('SELECT * FROM `transfermarkt_nation_nation` WHERE transfermarkt_nation_id = ?',[transfermarkt_taking_team_nation_id]))
                    }).then(function(nation){
                        return excute(mysql.format('INSERT INTO `team` SET ?',{
                            name:taking_team_name,
                            country_id:nation.nation_id
                        }))
                    }).then(function(result){
                        return excute(mysql.format('INSERT INTO `transfermarkt_team_team` SET ?',{
                            transfermarkt_team_id:transfermarkt_taking_team_id,
                            team_id:result.insertId
                        }))
                    })
                } else {
                    return Promise.resolve();
                }
            }).catch(function(err){
                console.log(err)
                return Promise.resolve();
            });
        }) 
    },Promise.resolve())
}
Team.get_team_by_match_plan = function($){
    $('table:not([class]) > tbody > tr:not(:first-child) > td:nth-child(3),table:not([class]) > tbody > tr:not(:first-child) > td:nth-child(6)')
}
Team.get_team_by_id = function(id){
    return excute(mysql.format('SELECT * FROM ?? WHERE id = ?',[this.table,id]));
};
module.exports = Team;