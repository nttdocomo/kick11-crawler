SELECT whoscored_matches.id AS whoscored_matches_id,matchs.id AS matchs_id FROM `whoscored_matches` 
JOIN (`whoscored_team_team` AS tt1,`whoscored_team_team` AS tt2,`matchs`) 
ON (whoscored_matches.team1_id = tt1.whoscored_team_id AND whoscored_matches.team2_id = tt2.whoscored_team_id AND matchs.team1_id = tt1.team_id AND matchs.team2_id = tt2.team_id AND matchs.play_at = whoscored_matches.play_at)

INSERT INTO whoscored_match_match (whoscored_match_id,match_id) SELECT whoscored_matches.id AS whoscored_matches_id,matchs.id AS matchs_id FROM `whoscored_matches` 
JOIN (`whoscored_team_team` AS tt1,`whoscored_team_team` AS tt2,`matchs`) 
ON (whoscored_matches.team1_id = tt1.whoscored_team_id AND whoscored_matches.team2_id = tt2.whoscored_team_id AND matchs.team1_id = tt1.team_id AND matchs.team2_id = tt2.team_id AND matchs.play_at = whoscored_matches.play_at)