/**
 * @author nttdocomo
 */
var excute = require('../../promiseExcute'),
mysql = require('mysql'),
_ = require('underscore'),
moment = require('moment'),
moment_tz = require('moment-timezone'),
difference = require('../../crawler/transfermarkt.co.uk/utils').difference,
Model = require('../../model'),
Match = Model.extend({
	table:'whoscored_match',
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
Match.excute = excute;
Match.table = 'whoscored_match';
Match.get_whoscored_match_match = function(whoscored_match_id,match_id){
    return excute(mysql.format('SELECT 1 FROM `whoscored_match_match` WHERE whoscored_match_id = ? LIMIT 1',[whoscored_match_id])).then(function(row){
        if(!row.length){
            return excute(mysql.format('INSERT INTO `whoscored_match_match` SET ?',{
                match_id:match_id,
                whoscored_match_id:whoscored_match_id
            })) 
        }
        return Promise.resolve();
    })
}
Match.insert_whoscored_match = function(data){
    return excute(mysql.format('INSERT INTO `whoscored_match` SET ?',data))
}
Match.update_match = function(whoscored_match,match){
    var data = {};
    if(match[0].score1+'' != data.score1+''){
        data.score1 = whoscored_match.score1
    }
    if(match[0].score2+'' != data.score2 + ''){
        data.score2 = whoscored_match.score2
    }
    
    if(!_.isEmpty(data)){
        return excute(mysql.format('UPDATE `match` SET ? WHERE id = ?',[data,match[0].id])).then(function(){
            return Match.get_whoscored_match_match(whoscored_match.id,match[0].id)
        })
    }
    return Promise.resolve()
}
Match.insert_match = function(match){
    return excute(mysql.format('SELECT team_id FROM `whoscored_team_team` WHERE whoscored_team_id = ? LIMIT 1',[match.team1_id])).then(function(row){
        team1_id = row[0].team_id;
        return excute(mysql.format('SELECT team_id FROM `whoscored_team_team` WHERE whoscored_team_id = ? LIMIT 1',[match.team2_id]))
    }).then(function(row){
        team2_id = row[0].team_id;
        return excute(mysql.format('SELECT * FROM `match` WHERE team1_id = ? AND team2_id = ? AND play_at = ? LIMIT 1',[team1_id,team2_id,match.play_at]))
    }).then(function(row){
        var data = {};
        if(!row.length){
            data = _.extend(_.pick(data,'play_at','score1','score2'),{
                team1_id:team1_id,
                team2_id:team2_id
            })
            return excute(mysql.format('INSERT INTO `match` SET ?',data)).then(function(result){
                return Match.get_whoscored_match_match(match.id,result.insertId)
            })
        }
        return Match.update_match(match,row)
    })
}
Match.get_match = function(match){
    return excute(mysql.format('SELECT 1 FROM `whoscored_match` WHERE id = ? LIMIT 1',[match.id])).then(function(row){
    	var team1_id,team2_id;
    	if(!row.length){
    		return Match.insert_match(match).then(function(){
                return Match.insert_whoscored_match(match)
            }).catch(function(){
                return Match.insert_whoscored_match(match)
    		})
    	}
        return excute(mysql.format('SELECT match_id FROM `whoscored_match_match` WHERE whoscored_match_id = ? LIMIT 1',[match.id])).then(function(row){
            if(!row.length){
                return Match.insert_match(match).catch(function(){
                    return Promise.resolve()
                })
            }
            return excute(mysql.format('SELECT * FROM `match` WHERE id = ? LIMIT 1',[row[0].match_id])).then(function(row){
                return Match.update_match(match,row)
            })
        })
    });
};
Match.get_uncomplete_matches = function(){
    return excute('SELECT id,play_at AS play_date FROM whoscored_match WHERE score1 IS NULL AND score2 IS NULL ORDER BY play_at ASC');
};
Match.all = function(){
    return excute('SELECT * FROM whoscored_match ORDER BY play_at ASC');
};
module.exports.get_match_by_id = function(id){
    return excute(mysql.format('SELECT 1 FROM whoscored_match WHERE id = ?',[id]));
};
module.exports = Match;