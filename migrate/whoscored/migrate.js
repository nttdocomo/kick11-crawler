var player = require('./player'),
player = require('./player'),
team = require('./team'),
match = require('./match'),
events = require('./event'),
migrate = function(){
	player.migrate().then(function(){
		return match.migrate()
	}).then(function(){
		return events.migrate()
	}).then(function(){
		console.log('migrate done')
	});
}
module.exports.migrate = migrate;
migrate()