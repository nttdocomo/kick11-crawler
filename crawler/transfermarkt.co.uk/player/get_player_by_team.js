/**
 * @author nttdocomo
 */
var http = require("http"),
cheerio = require('cheerio'),
mysql = require('mysql'),
moment = require('moment'),
StringDecoder = require('string_decoder').StringDecoder,
connection = require("../../../db"),
Team = require('../team/model'),
Player = require('./model'),
excute  = require('../../../excute'),
Crawler = require("simplecrawler"),
host = 'http://www.transfermarkt.co.uk',
crawler = new Crawler('www.transfermarkt.co.uk');
crawler.maxConcurrency = 1;
crawler.interval = 500;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.customHeaders = {
	Cookie:'POPUPCHECK=1419841166132; __utma=1.692075973.1419751813.1419751813.1419754691.2; __utmb=1.3.10.1419754691; __utmc=1; __utmz=1.1419751813.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); TMSESSID=j0r48dldbo63rq7ohalpne9486; 22ea10c3df12eecbacbf5e855c1fc2b3=a8929849dfc1e9967b757427b43d5fdba30c368fa%3A4%3A%7Bi%3A0%3Bs%3A6%3A%22561326%22%3Bi%3A1%3Bs%3A9%3A%22nttdocomo%22%3Bi%3A2%3Bi%3A31536000%3Bi%3A3%3Ba%3A0%3A%7B%7D%7D; _mcreg=1'
};
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36';
var transfers = [],
update_transfers = [];
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8'),sql,
    $ = cheerio.load(decoder.write(responseBuffer));
    if(/^\/\S+?\/startseite\/verein\/\d+?(\/saison_id\/\d{4})?$/i.test(queueItem.path)){
    	var team_id = queueItem.path.replace(/^\/\S+?\/startseite\/verein\/(\d+?)(\/\S+)?$/,'$1'),team = new Team($);
    	excute(mysql.format("SELECT 1 FROM `transfermarket_team` WHERE id = ? AND team_ref_id IN (SELECT team_id FROM `events_teams`) LIMIT 1", [team_id]),function(result){
    		if(result.length){
			    //team.save_team_player(pool)
			    team.get_player_url().forEach(function(url){
			    	if(/^\/\S+\/nationalmannschaft\/spieler\/\d{1,9}$/.test(url)){
			    		url = url.replace(/nationalmannschaft/,'profil');
			    	}
		    		var id = url.replace(/^\/\S+\/profil\/spieler\/(\d{1,9})$/,'$1');
		    		excute(mysql.format("SELECT 1 FROM transfermarket_player WHERE id = ? limit 1;", [id]),function(rows){
		    			if(!rows.length){
					    	console.log(id + ' is not in the database, it will first get the player');
					    	crawler.queueURL(host + url);
					    } else {
					    	crawler.queueURL(host + url.replace('profil','korrektur'));
					    }
		    		});
			    });
    		}
    	})
		excute("SELECT 1 FROM `transfermarket_team` WHERE id = " + team_id + " LIMIT 1",function(result){
			if(result.length){
				team.update_team_name()
			} else {
				team.save();
			}
		})
    }
    if(/^\/\S+\/profil\/spieler\/\d{1,9}$/.test(queueItem.path)){
	    var player = new Player($),path = queueItem.path;
	    player.save();
	    console.log(player.player_id + ' get, start to get the transfer');
	    path = path.replace('profil','korrektur');
    	crawler.queueURL(host + path);
    }
    if(/^\/\S+\/korrektur\/spieler\/\d{1,9}$/.test(queueItem.path)){
    	var $ = cheerio.load(decoder.write(responseBuffer));
		transfer_table = $('#transfers'),transfer_tbody = transfer_table.find('>tbody'),transfers_id = transfer_tbody.find(' > input[id$="trans_id"]');
		transfers_id.each(function(index,el){
			var $el = $(el),
			id = $el.val();
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
			//var sql = mysql.format("SELECT 1 FROM `transfermarket_transfer` WHERE id = ? LIMIT 1", [id]);
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
    if(/^\/\S+\/transfers\/spieler\/\d{1,9}$/.test(queueItem.path)){
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
						excute(mysql.format("INSERT INTO transfermarket_transfer (id,season,transfer_date,transfer_sum,player_id,"+(transfer.length == 9 ? "contract_period,":"")+"loan,releasing_team_id,taking_team_id) VALUES ?", [[transfer]]));
					};
			    }
			    for (var i = 0, update_transfer, length = update_transfers.length; i < length; i++) {
					update_transfer = update_transfers[i];
					if (update_transfer.id == id){
						update_transfer.releasing_team_id = releasing_team_id;
						update_transfer.taking_team_id = taking_team_id;
						excute(mysql.format("UPDATE transfermarket_transfer SET ? WHERE id = ?", [update_transfer,update_transfer.id]));
					};
			    }
			};
		})
		console.log('Complete update the transfer of ' + queueItem.path.replace(/^\/\S+\/transfers\/spieler\/(\d{1,9})$/,'$1'));
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
excute("SELECT profile_uri FROM transfermarket_team WHERE team_ref_id IN (SELECT team_id FROM events_teams)", function(rows) {
    for (var i = rows.length - 1; i >= 0; i--) {
	    var path = rows[i].profile_uri;
	    path = path.replace(/(^\/\S+?\/startseite\/verein\/\d+?)(\/saison_id\/\d{4})?$/,'$1')
    	crawler.queueURL(host + path);
    };
    crawler.start();
});