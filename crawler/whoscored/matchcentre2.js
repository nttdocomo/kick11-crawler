/**
 * @author nttdocomo
 */
var input_date = process.argv[2],
host = 'http://www.whoscored.com',
crawler = require('./matchesfeedconfig');
crawler.queueURL(host + input_date);
crawler.start();

/*excute(mysql.format('SELECT DISTINCT(match_id) FROM `whoscored_registration`')).then(function(row){
    var matches_id = _.map(row,function(item){
        return item.match_id
    });
    //console.log(mysql.format('SELECT id FROM `whoscored_matches` WHERE score1 IS NOT NULL AND score2 IS NOT NULL AND match_id NOT IN ?',[[matches_id]]))
    return excute(mysql.format('SELECT id FROM `whoscored_matches` WHERE score1 IS NOT NULL AND score2 IS NOT NULL AND match_id NOT IN ?',[[matches_id]]))
}).then(function(row){
    if(row.length){
        _.each(row,function(item){
            var path = '/MatchesFeed/'+item.id+'/MatchCentre2';
            excute(mysql.format('SELECT 1 FROM `url_status` WHERE url = ?',[path])).then(function(row){
                if(!row.length){
                    crawler.queueURL(host + '/MatchesFeed/'+item.id+'/MatchCentre2');
                }
            })
        })
        crawler.start();
    }
})*/
//http://www.whoscored.com/matchesfeed/?d=20141021
//http://www.whoscored.com/tournamentsfeed/9155/Fixtures/?d=2014W42&isAggregate=false