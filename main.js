var spawn = require('./spawn'),
livescores = spawn('node', ['crawler/whoscored/livescores.js','20150303'])
livescores.then(function(){
	return spawn('node', ['migrate/whoscored/migrate.js'])
})