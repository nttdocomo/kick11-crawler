var excute = require('../../promiseExcute'),
host = 'http://www.whoscored.com',
crawler = require('./matchesfeedconfig');
return excute('SELECT id FROM `whoscored_player` WHERE date_of_birth IS NULL').then(function(row){
    return row.reduce(function(sequence, player){
      crawler.queueURL(host + '/Players/'+player.id);
      return sequence;
    },Promise.resolve())
}).then(function(){
    crawler.start();
}).catch(function(err){
    console.log(err)
});
