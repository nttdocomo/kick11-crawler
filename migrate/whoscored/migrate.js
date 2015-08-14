var match = require('./match'),
migrate = function(){
	match.migrate().then(function(){
		return events.migrate()
	}).then(function(){
		process.exit()
	})/*.then(function(){
		return events.migrate()
	}).then(function(){
		console.log('migrate done')
	});*/
};
//module.exports.migrate = migrate;
migrate()