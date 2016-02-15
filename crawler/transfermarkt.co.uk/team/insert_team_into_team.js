/**
 * @author nttdocomo
 */
var http = require("http"), cheerio = require('cheerio'),connection = require("../db"), mysql = require('mysql'),StringDecoder = require('string_decoder').StringDecoder;
connection.connect();
connection.query("SELECT b.team_name,club.id,a.type FROM `club` JOIN `transfermarkt_team` a ON a.team_name = club.name JOIN `transfermarkt_team` b ON a.id = b.nation_id WHERE b.type = 2", function(err,rows) {
    if (err) throw err;
    for (var i = rows.length - 1; i >= 0; i--) {
    	connection.query("SELECT 1 FROM team WHERE team_name = ? LIMIT 2",[rows[i].team_name], (function(row) {
            return function(err,result) {
                if(!result.lenght){
                    var sql = mysql.format("INSERT INTO team(team_name,owner_id,type) VALUES ?",[[[row.team_name,row.id,row.type]]]);
                    console.log(sql)
                    connection.query(sql, function(err) {
                        if (err) throw err;
                    });
                }
            }
    	})(rows[i]))
    };
    
});