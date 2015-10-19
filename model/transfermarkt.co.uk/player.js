/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
Model = require('../../model'),
moment = require('moment'),
_ = require('underscore'),
mysql = require('mysql'),
difference = require('../../crawler/transfermarkt.co.uk/utils').difference,
Kick11Player = require('../../model/transfermarkt.co.uk/player'),
Player = Model.extend({
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
Player.table = 'transfermarkt_player';
Player.get_player = function($){
	var url = $('#submenue > li').eq(1).find('> a').attr('href'),
	id = url.replace(/\S+?\/(\d{1,9})$/,'$1'),
	full_name = $('.spielername-profil').text().replace(/^\s+(.+?)\s+$/,'$1').replace(/[\n\t]/,''),
	name_in_native_country = $( "th:contains('Name in home country:')" ).next().text()||'',
	date_of_birth = $(".auflistung th:contains('Date of birth:')" ).next().text().replace(/^\s+(.+?)\s+$/,'$1').replace(/^(\w{3}\s{1}\d{1,2},\s{1}\d{4})\s{1}.+/,'$1'),
	height = $('.profilheader').eq(0).find('tr').eq(3).find('td').text().replace(/(\d{1})\,(\d{2})\s+m$/,'$1$2'),
	market_value = $('.marktwert > span > a').text(),
	foot = $("th:contains('Foot:')" ).next().text(),
	position = $('.profilheader').eq(1).find('tr').eq(2).find('> td').text().replace(/^\s+(.+?)\s+$/,'$1') || $('.detailpositionen .auflistung tr').eq(0).find('a').text(),
	profile_uri = url,
	nation_id = $("th:contains('Nationality:')").next().find('img'),
	nation_name;
	if(nation_id.length){
		nation_id = nation_id.attr('src').replace(/^\S+?\/(\d+?)(\/\S+)?\.png$/,'$1');
		nation_name = nation_id.attr('title');
	} else {
		nation_id = 0;
	}
	var player = new Player({
		id:id,
		full_name:full_name,
		name_in_native_country:name_in_native_country,
		date_of_birth:date_of_birth,
		height:height,
		market_value:market_value,
		foot:foot,
		position:position,
		profile_uri:profile_uri,
		nation_id:nation_id
	})
    return player.save().then(function(){
    	return excute('SELECT 1 FROM `transfermarkt_player_player` WHERE transfermarkt_player_id = ? LIMIT 1'[id])
    }).then(function(row){
    	if(!row.length){
    		return excute('INSERT INTO `player` SET ?',{
    			name:full_name,
    			date_of_birth:date_of_birth,
    			height:height,
    			foot:foot,
    		}).then(function(result){
    			return excute('INSER INTO `transfermarkt_player_player` SET ?',{
    				transfermarkt_player_id:id,
    				player_id:result.insertId
    			})
    		}).then(function(){
    			
    		})
    	} else {

    	}
    })
};
Player.get_team_by_id = function(id){
    return excute(mysql.format('SELECT * FROM ?? WHERE id = ?',[this.table,id]));
};
module.exports = Player;