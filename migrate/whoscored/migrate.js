var player = require('./player'),
player = require('./player'),
team = require('./team'),
match = require('./match'),
events = require('./event'),
migrate = function(){
	player.migrate().then(function(){
		return team.migrate()
	}).then(function(){
		return match.migrate()
	}).then(function(){
		events.migrate(function(){
			
		})
	});
}
module.exports.migrate = migrate;