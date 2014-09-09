/**
 * @author nttdocomo
 */
var http = require("http"), cheerio = require('cheerio'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),moment = require('moment'),
Transfer = require('./model'),Crawler = require("simplecrawler"),
Team = require('../team/model'),
pool  = require('../pool'),
excute  = require('../excute'),
update_player_id = process.argv[2],
host = 'http://www.transfermarkt.co.uk';
crawler = new Crawler('www.transfermarkt.co.uk');
crawler.maxConcurrency = 10;
crawler.interval = 300;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.customHeaders = {
	Cookie:'__qca=P0-912270038-1403184571295; 22ea10c3df12eecbacbf5e855c1fc2b3=4b2f77b042760e0b6c4403263173b81a02199e1da%3A4%3A%7Bi%3A0%3Bs%3A6%3A%22561326%22%3Bi%3A1%3Bs%3A9%3A%22nttdocomo%22%3Bi%3A2%3Bi%3A31536000%3Bi%3A3%3Ba%3A0%3A%7B%7D%7D; POPUPCHECK=1406040912765; PHPSESSID=kjuus3jlq0md5vhhq0hn2p7571; __utma=1.264986923.1403184483.1406010530.1406012399.139; __utmb=1.1.10.1406012399; __utmc=1; __utmz=1.1405646456.117.3.utmcsr=transfermarkt.com|utmccn=(referral)|utmcmd=referral|utmcct=/wettbewerbe/national/wettbewerbe/26'
}
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36';
var transfers = [],
update_transfers = [];
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8');
    if(/^\/\S+\/korrektur\/spieler\/\d{1,6}$/.test(queueItem.path)){
    	var $ = cheerio.load(decoder.write(responseBuffer));
		transfer_table = $('#transfers'),transfer_tbody = transfer_table.find('>tbody'),transfers_id = transfer_tbody.find(' > input[id$="trans_id"]');
		transfers_id.each(function(index,el){
			var $el = $(el),
			id = $el.val();
			//var sql = mysql.format("SELECT 1 FROM `transfermarket_transfer` WHERE id = ? LIMIT 1", [id]);
			var player_id = $('#submenue > li').eq(1).find('> a').attr('href').replace(/\S+?\/(\d{1,9})$/,'$1'),
			season = $el.next().children().eq(0).find('select').val(),
			transfer_date = $el.next().children().eq(3).find('input').val(),
			month = $el.next().children().eq(4).find('select').val(),
			loan = $el.next().children().eq(5).find('select').val(),
			transfer_sum = $el.next().children().eq(7).find('input').val(),
			contract_period = [$el.next().next().children().eq(0).find('input').eq(2).val(),$el.next().next().children().eq(0).find('input').eq(1).val(),$el.next().next().children().eq(0).find('input').eq(0).val()].join('-'),
			transfer_date = /\d{2}\.\d{2}\.\d{4}/.test(transfer_date) ? transfer_date.replace(/(\d{2})\.(\d{2})\.(\d{4})/,'$3-$2-$1') : moment(month + ' 1,' + season).format('YYYY-MM-DD'),
			transfer_sum = /\d/.test(transfer_sum) ? transfer_sum.replace(/\./g,'') : 0;
			contract_period = /\d{4}\-\d{2}\-\d{2}/.test(contract_period) ? contract_period : undefined;
			excute(mysql.format("SELECT 1 FROM `transfermarket_transfer` WHERE id = ? LIMIT 1", [id]),function(result){
				if(!result.length){
			    	if(contract_period){
			    		transfers.push([id,season,transfer_date,transfer_sum,player_id,contract_period,loan]);
			    	} else {
			    		transfers.push([id,season,transfer_date,transfer_sum,player_id,loan]);
			    	}
			    } else {
			    	update_transfers.push({
			    		'id':id,
			    		'season':season,
			    		'transfer_date':transfer_date,
			    		'transfer_sum':transfer_sum,
			    		'player_id':player_id,
			    		'contract_period':contract_period,
			    		'loan':loan
			    	})
			    }
			})
		})
	    var path = queueItem.path.replace('korrektur','transfers');
    	crawler.queueURL(host + path);
    };
    if(/^\/\S+\/transfers\/spieler\/\d{1,6}$/.test(queueItem.path)){
    	var $ = cheerio.load(decoder.write(responseBuffer)),
		transfer_table = $('.responsive-table > table'),transfer_tbody = transfer_table.find('>tbody'),transfers_tr = transfer_tbody.find(' > tr');
		transfers_tr.each(function(index,el){
			var $el = $(el);
			if(typeof($el.children().last().find('a').attr('href')) !== 'undefined'){
				var id = $el.children().last().find('a').attr('href').replace(/\S+?\/(\d+)$/,'$1'),
				releasing_team_url = $el.children().eq(2).find('a').attr('href'),
				releasing_team_id = $el.children().eq(2).find('a').attr('href').replace(/^\/\S+?\/transfers\/verein\/(\d+?)(\/\S+)?$/,'$1'),
				taking_team_url = $el.children().eq(5).find('a').attr('href'),
				taking_team_id = $el.children().eq(5).find('a').attr('href').replace(/^\/\S+?\/transfers\/verein\/(\d+?)(\/\S+)?$/,'$1');
				//var sql = mysql.format("SELECT 1 FROM `transfermarket_team` WHERE id = ? LIMIT 1", [releasing_team_id]);
				excute(mysql.format("SELECT 1 FROM `transfermarket_team` WHERE id = ? LIMIT 1", [releasing_team_id]),function(result){
					if(!result.length){
				    	crawler.queueURL(host + releasing_team_url.replace(/(^\/\S+?\/transfers\/verein\/\d+?)(\/saison_id\/\d{4})?$/,'$1').replace(/transfers/,'startseite'));
				    }
				});
				//sql = mysql.format("SELECT 1 FROM `transfermarket_team` WHERE id = ? LIMIT 1", [taking_team_id]);
				excute(mysql.format("SELECT 1 FROM `transfermarket_team` WHERE id = ? LIMIT 1", [taking_team_id]),function(result){
					if(!result.length){
				    	crawler.queueURL(host + taking_team_url.replace(/(^\/\S+?\/transfers\/verein\/\d+?)(\/saison_id\/\d{4})?$/,'$1').replace(/transfers/,'startseite'));
				    }
				});
		    	for (var i = 0, transfer, length = transfers.length; i < length; i++) {
					transfer = transfers[i];
					if (transfer[0] == id){
						transfer.push(releasing_team_id);
						transfer.push(taking_team_id);
						var sql = mysql.format("INSERT INTO transfermarket_transfer (id,season,transfer_date,transfer_sum,player_id,"+(transfer.length == 9 ? "contract_period,":"")+"loan,releasing_team_id,taking_team_id) VALUES ?", [[transfer]]);
						excute(sql);
					};
			    }
			    for (var i = 0, update_transfer, length = update_transfers.length; i < length; i++) {
					update_transfer = update_transfers[i];
					if (update_transfer.id == id){
						update_transfer.releasing_team_id = releasing_team_id;
						update_transfer.taking_team_id = taking_team_id;
						sql = mysql.format("UPDATE transfermarket_transfer SET ? WHERE id = ?", [update_transfer,update_transfer.id]);
						excute(sql);
					};
			    }
			};
		})
    };
    if(/^\/\S+?\/startseite\/verein\/\d+?$/i.test(queueItem.path)){//competition
    	var team = new Team(cheerio.load(decoder.write(responseBuffer)));
    	team.save()
    };
}).on('complete',function(){
	console.log('complete');
}).on('fetcherror',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
}).on('fetchclienterror',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
});
/*crawler.queueURL(host + '/cristiano-ronaldo/transfers/spieler/8198');
crawler.start();*/
if(update_player_id){
	excute("SELECT profile_uri FROM transfermarket_player WHERE id = " + update_player_id,function(result){
		if(result.length){
			crawler.queueURL(host + result[0].profile_uri.replace('profil','korrektur'));
			crawler.start();
		}
	});
} else {
	excute("SELECT profile_uri FROM transfermarket_player",function(result){
		for (var i = result.length - 1; i >= 0; i--) {
		    var path = result[i].profile_uri;
		    path = path.replace('profil','korrektur');
	    	crawler.queueURL(host + path);
	    };
	    crawler.start();
	});
}
