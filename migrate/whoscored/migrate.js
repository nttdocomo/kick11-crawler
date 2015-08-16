var match = require('./match'),
events = require('./event'),
migrate = function(){
	match.migrate().then(events.migrate).then(function(){
		process.exit()
	})/*.then(function(){
		return events.migrate()
	}).then(function(){
		console.log('migrate done')
	});*/
};
//module.exports.migrate = migrate;
migrate()