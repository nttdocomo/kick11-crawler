var cheerio = require('cheerio'),
StringDecoder = require('string_decoder').StringDecoder,
mysql = require('mysql'),
_ = require('underscore'),
Crawler = require("simplecrawler"),
excute = require('../../promiseExcute'),
Team = require('./page/team'),
Player = require('./page/player'),
difference = require('./utils').difference,
host = 'http://www.transfermarkt.co.uk',
fetchedUrls = [],
//crawler = new Crawler('www.transfermarkt.co.uk','/');
/*Crawler.crawl("http://www.transfermarkt.co.uk/", function(queueItem){
    console.log("Completed fetching resource:", queueItem.url);
});*/
//crawler.proxyHostname = 'http://127.0.0.1';
//crawler.proxyPort = 8888;
//crawler.discoverResources = false;
crawler = Crawler.crawl("http://www.transfermarkt.co.uk/");
/*crawler.maxConcurrency = 1;
crawler.interval = 600;
crawler.timeout = 30000;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.124 Safari/537.36';*/
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
	console.log("Completed fetching resource:", queueItem.path);
    var decoder = new StringDecoder('utf8'),
    next;
    if(/^\/\S+?\/startseite\/verein\/\d+?$/i.test(queueItem.path)){//competition
    	next = this.wait();
    	var team = new Team(cheerio.load(decoder.write(responseBuffer))),
    	id = team.get_id(),
    	foundation = team.get_foundation(),
    	address = team.get_address(),
    	data = {
    		team_name:team.get_name(),
    		nation_id:team.get_nation_id(),
    		profile_uri:team.get_url()
    	},
    	keys = ['team_name','nation_id','profile_uri','foundation'];
    	if(foundation){
    		data.foundation = foundation
    	}
    	if(address){
    		data.address = address
    	}
    	if(team.is_national()){
    		data.national = 1
    	} else {
    		data.national = 0
    	}
    	if(team.is_club()){
    		data.club = 1
    	} else {
    		data.club = 0
    	}
    	excute(mysql.format('SELECT * FROM `transfermarket_team` WHERE id = ?',[id])).then(function(row){
    		var diff;
    		if(row.length){
    			var result = _.pick(row[0], keys);
    			console.log('-----' + result.team_name + 'is in database;-----');
    			if(!_.isEqual(result,data)){
    				console.log('-----there is changes in ' + result.team_name + '-----');
    				diff = difference(result,data);
		    		return excute(mysql.format('UPDATE `transfermarket_team` SET ? WHERE id = ?',[diff,id]))
    			}
    		} else {
    			data.id = id;
		    	return excute(mysql.format('INSERT INTO `transfermarket_team` SET ?',data))
    		}
    	}).then(function(){
    		next();
    	})
    };
    if(/^\/\S+\/profil\/spieler\/\d{1,9}$/.test(queueItem.path)){//competition
    	next = this.wait();
    	var player = new Player(cheerio.load(decoder.write(responseBuffer))),
    	id = player.get_id(),
    	data = {
    		full_name:player.get_name(),
    		name_in_native_country:player.get_name_in_native_country(),
    		date_of_birth:player.get_nation_id(),
    		height:player.get_height(),
    		market_value:player.get_market_value(),
    		foot:player.get_foot(),
    		position:player.get_position(),
    		profile_uri:player.get_url(),
    		nation_id:player.get_nation_id()
    	},
    	keys = ['full_name','name_in_native_country','date_of_birth','height','market_value','foot','position','profile_uri','nation_id'];
    	excute(mysql.format('SELECT * FROM `transfermarket_player` WHERE id = ?',[id])).then(function(row){
    		if(row.length){
    			var result = _.pick(row[0], keys);
    			console.log('-----' + result.full_name + 'is in database;-----');
    			if(!_.isEqual(result,data)){
    				console.log('-----there is changes in ' + result.full_name + '-----');
    				diff = difference(result,data);
		    		return excute(mysql.format('UPDATE `transfermarket_player` SET ? WHERE id = ?',[diff,id]))
    			}
    		} else {
    			data.id = id;
    			return excute(mysql.format('INSERT INTO `transfermarket_player` SET ?',data))
    		}
    	}).then(function(){
    		next();
    	})
    };
    //合同
    if(/^\/\S+\/korrektur\/spieler\/\d{1,6}$/.test(queueItem.path)){
    	var $ = cheerio.load(decoder.write(responseBuffer));
		transfer_table = $('#transfers'),transfer_tbody = transfer_table.find('>tbody'),transfers_id = transfer_tbody.find(' > input[id$="trans_id"]'),
		next = this.wait();
		Promise.resolve().then(function(){
			return transfers_id.reduce(function(sequence, el){
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
				return sequence.then(function(){
					return excute(mysql.format("SELECT 1 FROM `transfermarket_transfer` WHERE id = ? LIMIT 1", [id]));
				}).then(function(result){
					var data = {
			    		'id':id,
			    		'season':season,
			    		'transfer_date':transfer_date,
			    		'transfer_sum':transfer_sum,
			    		'player_id':player_id,
			    		'loan':loan
			    	};
			    	if(contract_period){
			    		data.contract_period = contract_period;
			    		//transfers.push([id,season,transfer_date,transfer_sum,player_id,contract_period,loan]);
			    	}
					if(!result.length){
			    		return excute(mysql.format("INSERT INTO `transfermarket_transfer` SET ?", data));
				    } else {
				    	return excute(mysql.format("UPDATE `transfermarket_transfer` SET ? WHERE id = ?", [data,id]));
				    }
				})
			},Promise.resolve())
		}).then(function(){
			next();
		})
    };

    if(/^\/\S+\/transfers\/spieler\/\d{1,6}$/.test(queueItem.path)){
    	var $ = cheerio.load(decoder.write(responseBuffer)),
		transfer_table = $('.responsive-table > table'),transfer_tbody = transfer_table.find('>tbody'),transfers_tr = transfer_tbody.find(' > tr'),
		next = this.wait();
		Promise.resolve().then(function(){
			return transfers_tr.reduce(function(sequence, el){
				var $el = $(el);
				if(typeof($el.children().last().find('a').attr('href')) !== 'undefined'){
					var id = $el.children().last().find('a').attr('href').replace(/\S+?\/(\d+)$/,'$1'),
					releasing_team_id = $el.children().eq(2).find('a').attr('href').replace(/^\/\S+?\/transfers\/verein\/(\d+?)(\/\S+)?$/,'$1'),
					taking_team_id = $el.children().eq(5).find('a').attr('href').replace(/^\/\S+?\/transfers\/verein\/(\d+?)(\/\S+)?$/,'$1');
					return sequence.then(function(){
						return excute(mysql.format("SELECT 1 FROM `transfermarket_transfer` WHERE id = ? LIMIT 1", [id]));
					}).then(function(result){
						var data = {
				    		'releasing_team_id':releasing_team_id,
				    		'taking_team_id':taking_team_id
				    	};
						if(result.length){
					    	return excute(mysql.format("UPDATE `transfermarket_transfer` SET ? WHERE id = ?", [data,id]));
					    }
					})
				};
			})
		}).then(function(){
			next();
		})
    };
}).on('complete',function(){
	console.log('complete');
}).on('fetcherror',function(queueItem, response){
	console.log('fetcherror ' + queueItem.path)
	crawler.queueURL(host + queueItem.path);
}).on('fetchtimeout',function(queueItem, response){
	console.log('fetchtimeout ' + queueItem.path)
	crawler.queueURL(host + queueItem.path);
}).on('fetchclienterror',function(queueItem, errorData){
	console.log('fetchclienterror ' + queueItem.path)
	console.log(errorData)
	crawler.queueURL(host + queueItem.path);
}).addFetchCondition(function(parsedURL) {
	if(/^\/\S+?\/startseite\/verein\/\d+?$/i.test(parsedURL.path) || 
	/^\/\S+\/profil\/spieler\/\d{1,9}$/.test(parsedURL.path) || 
	/^\/\S+\/korrektur\/spieler\/\d{1,6}$/.test(parsedURL.path) || 
	/^\/\S+\/transfers\/spieler\/\d{1,6}$/.test(parsedURL.path)){
		if(fetchedUrls.indexOf(parsedURL.path) == -1){//if url not in fetchedUrl
			fetchedUrls.push(parsedURL.path)//push it into to avoid fetch twice
			return true
		}
		return false;
	}
	return false;
});

//crawler.queue.add('http', 'www.transfermarkt.co.uk', '20', '/');
//crawler.queueURL(host);
//crawler.start();