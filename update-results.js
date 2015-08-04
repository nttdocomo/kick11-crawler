var spawn = require('./spawn'),
todayString = moment().tz('Europe/London').format('YYYYMMDD'),
livescores = spawn('node', ['crawler/whoscored/livescores.js',todayString]);
livescores.then(function(){
	return spawn('node', ['migrate/whoscored/migrate.js']);
})