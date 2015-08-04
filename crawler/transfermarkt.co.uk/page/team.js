var trim = require('../utils').trim,
moment = require('moment'),
Team = function($){
	this.$ = $;
};
Team.prototype = {
	is_national:function(){
		var $ = this.$,
		wettbewerb_select_breadcrumb = $("select[name='wettbewerb_select_breadcrumb']").find("option:selected").val(),
		verein_select_breadcrumb = $("select[name='verein_select_breadcrumb']").find("option:selected").val();
		return !wettbewerb_select_breadcrumb && verein_select_breadcrumb;
	},
	is_club:function(){
		var $ = this.$,
		wettbewerb_select_breadcrumb = $("select[name='wettbewerb_select_breadcrumb']").find("option:selected").val(),
		verein_select_breadcrumb = $("select[name='verein_select_breadcrumb']").find("option:selected").val();
		return wettbewerb_select_breadcrumb && verein_select_breadcrumb;
	},
	get_name:function(){
		var $ = this.$;
		return trim($('.spielername-profil').text().replace(/^\s+(.+?)\s+$/,'$1'));
	},
	get_id:function(){
		return this.get_url().replace(/^\/\S+?\/startseite\/verein\/(\d+?)(\/\S+)?$/,'$1');
	},
	get_url:function(){
		var $ = this.$;
		return $('#submenue > li').eq(1).find('a').attr('href').replace(/(^\/\S+?\/startseite\/verein\/\d+?)(\/saison_id\/\d{4})?$/,'$1');
	},
	get_nation_id:function(){
		var $ = this.$;
		return $('[data-placeholder="Country"]').val();
	},
	get_foundation:function(){
		var $ = this.$,
		foundation = $("th:contains('Foundation:')").next().text();
		if(foundation){
			foundation = moment(foundation, "MMM D, YYYY").format('YYYY-MM-DD');
		}//Jan 1, 1885
		return foundation;
	},
	get_address:function(){
		var $ = this.$,
		streetAddress = $('[itemprop="streetAddress"]').text(),
		postalCode = $('[itemprop="postalCode"]').text(),
		addressLocality = $('[itemprop="addressLocality"]').text(),
		address = '';
		if(streetAddress && postalCode && addressLocality){
			address = [streetAddress,postalCode,addressLocality].join(' ');
		}//Jan 1, 1885
		return address;
	}
}
module.exports = Team;