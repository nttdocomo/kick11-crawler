var spawn = require('./spawn'),
livescores = spawn('node', ['crawler/whoscored/livescores.js','20150303']);
livescores.then(function(){
	console.log('migrate/whoscored/migrate.js')
	return spawn('node', ['migrate/whoscored/migrate.js']);
})