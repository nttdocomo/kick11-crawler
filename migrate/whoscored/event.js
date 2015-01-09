var excute = require('../../excute'),asyncLoop = require('../../asyncLoop'),mysql = require('mysql'),_=require('underscore'),
get_team = function(whoscored_match_event,cb){
	excute(mysql.format('SELECT team_id FROM whoscored_team_team WHERE whoscored_team_id = ?',[[whoscored_match_event.team_id]]),function(team){
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
	excute("CREATE TABLE IF NOT EXISTS `match_events` (\
`id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
  `player_id` int(10) unsigned NOT NULL,\
  `match_id` int(10) unsigned NOT NULL,\
  `team_id` int(10) unsigned NOT NULL,\
  `minute` tinyint(3) unsigned NOT NULL,\
  `offset` tinyint(2) unsigned NOT NULL DEFAULT '0',\
  PRIMARY KEY (`id`)\
) ENGINE=InnoDB DEFAULT CHARSET=utf8;");

	excute('CREATE TABLE IF NOT EXISTS `whoscored_event_event` (`id` int(10) unsigned NOT NULL AUTO_INCREMENT,`whoscored_event_id` int(10) unsigned NOT NULL,`event_id` int(10) unsigned NOT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;');
	excute("CREATE TABLE IF NOT EXISTS `goal_events` (\
`id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
  `event_id` int(10) unsigned NOT NULL,\
  `penalty` tinyint(1) NOT NULL DEFAULT '0',\
  `owngoal` tinyint(1) NOT NULL DEFAULT '0',\
  PRIMARY KEY (`id`)\
) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
	console.log('start to insert match_event');
	excute('SELECT * FROM `whoscored_match_events` WHERE id NOT IN (SELECT whoscored_event_id FROM `whoscored_event_event`) AND match_id IN (SELECT whoscored_match_id FROM `whoscored_match_match`)',function(whoscored_match_events){
		if(whoscored_match_events.length){
			asyncLoop(whoscored_match_events.length, function(loop){
				var whoscored_match_event = whoscored_match_events[loop.iteration()],
				match_event = {
					offset : whoscored_match_event.offset,
					minute : whoscored_match_event.minute
				};
				asyncLoop(preExcuteFunc.length, function(loop){
					var func = preExcuteFunc[loop.iteration()];
					func(whoscored_match_event,function(item){
						_.extend(match_event,item)
						loop.next()
					})
				},function(){
					if(_.has(match_event, "player_id") && _.has(match_event, "match_id") && _.has(match_event, "team_id")){
						excute(mysql.format('INSERT INTO `match_events` SET ?',match_event),function(result){
							asyncLoop(afterInsertMatchEventsCalls.length, function(loop){
								var func = afterInsertMatchEventsCalls[loop.iteration()];
								func(result.insertId,whoscored_match_event.id,function(){
									loop.next()
								})
							},function(){
								loop.next()
							})
						})
					} else {
						loop.next()
					}
				})
			}, function(){
				console.log('complete insert match_event');
				cb()
			})
		}
	})
}
module.exports.migrate = migrate;