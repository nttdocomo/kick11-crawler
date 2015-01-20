var excute = require('../../excute'),asyncLoop = require('../../asyncLoop'),mysql = require('mysql'),_=require('underscore'),
columns = [],
whoscored_match_player_statistics = [],
match_player_statistics = [],
player_player = [],
team_team = [],
match_match = [],
init_func = [function(cb){
	excute('SHOW COLUMNS FROM match_player_statistics',function(result){
		columns = _.map(result,function(column){
			return column.Field;
		})
		var index = columns.indexOf('id');
		if (index > -1) {
		    columns.splice(index, 1);
		}
        cb()
	});
},function(cb){
	excute(mysql.format('SELECT ? FROM `whoscored_match_player_statistics`',[columns]).replace(/'/g,''),function(rows){
		whoscored_match_player_statistics = rows;
        cb()
	});
},function(cb){
	excute(mysql.format('SELECT ? FROM `match_player_statistics`',[columns]),function(rows){
		match_player_statistics = rows;
        cb()
	});
},function(cb){
	excute('SELECT whoscored_player_id,player_id FROM `whoscored_player_player`',function(rows){
		player_player = rows;
        cb()
	});
},function(cb){
	excute('SELECT whoscored_match_id,match_id FROM `whoscored_match_match`',function(rows){
		match_match = rows;
        cb()
	});
},function(cb){
	excute('SELECT whoscored_team_id,team_id FROM `whoscored_team_team`',function(rows){
		team_team = rows;
        cb()
	});
}],

migrate = function(){
	console.log('开始复制比赛统计');
	asyncLoop(init_func.length,function(loop){
	    var func = init_func[loop.iteration()];
	    func(function(){
	        loop.next();
	    })
	},function(){
		console.log('初始化结束');
		asyncLoop(whoscored_match_player_statistics.length,function(loop){
			var whoscored_match_player_statistic = whoscored_match_player_statistics[loop.iteration()],
			player = _.find(player_player,function(player){
				return player.whoscored_player_id == whoscored_match_player_statistic.playerId;
			}),
			team = _.find(team_team,function(team){
				return team.whoscored_team_id == whoscored_match_player_statistic.teamId;
			}),
			match = _.find(match_match,function(match){
				return match.whoscored_match_id == whoscored_match_player_statistic.matchId;
			}),player_id,team_id,match_id;
			/*if(player){
				console.log('get player')
			}
			if(team){
				console.log('get team')
			}
			if(match){
				console.log('get match')
			}*/
			if(player && team && match){
				player_id = player.player_id;
				team_id = team.team_id;
				match_id = match.match_id;
				exist_match_player_statistic = _.find(match_player_statistics,function(match_player_statistic){
					return match_player_statistic.playerId == player_id && match_player_statistic.teamId == team_id && match_player_statistic.matchId == match_id;
				});
				if(!exist_match_player_statistic){
					whoscored_match_player_statistic.playerId = player_id;
					whoscored_match_player_statistic.teamId = team_id;
					whoscored_match_player_statistic.matchId = match_id;
					excute(mysql.format('INSERT INTO `match_player_statistics` SET ?',whoscored_match_player_statistic),function(result){
						loop.next();
					});
				} else {
					loop.next();
				}
			} else {
				loop.next();
			}
		},function(){
			console.log('复制比赛统计完毕');
		})
	})
};
//module.exports.migrate = migrate;
migrate()