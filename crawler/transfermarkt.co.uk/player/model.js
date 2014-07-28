/**
 * @author nttdocomo
 */
var trim = require('../utils').trim,connection = require("../db"), mysql = require('mysql'),moment = require('moment'),
Player = function($){
	var date_of_birth = $(".auflistung th:contains('Date of birth:')" ).next().text().replace(/^\s+(.+?)\s+$/,'$1').replace(/^(\w{3}\s{1}\d{1,2},\s{1}\d{4})\s{1}.+/,'$1'),
	nation_flag = $( "th:contains('Nationality:')" ).next().find('img');
	this.$ = $;
	this.full_name = $('.spielername-profil').text().replace(/^\s+(.+?)\s+$/,'$1').replace(/[\n\t]/,''),
	this.nationality = $('.profilheader').eq(0).find('tr').eq(2).find('td > img').attr('title'),
	this.position = $('.profilheader').eq(1).find('tr').eq(2).find('> td').text().replace(/^\s+(.+?)\s+$/,'$1') || $('.detailpositionen .auflistung tr').eq(0).find('a').text(),
	this.profile_uri = $('#submenue > li').eq(1).find('> a').attr('href'),
	this.date_of_birth = date_of_birth ? moment(date_of_birth).format('YYYY-MM-DD'):'0000-00-00',
	this.name_in_native_country = $( "th:contains('Name in home country:')" ).next().text()||'',
	this.foot = $( "th:contains('Foot:')" ).next().text(),
	this.height = $('.profilheader').eq(0).find('tr').eq(3).find('td').text().replace(/(\d{1})\,(\d{2})\s+m$/,'$1$2'),
	this.market_value = $('.marktwert > span > a').text(),
	this.player_id = this.profile_uri.replace(/\S+?\/(\d{1,9})$/,'$1');
	if(nation_flag.length){
		this.nation_id = $( "th:contains('Nationality:')" ).next().find('img').attr('src').replace(/^\S+?\/(\d+?)(\/\S+)?\.png$/,'$1');
	} else {
		this.nation_id = 0;
	}
}
Player.prototype = {
	update:function(pool){
		var sql = mysql.format("UPDATE transfermarket_player SET ? WHERE id = ?", [{
			name_in_native_country:this.name_in_native_country,
			date_of_birth:this.date_of_birth,
			height:this.height,
			market_value:this.market_value,
			foot:this.foot,
			nation_id:this.nation_id
		},this.player_id]);
		pool.getConnection(function(err, connection) {
			connection.query(sql, function(err) {
			    if (err) throw err;
			    connection.release();
			});
		});
	},
	save:function(pool){
		var sql = mysql.format("INSERT INTO transfermarket_player (full_name,name_in_native_country,date_of_birth,nation_id,height,market_value,foot,position,profile_uri,id) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM transfermarket_player WHERE id = ?)", [[this.full_name,this.name_in_native_country,this.date_of_birth,this.nation_id,this.height,this.market_value,this.foot,this.position,this.profile_uri,this.player_id],this.player_id]);
		pool.getConnection(function(err, connection) {
			connection.query(sql, function(err) {
			    if (err) throw err;
			    connection.release();
			});
		});
	},
	update_date_of_birth:function(connection){
		var sql = mysql.format("UPDATE transfermarkt_player SET date_of_birth = ? WHERE date_of_birth = '0000-00-00' AND id = ?",[this.date_of_birth,this.player_id]);
		connection.query(sql, function(err) {
		    if (err) throw err;
		    connection.release();
		});
	},
	update_nation_id:function(pool){
		var sql = mysql.format("UPDATE transfermarkt_player SET nation_id = ? WHERE nation_id = 0 AND id = ?",[this.nation_id,this.player_id]);
		pool.getConnection(function(err, connection) {
			connection.query(sql, function(err) {
			    if (err) throw err;
			    connection.release();
			});
		});
	}
}
module.exports = Player;