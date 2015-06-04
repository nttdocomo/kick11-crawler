var excute = require('../../excute'),
mysql = require('mysql'),
_ = require('underscore'),
get_team = function(whoscored_match_event,cb){
	return excute(mysql.format('SELECT team_id FROM whoscored_team_team WHERE whoscored_team_id = ?',[[whoscored_match_event.team_id]])).then(function(team){
		if(team.length){
			cb({
				team_id:team[0].team_id
			})
		} else {
			cb({})
		}
	})
},
get_match = function(whoscored_match_event,cb){
	excute(mysql.format('SELECT match_id FROM `whoscored_match_match` WHERE whoscored_match_id = ?',[whoscored_match_event.match_id]),function(match){
		if(match.length){
			cb({
				match_id:match[0].match_id
			})
		} else {
			cb({})
		}
	})
},
get_player = function(whoscored_match_event,cb){
	excute(mysql.format('SELECT player_id FROM `whoscored_player_player` WHERE whoscored_player_id = ?',[whoscored_match_event.player_id]),function(player){
		if(player.length){
			cb({
				player_id:player[0].player_id
			})
		} else {
			cb({})
		}
	})
},
insert_whoscored_event_event = function(match_events_id,whoscored_match_event_id,cb){
	excute(mysql.format('INSERT INTO `whoscored_event_event` SET ?',{
		whoscored_event_id:whoscored_match_event_id,
		event_id:match_events_id
	}),cb)
},
get_event_id_for_goal_event = function(event_id,cb){
	excute(mysql.format('SELECT event_id FROM `whoscored_event_event` WHERE whoscored_event_id = ? AND event_id NOT IN (SELECT event_id FROM `goal_events`)',[event_id]),cb)
},
insert_goal_event = function(match_events_id,whoscored_match_event_id,cb){
	excute(mysql.format('SELECT * FROM `whoscored_goals` WHERE event_id = ?',[whoscored_match_event_id]),function(rows){
		if(rows.length){
			var row = rows[0];
			excute(mysql.format('INSERT INTO `goal_events` SET ?',{
				event_id:match_events_id,
				penalty : row.penalty,
				owngoal : row.owngoal,
			}),cb)
			
		}
	})
},
preExcuteFunc = [get_match,get_team,get_player],
afterInsertMatchEventsCalls = [insert_whoscored_event_event,insert_goal_event],
migrate = function(cb){
	console.log('start create tables');
	return excute("CREATE TABLE IF NOT EXISTS `match_events` (\
		`id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
		  `player_id` int(10) unsigned NOT NULL,\
		  `match_id` int(10) unsigned NOT NULL,\
		  `team_id` int(10) unsigned NOT NULL,\
		  `minute` tinyint(3) unsigned NOT NULL,\
		  `offset` tinyint(2) unsigned NOT NULL DEFAULT '0',\
		  PRIMARY KEY (`id`)\
	) ENGINE=InnoDB DEFAULT CHARSET=utf8;").then(function(){
		return excute("CREATE TABLE IF NOT EXISTS `whoscored_event_event` (\
			`id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
			  `whoscored_event_id` int(10) unsigned NOT NULL,\
			  `event_id` int(10) unsigned NOT NULL,\
			  PRIMARY KEY (`id`)\
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
	}).then(function(){
		return excute('CREATE TABLE IF NOT EXISTS `whoscored_event_event` (`id` int(10) unsigned NOT NULL AUTO_INCREMENT,`whoscored_event_id` int(10) unsigned NOT NULL,`event_id` int(10) unsigned NOT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
	}).then(function(){
		return excute("CREATE TABLE IF NOT EXISTS `goal_events` (\
			`id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
			  `event_id` int(10) unsigned NOT NULL,\
			  `penalty` tinyint(1) NOT NULL DEFAULT '0',\
			  `owngoal` tinyint(1) NOT NULL DEFAULT '0',\
			  PRIMARY KEY (`id`)\
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
	}).then(function(){
		console.log('complete create tables');
		return excute('SELECT * FROM `whoscored_match_events` WHERE id NOT IN (SELECT whoscored_event_id FROM `whoscored_event_event`) AND match_id IN (SELECT whoscored_match_id FROM `whoscored_match_match`)').then(function(whoscored_match_events){
			if(whoscored_match_events.length){
				return whoscored_match_events.reduce(function(sequence, whoscored_match_event){
					match_event = {
						offset : whoscored_match_event.offset,
						minute : whoscored_match_event.minute
					};
					return excute(mysql.format('SELECT team_id FROM whoscored_team_team WHERE whoscored_team_id = ?',[whoscored_match_event.team_id])).then(function(team){
						if(team.length){
							match_event.team_id = team[0].team_id
						}
						return excute(mysql.format('SELECT match_id FROM `whoscored_match_match` WHERE whoscored_match_id = ?',[whoscored_match_event.match_id]))
					}).then(function(match){
						if(team.length){
							match_event.match_id = match[0].match_id
						}
						return excute(mysql.format('SELECT player_id FROM `whoscored_player_player` WHERE whoscored_player_id = ?',[whoscored_match_event.player_id]))
					}).then(function(player){
						if(player.length){
							match_event.player_id = player[0].player_id
						}
						if(_.has(match_event, "player_id") && _.has(match_event, "match_id") && _.has(match_event, "team_id")){
							return excute(mysql.format('INSERT INTO `match_events` SET ?',match_event)).then(function(result){
								return excute(mysql.format('INSERT INTO `whoscored_event_event` SET ?',{
									whoscored_event_id:whoscored_match_event.id,
									event_id:result.insertId
								})).then(function(){
									return excute(mysql.format('SELECT * FROM `whoscored_goals` WHERE event_id = ?',[whoscored_match_event_id]))
								}).then(function(rows){
									if(rows.length){
										var row = rows[0];
										return excute(mysql.format('INSERT INTO `goal_events` SET ?',{
											event_id:result.insertId,
											penalty : row.penalty,
											owngoal : row.owngoal,
										}))
										
									}
								})
								asyncLoop(afterInsertMatchEventsCalls.length, function(loop){
									var func = afterInsertMatchEventsCalls[loop.iteration()];
									func(result.insertId,whoscored_match_event.id,function(){
										loop.next()
									})
								},function(){
									loop.next()
								})
							})
						}
					})
				},Promise.resolve())
			}
		}).then(function(){
			console.log('complete insert match_event');
		})
	})
}
module.exports.migrate = migrate;