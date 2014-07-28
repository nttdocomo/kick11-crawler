/**
 * @author nttdocomo
 */
var trim = require('../utils').trim,connection = require("../db"), mysql = require('mysql'),Player = require('../player/model')
Competition = function($){
	this.$ = $;
	var flag_img = $('.profilheader').eq(0).find('tr').eq(0).find('td').find('img'),
	type_of_cup = $(".profilheader th:contains('Type of cup:')" ),
	league_ranking = $(".profilheader th:contains('League ranking:')" ),
	league_ranking_or_type_of_cup = trim((type_of_cup.length ? type_of_cup : league_ranking).next().text()),
	competition_url = $('#submenue > li').eq(1).find('a').attr('href'),
	competition_name = $('.spielername-profil').text().replace(/^\s+(.+?)\s+$/,'$1'),
	competition_id = competition_url.replace(/^\/\S+?\/([A-Z\d]{2,4})(\/\S+?)?(\/saison_id\/\d{4})?$/,'$1'),
	competition_level = /([\s\S]+)\s{1,}\-\s{1,}\w+/.test(league_ranking_or_type_of_cup) ? league_ranking_or_type_of_cup.replace(/([\s\S]+)\s{1,}\-\s{1,}\w+/,'$1') : league_ranking_or_type_of_cup;
	nation_name = flag_img.length ? flag_img.attr('title') : '';
	nation_id = flag_img.length ? flag_img.attr('src').replace(/^\S+?\/(\d+?)(\/\S+)?\.png$/,'$1') : 0;
	uri = competition_url.replace(/(\S+)\/\S+\/\d{4}$/,'$1');
	if (type_of_cup.length) {
		this.competition_type = 2;//杯赛
	}
	if (league_ranking.length) {
		this.competition_type = 1;//联赛
	}
	this.competition_name = competition_name;
	this.competition_id = competition_id;
	this.competition_level = competition_level;
	this.nation_id = nation_id;
	this.uri = uri;
}
Competition.prototype = {
	update_uri:function(pool){
		var sql = mysql.format("UPDATE transfermarkt_competition SET uri = ? WHERE competition_id = ? AND uri IS NULL", [this.uri,this.competition_id]);
		pool.getConnection(function(err, connection) {
			connection.query(sql, function(err) {
			    if (err) throw err;
			    connection.release();
			});
		});
	},
	update_nation_id:function(pool){
		var sql = mysql.format("UPDATE transfermarkt_competition SET nation_id = ? WHERE competition_id = ? AND nation_id = 0", [this.nation_id,this.competition_id]);
		pool.getConnection(function(err, connection) {
			connection.query(sql, function(err) {
			    if (err) throw err;
			    connection.release();
			});
		});
	},
	save:function(pool){
		var sql = mysql.format("INSERT INTO transfermarket_competition (competition_name,competition_id,competition_level,competition_type,nation_id,uri) SELECT ? FROM dual WHERE NOT EXISTS(SELECT competition_id FROM transfermarket_competition WHERE competition_id = ?)", [[this.competition_name,this.competition_id,this.competition_level,this.competition_type,this.nation_id,this.uri],this.competition_id]);
		pool.getConnection(function(err, connection) {
			connection.query(sql, function(err) {
			    if (err) throw err;
			    connection.release();
			});
		});
	},
	save_competition_team:function(pool){
		var me = this, teams_id = this.get_teams_id();
		teams_id.forEach(function(team_id){
			var sql = mysql.format("INSERT INTO transfermarket_competition_team (competition_id, team_id) SELECT ? FROM dual WHERE NOT EXISTS(SELECT competition_id,team_id FROM transfermarket_competition_team WHERE competition_id = ? AND team_id = ?)", [[me.competition_id,team_id],me.competition_id,team_id]);
			pool.getConnection(function(err, connection) {
				connection.query(sql, function(err) {
				    if (err) throw err;
				    connection.release();
				});
			});
		});
	},
	get_teams_id:function(){
		var ids = [],$=this.$;
		$('#yw1 >table > tbody > tr').each(function(index,element){
			var id = $(element).find('td').eq(1).find('a').attr('href').replace(/^\/\S+?\/startseite\/verein\/(\d+?)(\/\S+)?$/,'$1');
			if(id){
				ids.push(id)
			}
		});
		return ids;
	},
	get_teams_url:function(){
		var urls = [],$=this.$;
		$('#yw1 >table > tbody > tr').each(function(index,element){
			var url = $(element).find('td').eq(1).find('a').attr('href');
			if(url){
				urls.push(url)
			}
		});
		return urls;
	}
}
module.exports = Competition;