var Crawler = require("simplecrawler"),url = require('url'),
excute = require('../../excute'),
mysql = require('mysql'),
asyncLoop = require('../../asyncLoop')
StringDecoder = require('string_decoder').StringDecoder,
_ = require('underscore'),
host = 'http://www.whoscored.com',
columns = [],
statistics = [],
keys = [],
fields = {},
crawler = new Crawler('www.whoscored.com');
crawler.maxConcurrency = 2;
crawler.interval = 500;
crawler.timeout = 15000;
crawler.discoverResources = false;
crawler.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36';
crawler.customHeaders = {
    Host:'www.whoscored.com',
    Referer:'http://www.whoscored.com/LiveScores',
    'X-Requested-With':'XMLHttpRequest',
    Cookie:'__gads=ID=7400c9eb48861252:T=1407717687:S=ALNI_MZbNZufnguyMAdt6A2DXy8Hirg7oA; ebNewBandWidth_.www.whoscored.com=863%3A1408183698417; ui=nttdocomo:bjmU8NSBC0WzoKOkAO-9TQ:3619521175:SHKLWvTkwNCw4YKgZQA0cg8IkHCbOnpSkXIJdsjHZI8; ua=nttdocomo:bjmU8NSBC0WzoKOkAO-9TQ:3619521175:Cmahf0NIXa_v-sD8BkI3Tg9HVIkTt2NruY5jcRetDrM; mp_430958bdb5bff688df435b09202804d9_mixpanel=%7B%22distinct_id%22%3A%20%22148d138493249-047e04049-4748012e-1fa400-148d138493396%22%2C%22%24initial_referrer%22%3A%20%22http%3A%2F%2Fwww.whoscored.com%2FMatches%2F829543%2FLive%22%2C%22%24initial_referring_domain%22%3A%20%22www.whoscored.com%22%7D; _gat=1; _ga=GA1.2.458243098.1407717765'
};
crawler.on("fetchcomplete",function(queueItem, responseBuffer, response){
    //console.log(decoder.write(responseBuffer));
    var decoder = new StringDecoder('utf8');
    if(/^\/StatisticsFeed\/1\/GetMatchCentrePlayerStatistics.*?/.test(queueItem.path)){
		var unknow_columns = [];
    	var query = url.parse(queueItem.url,true).query;
    	var matchId = query.matchId;
    	var teamId = query.teamIds;
    	var matchCentrePlayerStatistics = JSON.parse(decoder.write(responseBuffer)),
    	playerTableStats = matchCentrePlayerStatistics.playerTableStats;
    	asyncLoop(playerTableStats.length,function(loop){
    		var playerTableStat = playerTableStats[loop.iteration()];
			var alter_sql = [];
    		//首先将值为null或者undefined的删除，因为无法判断值为数字还是字符串，如果表字段没有这个键，则无法创建列。
    		for (var i in playerTableStat) {
				if (playerTableStat[i] === null || playerTableStat[i] === undefined || playerTableStat[i] === '' || playerTableStat[i] === 0 || typeof(playerTableStat[i]) === 'object') {
					// test[i] === undefined is probably not very useful here
					delete playerTableStat[i];
				} else {
					if(columns.indexOf(i) < 0){
						unknow_columns.push(i)
					}
				}
			}
			if(unknow_columns.length){
				_.each(unknow_columns,function(column){
					if(typeof(playerTableStat[column]) == 'string'){
						alter_sql.push('ALTER TABLE whoscored_match_player_statistics ADD '+column+' varchar(30) DEFAULT NULL')
					}
					if(typeof(playerTableStat[column]) == 'number'){
						alter_sql.push('ALTER TABLE whoscored_match_player_statistics ADD '+column+' smallint DEFAULT 0')
					}
					if(typeof(playerTableStat[column]) == 'boolean'){
						alter_sql.push('ALTER TABLE whoscored_match_player_statistics ADD '+column+' boolean DEFAULT 0')
					}
				})
				asyncLoop(alter_sql.length, function(loop){
					var sql = alter_sql[loop.iteration()];
					excute(sql,function(){
						loop.next();
					})
				},function(){
					columns = _.union(columns,unknow_columns);
			    	var playerId = playerTableStat.playerId;
			    	if(!playerTableStat.teamId){
			    		playerTableStat.teamId = teamId
			    	}
			    	if(!playerTableStat.matchId){
			    		playerTableStat.matchId = matchId
			    	}
			    	var statistic = _.find(statistics,function(item){
			    		return item.playerId == playerId && item.teamId == teamId && item.matchId == matchId;
			    	})
			    	if(statistic){
			    		excute(mysql.format('UPDATE whoscored_match_player_statistics SET ? WHERE teamId = ? AND playerId = ? AND matchId = ?',[playerTableStat,teamId,playerId,matchId]),function(){
	    					loop.next()
	    				})
			    	} else {
			    		statistics.push({
			    			playerId:playerId,
			    			teamId:teamId,
			    			matchId:matchId
			    		});
			    		excute(mysql.format('INSERT INTO whoscored_match_player_statistics SET ?',playerTableStat),function(){
	    					loop.next()
	    				})
			    	}
				})
			} else{
		    	var playerId = playerTableStat.playerId;
		    	if(!playerTableStat.teamId){
		    		playerTableStat.teamId = teamId
		    	}
		    	if(!playerTableStat.matchId){
		    		playerTableStat.matchId = matchId
		    	}
		    	var statistic = _.find(statistics,function(item){
		    		return item.playerId == playerId && item.teamId == teamId && item.matchId == matchId;
		    	})
		    	if(statistic){
		    		excute(mysql.format('UPDATE whoscored_match_player_statistics SET ? WHERE teamId = ? AND playerId = ? AND matchId = ?',[playerTableStat,teamId,playerId,matchId]),function(){
    					loop.next()
    				})
		    	} else {
		    		statistics.push({
		    			playerId:playerId,
		    			teamId:teamId,
		    			matchId:matchId
		    		});
		    		excute(mysql.format('INSERT INTO whoscored_match_player_statistics SET ?',playerTableStat),function(){
    					loop.next()
    				})
		    	}
			}
    	},function(){
    		console.log('complete '+matchId+':' + teamId)
    	})
    	/*playerTableStats.forEach(function(playerTableStat){
    		_.each(playerTableStat,function(value,key){
    			if(!fields[key] && (typeof(value) == 'string' || typeof(value) == 'number' || typeof(value) == 'boolean')){
    				fields[key] = {
    					'type':typeof(value),
    					'value':value
    				}
    			}
    			if(fields[key]){
    				if(typeof(value) == 'string' && value.length > fields[key].value.length){
    					fields[key].value = value
    				}
    				if(typeof(value) == 'number' && value > fields[key].value){
    					fields[key].value = value
    				}
    			}
    		})
    		//keys = _.union(keys,_.keys(playerTableStat));
    	})*/
    	//console.log('OK')
    };
}).on('complete',function(){
    console.log('complete')
    //console.log(fields)
    //console.log(_.keys(fields))
    /*var create_sql = "CREATE TABLE IF NOT EXISTS `whoscored_match_player_statistics` (\
        `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
        `matchId` int(10) unsigned NOT NULL,";
    _.each(fields,function(item,key){
    	var row = '`'+key+'` ';
    	switch(item.type){
    		case 'number':
    			if(item.value <= 127){
    				row += 'tinyint DEFAULT 0,';
    			} else {
    				row += 'smallint DEFAULT 0,';
    			}
    			break;
    		case 'string':
    			row += 'varchar(30) DEFAULT NULL,';
    			break;
    		default:
    			row += 'boolean DEFAULT 0,';
    			break;
    	}
    	create_sql += row+'\n';
    });
    create_sql += 'PRIMARY KEY (`id`)\
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;'*/
	//console.log(create_sql)
}).on('fetcherror',function(queueItem, response){
    console.log('fetcherror')
}).on('fetchtimeout',function(queueItem, response){
    crawler.queueURL(host + queueItem.path);
    console.log('fetchtimeout:' + queueItem.path)
}).on('fetchclienterror',function(queueItem, errorData){
    console.log('fetchclienterror')
});
var init_func = [function(cb){
	excute('SHOW COLUMNS FROM whoscored_match_player_statistics',function(result){
		columns = _.map(result,function(column){
			return column.Field;
		})
		cb()
	});
},function(cb){
	excute('SELECT playerId,teamId,matchId FROM whoscored_match_player_statistics',function(result){
		statistics = result;
		cb()
	});
}];
asyncLoop(init_func.length,function(loop){
    var func = init_func[loop.iteration()];
    func(function(){
        loop.next();
    })
},function(){
    console.log('初始化结束......');
    excute('SELECT id,team1_id,team2_id FROM whoscored_matches WHERE id IN (SELECT whoscored_match_id FROM whoscored_match_match) AND id NOT IN (SELECT matchId FROM whoscored_match_player_statistics)',function(rows){
		if(rows.length){
			console.log('有'+rows.length+'场比赛要抓');
			rows.forEach(function(match,i){
				crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+match.team1_id+'&matchId='+match.id);
				crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=passing&statsAccumulationType=0&teamIds='+match.team1_id+'&matchId='+match.id);
				crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=defensive&statsAccumulationType=0&isCurrent=true&teamIds='+match.team1_id+'&matchId='+match.id);
				crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=offensive&statsAccumulationType=0&isCurrent=true&teamIds='+match.team1_id+'&matchId='+match.id);
				crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds='+match.team2_id+'&matchId='+match.id);
				crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=passing&statsAccumulationType=0&teamIds='+match.team2_id+'&matchId='+match.id);
				crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=defensive&statsAccumulationType=0&isCurrent=true&teamIds='+match.team2_id+'&matchId='+match.id);
				crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=offensive&statsAccumulationType=0&isCurrent=true&teamIds='+match.team2_id+'&matchId='+match.id);
				if(!i){
					crawler.start();
				}
			})
		} else {
			console.log('所有比赛已经抓取完毕');
		}
	})
})
/*crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds=16&matchId=829655');
crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=passing&statsAccumulationType=0&teamIds=16&matchId=829655');
crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=defensive&statsAccumulationType=0&isCurrent=true&teamIds=16&matchId=829655');
crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=offensive&statsAccumulationType=0&isCurrent=true&teamIds=16&matchId=829655');
crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&teamIds=26&matchId=829655');
crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=passing&statsAccumulationType=0&teamIds=26&matchId=829655');
crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=defensive&statsAccumulationType=0&isCurrent=true&teamIds=26&matchId=829655');
crawler.queueURL(host + '/StatisticsFeed/1/GetMatchCentrePlayerStatistics?category=offensive&statsAccumulationType=0&isCurrent=true&teamIds=26&matchId=829655');
crawler.start();*/
//一些协助查找错误的SQL：
//SELECT whoscored_match_player_statistics.matchId,whoscored_match_player_statistics.teamId,whoscored_match_player_statistics.playerId,whoscored_match_player_statistics.name,whoscored_player.name,whoscored_player.id FROM `whoscored_match_player_statistics` JOIN `whoscored_player` ON whoscored_match_player_statistics.playerId != whoscored_player.id AND whoscored_player.name = whoscored_match_player_statistics.name ORDER BY whoscored_match_player_statistics.playerId ASC//找出和player中名字一样，id不一样的记录