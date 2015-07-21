/**
 * @author nttdocomo
 */
var trim = require('../utils').trim,
mysql = require('mysql'),
moment = require('moment'),
Player = require('../player/model'),
excute  = require('../../../promiseExcute'),
Team = function($){
	this.$ = $;
	this.is_club_team = !$('#verknupftevereine > img').attr('class');
    this.team_name = trim($('.spielername-profil').text().replace(/^\s+(.+?)\s+$/,'$1'));
    this.club_url = $('#submenue > li').eq(1).find('a').attr('href').replace(/(^\/\S+?\/startseite\/verein\/\d+?)(\/saison_id\/\d{4})?$/,'$1');
	this.team_id = this.club_url.replace(/^\/\S+?\/startseite\/verein\/(\d+?)(\/\S+)?$/,'$1');
    this.nation_id = $('[data-placeholder="Country"]').val();
    this.club_id = $('#verknupftevereine > img').attr('src') && $('#verknupftevereine > img').attr('src').replace(/^\S+?\/(\d{1,6})\w{0,1}\.png/,'$1');
}
Team.prototype = {
	is_club:function(){
		return this.is_club_team && this.team_id == this.club_id;
	},
	save_player:function(){
		var $=this.$;
		$('#yw1 > table > tbody > tr').each(function(index,el){
			var $el = $(el),
			nation_flag = $(el).children().eq(3).find('img');
			date_of_birth = $(el).children().eq(2).text().replace(/^\s+(.+?)\s+$/,'$1').replace(/^(\w{3}\s{1}\d{1,2},\s{1}\d{4})\s{1}.+/,'$1'),
			date_of_birth = date_of_birth ? moment(date_of_birth).format('YYYY-MM-DD'):'0000-00-00',
			nation_id = 0,
			id = $(el).find('> td > table > tr').eq(0).find('> td').eq(1).find('.spielprofil_tooltip').attr('id'),
			url = $(el).find('> td > table > tr').eq(0).find('> td').eq(1).find('.spielprofil_tooltip').attr('href'),
			name = $(el).find('> td > table > tr').eq(0).find('> td').eq(1).find('.spielprofil_tooltip').text(),
			position = $(el).find('> td > table > tr').eq(1).find('> td').text();
			if(nation_flag.length){
				nation_id = nation_flag.attr('src').replace(/^\S+?\/(\d+?)(\/\S+)?\.png$/,'$1');
			}
			if(id){
				var sql = mysql.format("INSERT INTO transfermarket_player (id,full_name,date_of_birth,position,nation_id,profile_uri) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id,full_name,date_of_birth,position,nation_id,profile_uri FROM transfermarket_player WHERE id = ?)", [[id,name,date_of_birth,position,nation_id,url],id]);
				excute(sql);
			}
		});
	},
	get_player_url:function(){
		var urls = [],$=this.$;
		$('#yw1 > table > tbody > tr').each(function(index,el){/* > tr*/
			var $el = $(el),
			url = $el.find('> td > table > tr').eq(0).find('> td').eq(1).find('.spielprofil_tooltip').attr('href');
			if(url){
				urls.push(url)
			}
		});
		return urls;
	},
	get_player_list:function(){
		var profile = [],$=this.$;
		$('#yw1 > table > tbody > tr').each(function(index,el){/* > tr*/
			var $el = $(el),
			date_of_birth = $(el).children().eq(2).text().replace(/^\s+(.+?)\s+$/,'$1').replace(/^(\w{3}\s{1}\d{1,2},\s{1}\d{4})\s{1}.+/,'$1'),
			date_of_birth = date_of_birth ? moment(date_of_birth).format('YYYY-MM-DD'):'0000-00-00',
			nation_id = $(el).children().eq(3).find('img').attr('src').replace(/^\S+?\/(\d+?)(\/\S+)?\.png$/,'$1'),
			id = $(el).find('> td > table > tr').eq(0).find('> td').eq(1).find('.spielprofil_tooltip').attr('id'),
			url = $(el).find('> td > table > tr').eq(0).find('> td').eq(1).find('.spielprofil_tooltip').attr('href'),
			name = $(el).find('> td > table > tr').eq(0).find('> td').eq(1).find('.spielprofil_tooltip').text(),
			position = $(el).find('> td > table > tr').eq(1).find('> td').text();
			if(id){
				profile.push([id,name,date_of_birth,position,nation_id,url])
			}
		});
		return profile;
	},
	get_team_players_id:function(){
		var ids = [],$=this.$;
		$('#yw1 >table > tbody > tr').each(function(index,element){
			var id = $(element).find('td').eq(1).find('.spielprofil_tooltip').attr('id');
			if(id){
				ids.push(id)
			}
		});
		return ids;
	},
	get_team_player:function(){
		var ids = [],$=this.$,me=this;
		$('td > table > tr').each(function(index,el){/* > tr*/
			var id = $(el).find(' > td').eq(1).find('.spielprofil_tooltip').attr('id');
			if(id){
				ids.push([me.team_id,id])
			}
		});
		return ids;
	},
	delete_team_player:function(connection){
		var players_id = this.get_team_players_id();
		if(players_id.lenght){
			//sql = mysql.format("SELETE player_id FROM transfermarket_team_player WHERE team_id = ? AND player_id NOT IN ?", [this.team_id, players_id]);
			sql = mysql.format("DELETE FROM transfermarket_team_player WHERE team_id = ? AND player_id NOT IN (?)", [this.team_id, players_id]);
			connection.query(sql, function(err) {
			    if (err) throw err;
			    connection.release();
			});
		} else {
			connection.release();
		}
	},
	save_team_player:function(){
		var teamplayers = this.get_team_player();
		teamplayers.forEach(function(teamplayer){
			var sql = mysql.format("INSERT INTO transfermarket_team_player (team_id, player_id) SELECT ? FROM dual WHERE NOT EXISTS(SELECT team_id,player_id FROM transfermarket_team_player WHERE team_id = ? AND player_id = ?)", [teamplayer,teamplayer[0],teamplayer[1]]);
			excute(sql);
		});
	},
	update_team_name:function(){
		if(this.team_name){
			var sql = mysql.format("UPDATE transfermarket_team SET ? WHERE id = ?", [{
				team_name:this.team_name
			},this.team_id]);
			excute(sql);
		}
	},
	save:function(){
		var sql = mysql.format("INSERT INTO transfermarket_team (team_name, id, order_by, type, owner_id, nation_id, profile_uri) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM transfermarket_team WHERE id = ?)", [[this.team_name,this.team_id,0,(this.is_club_team? 2:1),(this.is_club_team ? this.club_id : this.nation_id),this.nation_id, this.club_url],this.team_id]);
		return excute(sql);
	},
	update_owner_id:function(connection){
		var sql = mysql.format("UPDATE transfermarkt_team SET owner_id = ? WHERE id = ? AND owner_id != ?",[this.is_club_team ? this.club_id:this.nation_id,this.team_id,this.is_club_team ? this.club_id:this.nation_id]);
		connection.query(sql, function(err, result) {
		    if (err) throw err;
		    connection.release();
		});
	},
	update_nation_id:function(connection){
		var sql = mysql.format("UPDATE transfermarkt_team SET nation_id = ? WHERE id = ? AND nation_id != ?",[this.nation_id,this.team_id,this.nation_id]);
		connection.query(sql, function(err, result) {
		    if (err) throw err;
		    connection.release();
		});
	}
}
module.exports = Team;