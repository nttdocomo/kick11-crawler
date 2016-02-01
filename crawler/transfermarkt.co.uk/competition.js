var cheerio = require('cheerio'),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
_ = require('underscore'),
Crawler = require("simplecrawler"),
excute = require('../../promiseExcute'),
Team = require('../../model/transfermarkt.co.uk/team'),
Player = require('../../model/transfermarkt.co.uk/player'),
Nation = require('../../model/transfermarkt.co.uk/nation'),
Match = require('../../model/transfermarkt.co.uk/match'),
Competition = require('../../model/transfermarkt.co.uk/competition'),
Transfer = require('../../model/transfermarkt.co.uk/transfer'),
TeamPlayer = require('../../model/kick11/team_player'),
utils = require('../../utils'),
randomIntrvl = utils.randomIntrvl,
host = 'http://www.transfermarkt.co.uk',
fetchedUrls = [],
maxInterval = 20000,
minInterval = 2000,
input_competition = process.argv[2],
crawler = new Crawler("www.transfermarkt.co.uk", "/");
crawler.discoverResources = false;
/*crawler.useProxy = true;
crawler.proxyHostname = '127.0.0.1';
crawler.proxyPort = '11080';*/
crawler.maxConcurrency = 5;
crawler.interval = randomIntrvl();
crawler.listenerTTL = 100000;
//crawler.timeout = 30000;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.124 Safari/537.36';
crawler.customHeaders = {
    Host:'www.transfermarkt.co.uk',
    Cookie:'_ga=GA1.3.1581372142.1445312116; POPUPCHECK=1453456151155; TMSESSID=ionsbuocuq57lcq0uifs0ecth2; 22ea10c3df12eecbacbf5e855c1fc2b3=a8929849dfc1e9967b757427b43d5fdba30c368fa%3A4%3A%7Bi%3A0%3Bs%3A6%3A%22561326%22%3Bi%3A1%3Bs%3A9%3A%22nttdocomo%22%3Bi%3A2%3Bi%3A31536000%3Bi%3A3%3Ba%3A0%3A%7B%7D%7D; _mcreg=1; __utmt=1; __utma=1.1581372142.1445312116.1453434221.1453454132.88; __utmb=1.12.9.1453454906304; __utmc=1; __utmz=1.1445312116.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); wt3_eid=%3B670018217401655%7C2144531211600118019%232145345492300594021; wt3_sid=%3B670018217401655'
};
crawler/*.on('fetchstart',function(queueItem, requestOptions){
	console.log("Start fetching resource:", queueItem.path);
}).on('fetchheaders',function(queueItem, responseObject){
	var decoder = new StringDecoder('utf8');
	responseObject.on("data",function(chunk) {
		console.log(decoder.write(chunk))
	}).on('end',function(){

	})
	console.log("fetchheaders fetching resource:", queueItem.path);
}).on('fetchdataerror',function(queueItem, responseBuffer, response){
	console.log("fetchdataerror fetching resource:", queueItem.path);
}).on('fetchredirect',function(queueItem, responseBuffer, response){
	console.log("fetchredirect fetching resource:", queueItem.path);
}).on('gziperror',function(queueItem, responseBuffer, response){
	console.log("gziperror fetching resource:", queueItem.path);
})*/.on("fetchcomplete",function(queueItem, responseBuffer, response){
	console.log("Completed fetching resource:", queueItem.path);
  console.log(crawler.interval)
  var decoder = new StringDecoder('utf8'),$,
  next;
  if(/^\/\S+?\/startseite\/verein\/\d+?\/\S*$/i.test(queueItem.path)){//competition
      next = this.wait();
      $ = cheerio.load(decoder.write(responseBuffer));
      $('a.spielprofil_tooltip').each(function(i,el){
          crawler.queueURL(host + $(el).attr('href'));
      })
      Nation.get_nation_by_team($).then(function(){
          return Team.get_team($)
      }).then(function(){
          return Player.get_player_by_team($)
      }).then(function(){
          next();
      })
  };
  if(/^\/\S+\/profil\/spieler\/\d{1,9}$/.test(queueItem.path)){//competition
      next = this.wait();
      $ = cheerio.load(decoder.write(responseBuffer));
      var player_id = queueItem.path.replace(/^\/\S+\/profil\/spieler\/(\d{1,9})$/,'$1')
      //console.log(host + queueItem.path.replace(/^(\/\S+)\/profil\/spieler\/(\d{1,9})$/,'$1/korrektur/spieler/$2'))
      crawler.queueURL(host + queueItem.path.replace(/^(\/\S+)\/profil\/spieler\/(\d{1,9})$/,'$1/korrektur/spieler/$2'));
      Nation.get_nation_by_player_transfer($)/*.then(function(){
          Nation.get_nation_by_player_transfer(cheerio.load(decoder.write(responseBuffer)));
      })*/.then(function(){
          return Player.get_player($)
      }).then(function(){
          return Team.get_team_by_transfers($)
      }).then(function(){
          return Transfer.get_trasfer_from_transfers($)
      }).then(function(){
          return excute(mysql.format('SELECT player_id FROM `transfermarkt_player_player` WHERE transfermarkt_player_id = ? LIMIT 1;',[player_id]))
      }).then(function(row){
          if(row.length){
            return TeamPlayer.update_team_player_by_player_id(row[0].player_id)
          }
          return Promise.resolve();
      }).then(function(){
          next();
      }).catch(function(err){
          console.log(err);
      })
  };
  //合同
  if(/^\/\S+\/korrektur\/spieler\/\d{1,6}$/.test(queueItem.path)){
      next = this.wait();
      $ = cheerio.load(decoder.write(responseBuffer));
      Transfer.get_trasfer_from_korrektur($).then(function(){
          next();
      })
  };
  if(/^\/\S+\/gesamtspielplan\/wettbewerb\/[\w|\d]+?(\/saison_id\/\d{4})?$/.test(queueItem.path)){
      next = this.wait();
      $ = cheerio.load(decoder.write(responseBuffer));
      Nation.get_nation_by_competition($).then(function(){
          return Team.get_team_by_match_plan($)
      }).then(function(){
          //console.log('team ok')
          return Match.insert_match_by_competition($)
      }).then(function(){
          next()
      })
  };
  if(/^\/\S+\/startseite\/wettbewerb\/[\w|\d]+?(\/saison_id\/\d{4})?$/.test(queueItem.path)){
  	next = this.wait();
    $ = cheerio.load(decoder.write(responseBuffer));
    $('#yw1 td:first-child > [href*="startseite/verein"]').each(function(i,el){
        crawler.queueURL(host + $(el).attr('href'));
    })
    crawler.queueURL(host + queueItem.path.replace(/startseite/,'gesamtspielplan'));
  	Nation.get_nation_by_competition($).then(function(){
    	return Competition.get_competition($)
  	}).then(function(){
  		next()
  	})
  };

  /*if(/^\/\S+\/transfers\/spieler\/\d{1,6}$/.test(queueItem.path)){
	next = this.wait();
	Transfer.get_trasfer_from_transfers(cheerio.load(decoder.write(responseBuffer))).then(function(){
		next();
	})
  };*/
}).on('complete',function(){
	console.log('complete:'+crawler.queue.complete());
  console.log('errors:'+crawler.queue.errors());
	process.exit();
}).on('fetchstart',function(queueItem, requestOptions){
    crawler.interval = randomIntrvl();//everytime fetch complete, 
}).on('fetcherror',function(queueItem, response){
	console.log('fetcherror ' + queueItem.path)
	//crawler.queueURL(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
	console.log('fetchtimeout ' + queueItem.path)
	//crawler.queueURL(host + queueItem.path);
}).on('fetchclienterror',function(queueItem, errorData){
	console.log('fetchclienterror ' + queueItem.path)
	console.log(errorData)
	//crawler.queueURL(host + queueItem.path);
}).addFetchCondition(function(parsedURL) {
	if((/^\/\S+?\/startseite\/verein\/\d+?\/\S*$/i.test(parsedURL.path) ||
	/^\/\S+\/profil\/spieler\/\d{1,9}$/.test(parsedURL.path) ||
	/^\/\S+\/korrektur\/spieler\/\d{1,6}$/.test(parsedURL.path) ||
	/^\/\S+\/gesamtspielplan\/wettbewerb\/[\w|\d]+?(\/saison_id\/\d{4})*$/.test(parsedURL.path) ||
	/^\/\S+\/startseite\/wettbewerb\/[\w|\d]+?(\/saison_id\/\d{4})?$/i.test(parsedURL.path)/* ||
	/^\/\S+\/transfers\/spieler\/\d{1,6}$/.test(parsedURL.path)*/) && !/^\/end\-of\-career\/startseite\/verein\/\d+?$/.test(parsedURL.path) && !/^\/(unattached|unknown|\-tm)\/startseite\/verein\/\d+?$/.test(parsedURL.path)){
		if(fetchedUrls.indexOf(parsedURL.path) == -1){//if url not in fetchedUrl
			fetchedUrls.push(parsedURL.path)//push it into to avoid fetch twice
			return true
		}
		return false;
	}
	return false;
	///unknown/startseite/verein/75
});
if(input_competition){
  crawler.queueURL(host + '/premier-league/startseite/wettbewerb/'+input_competition);
} else {
  crawler.queueURL(host + '/premier-league/startseite/wettbewerb/CSL');
  //crawler.queueURL(host + '/joel-castro-pereira/profil/spieler/192611');
  //crawler.queueURL(host + '/alexis-sanchez/profil/spieler/40433');
}
//crawler.queueURL(host + '/premier-league/gesamtspielplan/wettbewerb/GB1');
crawler.start();
