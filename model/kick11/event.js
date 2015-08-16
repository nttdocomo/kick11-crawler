/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
difference = require('../../utils').difference,
Model = require('../../model'),
MatchEvent = Model.extend({
    is_exist:function(){
		return excute(mysql.format('SELECT * FROM `'+this.constructor.table+'` WHERE team_id = ? AND player_id = ? AND match_id = ?',[this.get('team_id'), this.get('player_id'), this.get('match_id')]))
    },
	needToUpdate:function(data,row){
		this._super(data,row);
		var diff;
		if(!_.isEqual(data,row)){
			diff = difference(row,data);
			return diff;
    		//return excute(mysql.format('UPDATE `transfermarket_team` SET ? WHERE id = ?',[diff,id]))
		}
		return false;
	}
});
MatchEvent.excute = excute;
MatchEvent.table = 'match_events';
MatchEvent.all = function(){
	console.log(this.table)
    return excute('SELECT * FROM '+this.table+' ORDER BY play_at ASC');
};
MatchEvent.save_from_whoscored = function(content, match_id){
    var matchCentre2 = JSON.parse(content),
    playerIdNameDictionary = matchCentre2.playerIdNameDictionary,
    events = matchCentre2.events;
    if(events.length){
        return events.reduce(function(sequence,whoscored_match_event){
            var minute = whoscored_match_event.minute,
            team_id = whoscored_match_event.teamId,
            player_id = whoscored_match_event.playerId,
            player_name = playerIdNameDictionary[player_id],
            period = whoscored_match_event.period,
            offset = 0;
            if(period.value == 1 && minute > 45){
                offset = minute - 45
                minute = 45;
            }
            if(period.value == 2 && minute > 90){
                offset = minute - 90
                minute = 90;
            };
            var data = {
                player_id:player_id,
                match_id:match_id,
                team_id:team_id,
                minute:minute,
                offset:offset
            };
            return sequence.then(function(){
            	return excute(mysql.format('SELECT * FROM `whoscored_matches` WHERE id = ? AND (team1_id = ? OR team2_id = ?)',[match_id,team_id,team_id]))
            }).then(function(whoscored_match){
				if(whoscored_match.length){
					whoscored_match = whoscored_match[0];
					var whoscored_team1_id = whoscored_match.team1_id,
					whoscored_team2_id = whoscored_match.team2_id,
					play_at = whoscored_match.play_at,
					team1_id,
					team2_id;
					return excute(mysql.format('SELECT * FROM `whoscored_team_team` WHERE whoscored_team_id = ?',[whoscored_team1_id])).then(function(row){
						if(row.length){
							team1_id = row[0].team_id;
							return excute(mysql.format('SELECT * FROM `whoscored_team_team` WHERE whoscored_team_id = ?',[whoscored_team2_id]));
						}
						return Promise.resolve();
					}).then(function(row){
						if(row && row.length){
							team2_id = row[0].team_id;
							if(team1_id && team2_id){
								return excute(mysql.format('SELECT * FROM `matchs` WHERE team1_id = ? AND team2_id = ? AND play_at = ?',[team1_id,team2_id,play_at]));
							}
						}
						return Promise.resolve();
					}).then(function(row){
						if(row && row.length){
							match_id = row[0].id
							var data = _.clone(whoscored_match_event);
							delete data.id;
							delete data.updated_at;
							delete data.created_at;
							data.match_id = match_id;
							var match_event = new MatchEvent(data);
							return match_event.save();
						}
						return Promise.resolve();
					})
				}
				return Promise.resolve();
			})
        },Promise.resolve())
    }
    return Promise.resolve();
};
module.exports = MatchEvent;