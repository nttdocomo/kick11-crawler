var player = require('./player'),
player = require('./player'),
team = require('./team'),
match = require('./match'),
event = require('./event'),
migrate = function(){
	player.migrate(function(){
		team.migrate(function(){
			match.migrate(function(){
				event.migrate(function(){
					
				})
			})
		})
	});
}
module.exports.migrate = migrate;