/**
 * @author nttdocomo
 */
var trim = require('../utils').trim,excute = require('../../../excute'), mysql = require('mysql'),moment = require('moment'),
Transfer = function($){
	var transfer_table = $('#transfers'),transfer_tbody = transfer_table.find('>tbody'),transfers_id = transfer_tbody.find(' > input[id$="trans_id"]');
	transfers_id.each(function(index,el){
		var $el = $(el),
		id = $el.val(),
		player_id = $('#submenue > li').eq(1).find('> a').attr('href').replace(/\S+?\/(\d{1,9})$/,'$1'),
		season = $el.next().children().eq(0).find('select').val(),
		transfer_date = $el.next().children().eq(3).find('input').val(),
		month = $el.next().children().eq(4).find('select').val(),
		transfer_sum = $el.next().children().eq(7).find('input').val(),
		contract_period = [$el.next().next().children().eq(0).find('input').eq(2).val(),$el.next().next().children().eq(0).find('input').eq(1).val(),$el.next().next().children().eq(0).find('input').eq(0).val()].join('-');
		contract_period = /\d{4}\-\d{2}\-\d{2}/.test(contract_period) ? contract_period : '0000-00-00';
		transfer_date = /\d{2}\.\d{2}\.\d{4}/.test(transfer_date) ? transfer_date.replace(/(\d{2})\.(\d{2})\.(\d{4})/,'$3-$2-$1') : moment(month + ' 1,' + season).format('YYYY-MM-DD');
		transfer_sum = /\d/.test(transfer_sum) ? transfer_sum.replace(/\./g,'') : 0;
		console.log([id,season,transfer_date,transfer_sum,player_id,contract_period]);
	})
}
Transfer.prototype = {
	update:function(pool){
		var sql = mysql.format("UPDATE transfermarkt_player SET ? WHERE id = ?", [{
			name_in_native_country:this.name_in_native_country,
			height:this.height,
			market_value:this.market_value,
			foot:this.foot
		},this.player_id]);
		excute(sql);
	},
	save:function(pool){
		var sql = mysql.format("INSERT INTO transfermarkt_player (full_name,name_in_native_country,date_of_birth,nation_id,height,market_value,foot,position,profile_uri,id) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM transfermarkt_player WHERE id = ?)", [[this.full_name,this.name_in_native_country,this.date_of_birth,this.nation_id,this.height,this.market_value,this.foot,this.position,this.profile_uri,this.player_id],this.player_id]);
		excute(sql);
	},
	update_date_of_birth:function(){
		var sql = mysql.format("UPDATE transfermarkt_player SET date_of_birth = ? WHERE date_of_birth = '0000-00-00' AND id = ?",[this.date_of_birth,this.player_id]);
		excute(sql);
	},
	update_nation_id:function(pool){
		var sql = mysql.format("UPDATE transfermarkt_player SET nation_id = ? WHERE nation_id = 0 AND id = ?",[this.nation_id,this.player_id]);
		excute(sql);
	}
}
module.exports = Transfer;