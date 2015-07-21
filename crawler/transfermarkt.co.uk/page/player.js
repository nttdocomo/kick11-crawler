var trim = require('../utils').trim,
moment = require('moment'),
Player = function($){
	this.$ = $;
};
Player.prototype = {
	get_name:function(){
		var $ = this.$;
		return $('.spielername-profil').text().replace(/^\s+(.+?)\s+$/,'$1').replace(/[\n\t]/,'');
	},
	get_id:function(){
		return this.get_url().replace(/\S+?\/(\d{1,9})$/,'$1');
	},
	get_url:function(){
		var $ = this.$;
		return $('#submenue > li').eq(1).find('> a').attr('href');
	},
	get_height:function(){
		var $ = this.$;
		return $('.profilheader').eq(0).find('tr').eq(3).find('td').text().replace(/(\d{1})\,(\d{2})\s+m$/,'$1$2');
	},
	get_foot:function(){
		var $ = this.$;
		return $("th:contains('Foot:')" ).next().text();
	},
	get_position:function(){
		var $ = this.$;
		return $('.profilheader').eq(1).find('tr').eq(2).find('> td').text().replace(/^\s+(.+?)\s+$/,'$1') || $('.detailpositionen .auflistung tr').eq(0).find('a').text();
	},
	get_name_in_native_country:function(){
		var $ = this.$;
		return $( "th:contains('Name in home country:')" ).next().text()||'';
	},
	get_market_value:function(){
		var $ = this.$;
		return $('.marktwert > span > a').text();
	},
	get_nation_id:function(){
		var $ = this.$,
		nation_flag = $( "th:contains('Nationality:')" ).next().find('img');
		if(nation_flag.length){
			return nation_flag.attr('src').replace(/^\S+?\/(\d+?)(\/\S+)?\.png$/,'$1');
		} else {
			return 0;
		}
	},
	get_date_of_birth:function(){
		var $ = this.$,
		date_of_birth = $(".auflistung th:contains('Date of birth:')" ).next().text().replace(/^\s+(.+?)\s+$/,'$1').replace(/^(\w{3}\s{1}\d{1,2},\s{1}\d{4})\s{1}.+/,'$1');
		return date_of_birth ? moment(date_of_birth).format('YYYY-MM-DD'):'0000-00-00'
	}
}
module.exports = Player;