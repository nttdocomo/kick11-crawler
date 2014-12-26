/**
 * @author nttdocomo
 */
var fs = require('fs'),mysql = require('mysql'),
excute  = require('../transfermarkt.co.uk/excute'),StringDecoder = require('string_decoder').StringDecoder;
//csv_name = process.argv[2];
excute("CREATE TABLE IF NOT EXISTS `fm_player` (\
	`id` int(10) unsigned NOT NULL,\
	`name` varchar(50) NOT NULL,\
	`date_of_birth` date NOT NULL,\
	PRIMARY KEY (`id`)\
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;");
fs.readFile('../../data/fm/2015.csv',function(err,data){
	var decoder = new StringDecoder('utf8'),
	players = [],
	lines = decoder.write(data).split(/\r\n/);
	lines.forEach(function(line,i){
		if(i>0 && line){
			var result = line.split(/\;/),
			player_name = result[0].replace(/"/g,'').replace(/(\w+?),\s(\w+)/g,'$2 $1'),
			date_of_birth = result[2].replace(/"/g,'').replace(/(\d{2})\.\d{2}\.\d{4}/g,'$3-$2-$1');
			id = result[3].replace(/"/g,'');
			players.push([id,player_name,date_of_birth]);
		}
	});
	excute(mysql.format("INSERT INTO `fm_player`(id,name,date_of_birth) VALUES ?",[players]));
})