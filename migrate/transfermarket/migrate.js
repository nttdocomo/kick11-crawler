var club = require('./club/club'),
/*player = require('./player'),
team = require('./team'),
transfer = require('./transfer'),*/
migrate = function(){
	club.migrate_clubs().then(function(){
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