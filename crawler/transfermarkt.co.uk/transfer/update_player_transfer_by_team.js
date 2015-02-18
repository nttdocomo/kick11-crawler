/**
 * @author nttdocomo
 */
var http = require("http"), cheerio = require('cheerio'),StringDecoder = require('string_decoder').StringDecoder,mysql = require('mysql'),moment = require('moment'),
Transfer = require('./model'),Player = require('../player/model'),Team = require('../team/model'),Crawler = require("simplecrawler"),
excute = require('../../../excute'),
update_team_id = process.argv[2],
migrate = require('../../../migrate/transfermarket/migrate').migrate,
host = 'http://www.transfermarkt.co.uk';
require('../array');
crawler = new Crawler('www.transfermarkt.co.uk');
crawler.maxConcurrency = 3;
crawler.interval = 300;
crawler.timeout = 5000;
crawler.discoverResources = false;
crawler.customHeaders = {
	Cookie:'22ea10c3df12eecbacbf5e855c1fc2b3=a8929849dfc1e9967b757427b43d5fdba30c368fa%3A4%3A%7Bi%3A0%3Bs%3A6%3A%22561326%22%3Bi%3A1%3Bs%3A9%3A%22nttdocomo%22%3Bi%3A2%3Bi%3A31536000%3Bi%3A3%3Ba%3A0%3A%7B%7D%7D; TMSESSID=jm7m7atphgpl1tov46dfo423d2; _mcreg=1; POPUPCHECK=1420683410764; __utmt=1; __utma=1.692075973.1419751813.1420597004.1420599060.7; __utmb=1.57.7.1420601652807; __utmc=1; __utmz=1.1419751813.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)'
}
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36';
var players = [],
transfers = [],
update_transfers = [];
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    var decoder = new StringDecoder('utf8'),
    $ = cheerio.load(decoder.write(responseBuffer)),
    transfer;
    ///transfers/letztetransfers/statistik
    if(/^\/transfers\/letztetransfers\/statistik(\?\S+?){0,1}$/.test(queueItem.path) || /^\/statistik\/letztetransfers(\?\S+?){0,1}$/.test(queueItem.path)){
		console.log(queueItem.path)
    	var $ = cheerio.load(decoder.write(responseBuffer));
    	if(queueItem.path == '/transfers/letztetransfers/statistik'){
    		$('#yw2 > .page:not(:nth-child(3)) > a').each(function(i,el){
    			var $el = $(el);
    			crawler.queueURL(host + $el.attr('href'));
    		})
    	}
    	$('a[class="spielprofil_tooltip"]').each(function(index,el){
    		var $el = $(el),id = $el.attr('id'),profile_uri = $el.attr('href');
    		if(id){
    			players.push({
    				id:id,
    				profile_uri:profile_uri
    			});
    		}
    	})
    };
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
    if(/^\/\S+\/korrektur\/spieler\/\d{1,6}$/.test(queueItem.path)){
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
    }
}).on('complete',function(){
	console.log('complete');
	if(players.length){
		var sql = mysql.format("SELECT id, profile_uri FROM transfermarket_player WHERE id IN ?", [[players.map(function(element){
			return element.id
		})]]);
		excute(sql, function(rows) {
		    players.forEach(function(player){
		    	var index = rows.findIndex(function(element, index, array){
		    		return element.id == player.id
		    	});
		    	if(index > -1){
		    		crawler.queueURL(host + player.profile_uri.replace('profil','korrektur'));
		    	} else {
		    		crawler.queueURL(host + player.profile_uri);
		    	}
		    })
		    crawler.start();
		    players = [];
		});
	} else {
		migrate()
	}
}).on('fetcherror',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
}).on('fetchclienterror',function(queueItem, response){
	crawler.queueURL(host + queueItem.path);
});
if(update_team_id){
	excute("SELECT profile_uri FROM transfermarket_team WHERE id = " + update_team_id,function(result){
		if(result.length){
			crawler.queueURL(host + result[0].profile_uri.replace('profil','korrektur'));
			crawler.start();
		}
	});
} else {
	excute("SELECT DISTINCT(transfermarket_player.profile_uri) FROM (SELECT transfer_ref_id FROM `transfermarket_transfer` WHERE player_id = 0)`no_player_transfers` JOIN `transfer` ON transfer.id = no_player_transfers.transfer_ref_id JOIN `player` ON transfer.player_id = player.id JOIN `transfermarket_player` ON transfermarket_player.player_ref_id = player.id",function(result){
		for (var i = result.length - 1; i >= 0; i--) {
		    var path = result[i].profile_uri;
		    path = path.replace('profil','korrektur');
	    	crawler.queueURL(host + path);
	    };
	    crawler.start();
	});
	/*excute("SELECT profile_uri FROM transfermarket_player",function(result){
		for (var i = result.length - 1; i >= 0; i--) {
		    var path = result[i].profile_uri;
		    path = path.replace('profil','korrektur');
	    	crawler.queueURL(host + path);
	    };
	    crawler.start();
	});*/
}
crawler.start();