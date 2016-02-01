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
	height = $(".auflistung th:contains('Height:')" ).next().text().replace(/(\d{1})\,(\d{2})\s+m$/,'$1$2') || undefined,
	market_value = $('.marktwert > span > a').text(),
	foot = $("th:contains('Foot:')" ).next().text(),
	position = $('.profilheader').eq(1).find('tr').eq(2).find('> td').text().replace(/^\s+(.+?)\s+$/,'$1') || $('.detailpositionen .auflistung tr').eq(0).find('a').text(),
	profile_uri = url,
	nation_id = $("th:contains('Nationality:')").next().find('img'),
	nationality = _.map($(".auflistung th:contains('Nationality:')" ).next().find('img'),function(img,i){
		return $(img).attr('src').replace(/\S+\/(\d+)\.png.*$/,'$1')
	}),
	nation_name;
	date_of_birth = moment.utc(date_of_birth,'MMM D, YYYY').format('YYYY-MM-DD');
	if(nation_id.length){
		nation_id = nation_id.attr('src').replace(/^\S+?\/(\d+?)(\/\S+)?\.png.*$/,'$1');
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
  	return excute(mysql.format('SELECT player_id FROM `transfermarkt_player_player` WHERE transfermarkt_player_id = ? LIMIT 1',[id]))
  }).then(function(row){
  	if(!row.length){
  		return excute(mysql.format('INSERT INTO `player` SET ?',{
  			name:full_name,
  			date_of_birth:date_of_birth,
  			height:height,
  			foot:foot,
  		})).then(function(result){
  			return excute(mysql.format('INSERT INTO `transfermarkt_player_player` SET ?',{
  				transfermarkt_player_id:id,
  				player_id:result.insertId
  			})).then(function(){
  				return nationality.reduce(function(sequence, country_id){
  					return sequence.then(function(){
  						return excute(mysql.format('SELECT nation_id FROM `transfermarkt_nation_nation` WHERE transfermarkt_nation_id = ? LIMIT 1',[country_id])).then(function(nation){
  							return excute(mysql.format('SELECT 1 FROM `nationality` WHERE player_id = ? AND country_id = ? LIMIT 1',[result.insertId,nation[0].nation_id])).then(function(row){
  								if(!row.length){
  									return excute(mysql.format('INSERT INTO `nationality` SET ?',{
  										player_id:result.insertId,
  										country_id:nation[0].nation_id
  									}))
  								} else {
  									return Promise.resolve();
  								}
  							})
  						})
  					})
  				},Promise.resolve())
  			})
  		})
  	} else {
  		return excute(mysql.format('UPDATE `player` SET ? WHERE id = ?',[{
  			name:full_name,
  			date_of_birth:date_of_birth,
  			height:height,
  			foot:foot,
  		},row[0].player_id]))
  	}
  }).catch(function(err){
    console.log('player')
  	console.log(err);
  	return Promise.resolve();
  })
};
Player.get_player_by_team = function($){
  var table = $('#yw1 > table > tbody > tr > td:eq(0)'),
};
Player.get_team_by_id = function(id){
    return excute(mysql.format('SELECT * FROM ?? WHERE id = ?',[this.table,id]));
};
module.exports = Player;
