var excute = require('../../promiseExcute'),
host = 'https://www.whoscored.com',
crawler = require('./matchesfeedconfig'),
method = process.argv[2],
player = {
	get_player_date_of_birth:function(){
		return excute('SELECT id FROM `whoscored_player` WHERE date_of_birth IS NULL').then(function(row){
		    return row.reduce(function(sequence, player){
		      crawler.queueURL(host + '/Players/'+player.id);
		      return sequence;
		    },Promise.resolve())
		});
	},
	get_player_not_in_player:function(){
		return excute('SELECT playerId FROM `whoscored_match_player_statistics` WHERE playerId NOT IN (SELECT id FROM `whoscored_player`)').then(function(row){
		    return row.reduce(function(sequence, player){
		      crawler.queueURL(host + '/Players/'+player.playerId);
		      return sequence;
		    },Promise.resolve())
		});
	}
};
player[method]().then(function(){
    crawler.start();
}).catch(function(err){
    console.log(err)
})
