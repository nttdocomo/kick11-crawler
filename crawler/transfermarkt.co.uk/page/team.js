var trim = require('../utils').trim,
Team = function($){
	this.$ = $;
};
Team.prototype = {
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
	}
}
module.exports = Team;