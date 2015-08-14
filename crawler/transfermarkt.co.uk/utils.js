/**
 * @author nttdocomo
 */
var http = require("http"),
fs = require('fs'),
moment = require('moment'),
path = require('path'),
connection = require("./db"),
mysql = require('mysql'),
mkdirs = require("./mkdirs"),
_ = require('underscore');
var get_or_read_file = function(request_url,callback){
	var options = {
		hostname:'www.transfermarkt.co.uk',
	    headers: {
	        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36'
	    },
	    agent:false
	},
	folder_path = request_url.replace(/^\//,''),
	file_path = folder_path + '/index.html',
	content = "";
	options.path = request_url;
	fs.readFile(file_path,{encoding:"utf8"},function(err, data){
    	if (err) {
        	var req = http.get(options, function(res) {
				// 设置显示编码
				res.setEncoding("utf8");
				// 数据是 chunked 发送，意思就是一段一段发送过来的
				// 我们使用 data 给他们串接起来
				res.on('data', function(chunk) {
					content += chunk;
				});
				// 响应完毕时间出发，输出 data
				res.on('end', function() {
					// dealData(data);
					var sql = mysql.format('DELETE FROM error_uri WHERE uri = ?',[request_url]);
					connection.query(sql, function(err) {
					    if (err) throw err;
					});
					callback(content);
					mkdirs(folder_path, 0776, function() {
						fs.open(file_path, 'w', 0666, function(e, fd) {
							if (e) {
								console.log('错误信息：' + e);
							} else {
								fs.write(fd, content, 0, 'utf8', function(e) {
									if (e) {
										console.log('出错信息：' + e);
									} else {
										fs.closeSync(fd);
									}
								});
							}
						});
					});
				});
			}).on('error', function(e) {
				var sql = mysql.format("INSERT INTO error_uri (uri) SELECT ? FROM dual WHERE NOT EXISTS(SELECT uri FROM error_uri WHERE uri = ?)", [request_url,request_url]);
				connection.query(sql, function(err) {
				    if (err) throw err;
				});
				console.log("Got error: " + e.message);
			});
			req.end();
		} else {
			callback(data);
		}
    });
},
get_players_profile = function($){
	var player = new Player($);
	console.log('get player ' + player.full_name);
	pool.getConnection(function(err, connection) {
    	player.save(connection);
	});
},
get_competition_profile = function($){
	var flag_img = $('.profilheader').eq(0).find('tr').eq(0).find('td').find('img'),
	league_ranking_or_type_of_cup = trim($('.profilheader').eq(0).find('tr').eq(0).find('td').text()),
	competition_url = $('#submenue > li').eq(1).find('a').attr('href'),
	competition_name = $('.spielername-profil').text().replace(/^\s+(.+?)\s+$/,'$1'),
	competition_id = competition_url.replace(/^\/\S+\/([A-Z\d]+?)\/\S+$/,'$1'),
	competition_type = /([\s\S]+)\s{1,}\-\s{1,}\w+/.test(league_ranking_or_type_of_cup) ? league_ranking_or_type_of_cup.replace(/([\s\S]+)\s{1,}\-\s{1,}\w+/,'$1') : league_ranking_or_type_of_cup;
	nation_name = flag_img.length ? flag_img.attr('title') : '';
	uri = competition_url.replace(/(\S+)\/\S+\/\d{4}$/,'$1');
	var sql = mysql.format("INSERT INTO transfermarkt_competition_type (type_name) SELECT ? FROM dual WHERE NOT EXISTS(SELECT type_name FROM transfermarkt_competition_type WHERE type_name = ?)", [[competition_type],competition_type]);
	connection.query(sql, function(err) {
	    if (err) throw err;
	});
	var sql = mysql.format("INSERT INTO transfermarkt_competition (competition_name,competition_id,competition_type,nation_id,uri) SELECT ? FROM dual WHERE NOT EXISTS(SELECT competition_id FROM transfermarkt_competition WHERE competition_id = ?)", [[competition_name,competition_id,competition_type,nation_id,uri],competition_id]);
	connection.query(sql, function(err) {
	    if (err) throw err;
	}); 
},
get_club_info = function($){
	var team = new Team($);
	console.log('get player ' + team.team_name);
	pool.getConnection(function(err, connection) {
    	team.save(connection);
	});
	/*var is_club_team = !$('#verknupftevereine > img').attr('class'),
    team_name = trim($('.spielername-profil').text().replace(/^\s+(.+?)\s+$/,'$1')),
    club_url = $('#submenue > li').eq(1).find('a').attr('href'),
	team_id = club_url.replace(/^\/\S+?\/startseite\/verein\/(\d+?)(\/\S+)?$/,'$1'),
	competition = trim($('.profilheader').eq(0).find('tr').eq(0).find('td').text()),
    nation_id = $('[data-placeholder="Country"]').val(),
    club_id = $('#verknupftevereine > img').attr('src') && $('#verknupftevereine > img').attr('src').replace(/^\S+?\/(\d{1,6})\w{0,1}\.png/,'$1'),
    is_club = is_club_team && team_id == club_id,
    sql;
	if(team_name){
		if(is_club){
			sql = mysql.format("INSERT INTO transfermarkt_club (club_name, id, uri, nation_id) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM transfermarkt_club WHERE id = ?)", [[team_name,club_id,club_url,nation_id],club_id]);
			connection.query(sql, function(err) {
			    if (err) throw err;
			});
		}
		sql = mysql.format("INSERT INTO transfermarkt_team (team_name, id, order_by, type, owner_id, profile_uri,competition) SELECT ? FROM dual WHERE NOT EXISTS(SELECT id FROM transfermarkt_team WHERE id = ?)", [[club_name,team_id,0,(is_club_team? 2:1),(is_club_team ? club_id : nation_id),uri,competition],club_id]);
		connection.query(sql, function(err) {
		    if (err) throw err;
		});
		var teamplayer = [];
		$('#yw1 >table > tbody > tr').each(function(index,element){
			var player_id = $(element).find('td').eq(1).find('.spielprofil_tooltip').attr('id');
			sql = mysql.format("INSERT INTO transfermarket_team_player (team_id, player_id) SELECT ? FROM dual WHERE NOT EXISTS(SELECT team_id,player_id FROM transfermarket_team_player WHERE team_id = ? AND player_id = ?)", [[club_id,player_id],club_id,player_id]);
			connection.query(sql, function(err) {
			    if (err) throw err;
			});
		})
	}*/
},
get_nation_info = function($){
	var nation_id = $('[data-placeholder="Country"]').val(),
	nation_name = $('[data-placeholder="Country"] :selected').text(),
	sql = mysql.format("INSERT INTO transfermarkt_nation (name, nation_id) SELECT ? FROM dual WHERE NOT EXISTS(SELECT nation_id FROM transfermarkt_nation WHERE nation_id = ?)", [[nation_name,nation_id],nation_id]);
	connection.query(sql, function(err) {
	    if (err) throw err;
	});
},
trim = function(text){
	return text.replace(/^\s+(.*?)\s+$/,'$1');
},
difference = function(template, override) {
    var ret = {};
    for (var name in template) {
        if (name in override) {
            if (_.isObject(override[name]) && !_.isArray(override[name])) {
                var diff = difference(template[name], override[name]);
                if (!_.isEmpty(diff)) {
                    ret[name] = diff;
                }
            } else if (!_.isEqual(template[name], override[name])) {
                ret[name] = override[name];
            }
        }
    }
    return ret;
};
module.exports.get_or_read_file = get_or_read_file;
module.exports.get_players_profile = get_players_profile;
module.exports.get_competition_profile = get_competition_profile;
module.exports.get_club_info = get_club_info;
module.exports.get_nation_info = get_nation_info;
module.exports.trim = trim;
module.exports.difference = difference;