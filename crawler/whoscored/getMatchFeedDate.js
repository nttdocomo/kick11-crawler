var excute = require('../../promiseExcute'),
mysql = require('mysql'),
moment = require('moment-timezone');
excute(mysql.format('SELECT DISTINCT play_at FROM whoscored_match WHERE play_at < ? ORDER BY play_at ASC',[moment.utc().format('YYYY-MM-DD HH:mm')])).then(function(row){
  console.log(row[0].play_at)
  console.log(moment(row[0].play_at).subtract(1,'d').format('YYYYMMDD'))
  process.exit()
});
