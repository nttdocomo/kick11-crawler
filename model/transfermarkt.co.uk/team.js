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
	table:'transfermarket_team',
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
Team.table = 'transfermarket_team';
Team.get_team = function($){
	var is_club_team = !$('#verknupftevereine > img').attr('class'),
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
    team = new Team({
    	team_name:team_name,
    	club:is_club_team ? 1:0,
    	national:national,
    	id:team_id,
    	owner_id:is_club_team ? club_id:0,
    	nation_id:nation_id,
    	profile_uri:club_url,
    	foundation:foundation
    });
    return team.save();
};
Team.get_team_by_id = function(id){
    return excute(mysql.format('SELECT * FROM ?? WHERE id = ?',[this.table,id]));
};
module.exports = Team;