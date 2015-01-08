var excute = require('../../excute'),mysql = require('mysql'),player = require('./player'),club = require('./club'),team = require('./team'),transfer = require('./transfer'),
migrate = function(){
	player.migrate(function(){
		club.migrate(function(){
			team.migrate(function(){
				transfer.migrate(function(){})
			})
		})
	});
}
module.exports.migrate = migrate;