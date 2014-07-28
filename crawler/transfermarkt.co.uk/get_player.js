/**
 * @author nttdocomo
 */
var http = require("http"), fs = require('fs'), cheerio = require('cheerio'), url = require('url'), path = require('path'),
connection = require("./db"), mysql = require('mysql'), mkdirs = require("./mkdirs"),utils = require("./utils");
get_players_page = function($){
	///var club_id = $('.headerfoto > img').attr('src').replace(/\S+?(\d{1,6}).jpg$/,'$1');
	$('.box').eq(2).find('table.items .spielprofil_tooltip').each(function(index,el){
		var uri = $(el).attr('href');
		utils.get_or_read_file(uri,function(data){
			console.log(uri);
			utils.get_players_profile(cheerio.load(data));
		});
	});
};
connection.query('SELECT uri FROM transfermarkt_club;', function(err, rows, fields) {
    if (err) throw err;
    var values = [];
    for(var k = 0; k < rows.length; k++){
    	// 创建一个请求
    	(function(i){
    		var request_url = rows[i].uri;
			utils.get_or_read_file(request_url,function(data){
				get_players_page(cheerio.load(data));
			});
    	})(k);
    }
});
