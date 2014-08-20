var pool  = require('../pool');
function update_table(){
	pool.getConnection(function(err, connection) {
		connection.query("SELECT * FROM `events_teams`", function(err,rows) {
		    if (err) throw err;
		    for (var i = rows.length - 1; i >= 0; i--) {
			    var event_id = rows[i].event_id, team_id = rows[i].team_id;
			    get_matchs(event_id,team_id);
		    };
		    connection.release();
		});
	});
}
function get_matchs(event_id,team_id){
	pool.getConnection(function(err, connection) {
		connection.query("SELECT results.team1_id AS team1_id,results.team2_id AS team2_id,results.score1 AS score1,results.score2 AS score2 FROM (SELECT * FROM `matchs` WHERE (team1_id = ? OR team2_id = ?) AND score1 IS NOT NULL AND score2 IS NOT NULL)`results` JOIN (SELECT * FROM `rounds` WHERE event_id = ?)`rounds` ON results.round_id = rounds.id", [team_id, team_id, event_id], function(err,rows) {
		    if (err) throw err;
		    connection.release();
		    var wins = 0, draws = 0, loses = 0, goals_for = 0, goals_against = 0;
		    for (var i = rows.length - 1; i >= 0; i--) {
		    	var result = rows[i];
		    	if(result.team1_id == team_id){
		    		goals_for += result.score1;
		    		goals_against += result.score2;
		    	}
		    	if(result.team2_id == team_id){
		    		goals_for += result.score2;
		    		goals_against += result.score1;
		    	}
		    	if((result.team1_id == team_id && result.score1 > result.score2) || (result.team2_id == team_id && result.score2 > result.score1)){
		    		wins++;
		    	}
		    	if((result.team1_id == team_id && result.score1 < result.score2) || (result.team2_id == team_id && result.score2 < result.score1)){
		    		loses++;
		    	}
		    	if(result.score1 == result.score2){
		    		draws++;
		    	}
		    };
		    if(wins || draws || loses){
			    update_table(event_id,team_id,wins,draws,loses,goals_for,goals_against)
			    console.log(team_id,wins,draws,loses,goals_for,goals_against)
		    }
		});
	});
}
function update_table(event_id,team_id,wins,draws,loses,goals_for,goals_against){
	pool.getConnection(function(err, connection) {
		connection.query("UPDATE `tables` SET ? WHERE event_id = ? AND team_id = ?", [{
			wins:wins,
			draws:draws,
			loses:loses,
			goals_for:goals_for,
			goals_against:goals_against
		}, event_id, team_id], function(err,rows) {
		    if (err) throw err;
		    connection.release();
		});
	});
}
module.exports = update_table;