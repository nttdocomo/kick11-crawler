var team = require('./team'),
/*player = require('./player'),
team = require('./team'),
transfer = require('./transfer'),*/
migrate = function(){
	team.migrate().then(function(){
		console.log('migrate player');
	});
}
	/*player.migrate(function(){
		club.migrate(function(){
			team.migrate(function(){
				transfer.migrate(function(){})
			})
		})
	});*/
module.exports.migrate = migrate;
migrate();