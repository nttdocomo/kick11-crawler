var excute = require('../../promiseExcute'),
mysql = require('mysql');
return excute(mysql.format('SELECT date_of_birth FROM `whoscored_player` WHERE id = ? LIMIT 1',[6292])).then(function(row){
  if(row.length){
    if(row[0].date_of_birth === null){
    	console.log('null')
    }
  }
  return Promise.resolve();
});
