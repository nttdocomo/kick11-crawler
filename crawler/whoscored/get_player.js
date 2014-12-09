/**
 * @author nttdocomo
 */
var excute = require('../../excute'), cheerio = require('cheerio'),Crawler = require("simplecrawler"),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),
input_player_id = process.argv[2],
host = 'http://www.whoscored.com',
crawler = new Crawler('www.whoscored.com');
crawler.maxConcurrency = 1;
crawler.interval = 300;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8'),
    $ = cheerio.load(decoder.write(responseBuffer)),
    player_profile,
    date_of_birth,
    id,
    player;
    console.log(queueItem.path)
    if(/^\/Players\/\d{1,6}$/.test(queueItem.path)){
        player_profile = $('#player-profile');
        id = queueItem.path.match(/(\d{1,6})/)[0];
        date_of_birth = player_profile.find("dt:contains('Age:')").next().find('i').text().replace(/(\d{2})\-(\d{2})\-(\d{4})/g,'$3-$2-$1');
        excute(mysql.format('SELECT 1 FROM whoscored_player WHERE id = ? LIMIT 1',[id]),function(rows){
            if(rows.length){
                excute(mysql.format('UPDATE whoscored_player SET ? WHERE id = ?',[{
                    date_of_birth:date_of_birth
                },id]))
            }
        })
    }
}).on('complete',function(){
    console.log('complete');
}).on('fetcherror',function(queueItem, response){
    console.log('fetcherror')
}).on('fetchtimeout',function(queueItem, response){
    crawler.queueURL(host + queueItem.path);
    console.log('fetchtimeout:' + queueItem.path)
}).on('fetchclienterror',function(queueItem, errorData){
    console.log('fetchclienterror')
});
excute('SELECT id FROM whoscored_player',function(rows){
    rows.forEach(function(row){
        crawler.queueURL(host + '/Players/'+row.id);
    })
    crawler.start();
})

//module.exports = get_player