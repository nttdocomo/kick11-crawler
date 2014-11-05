var excute = require('../../excute');
excute('SELECT * FROM whoscored_matches WHERE id NOT IN (SELECT whoscored_match_id FROM whoscored_match_match)',function(rows){
	rows.forEach(function(row){
		excute('SELECT * FROM whoscored_matches WHERE id NOT IN (SELECT whoscored_match_id FROM whoscored_match_match)')
	})
})
//SELECT whoscored_matches_not_in_whoscored_match_match.*,whoscored_team_team.team_id FROM (SELECT * FROM `whoscored_matches` WHERE id NOT IN (SELECT whoscored_match_id FROM `whoscored_match_match`))`whoscored_matches_not_in_whoscored_match_match` JOIN `whoscored_team_team` ON whoscored_team_team.whoscored_team_id = whoscored_matches_not_in_whoscored_match_match.team1_id

/*SELECT whoscored_matches_not_in_whoscored_match_match.*,team1.team_id FROM (SELECT * FROM `whoscored_matches` WHERE id NOT IN (SELECT whoscored_match_id FROM `whoscored_match_match`))`whoscored_matches_not_in_whoscored_match_match` 
JOIN `whoscored_team_team` AS `team1` ON team1.whoscored_team_id = whoscored_matches_not_in_whoscored_match_match.team1_id 
JOIN `whoscored_team_team` AS `team2` ON team2.whoscored_team_id = whoscored_matches_not_in_whoscored_match_match.team2_id*/