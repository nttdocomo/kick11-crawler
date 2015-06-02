var spawn = require('./spawn'),
livescores = spawn('node', ['crawler/whoscored/livescores.js'])
livescores.then(function(){
	return spawn('node', ['migrate/whoscored/migrate.js'])
})