//INSERT INTO `whoscored_team_team` (whoscored_team_id,team_id) SELECT whoscored_team.id,transfermarkt_team_team.team_id FROM `whoscored_team` JOIN `team` ON team.name = whoscored_team.name JOIN `transfermarkt_team_team` ON transfermarkt_team_team.team_id = team.id WHERE whoscored_team.id NOT IN (SELECT whoscored_team_id FROM `whoscored_team_team`)

//建立赛事关系
//SELECT event.id,whoscored_event.id FROM `event` JOIN `whoscored_season_season` ON event.season_id = whoscored_season_season.season_id JOIN `whoscored_tournament_competition` ON event.competition_id = whoscored_tournament_competition.competition_id JOIN `whoscored_event` ON whoscored_event.tournament_id = whoscored_tournament_competition.whoscored_tournament_id AND whoscored_event.season_id = whoscored_season_season.whoscored_season_id WHERE event.id NOT IN (SELECT event_id FROM `whoscored_event_event`)

//建立whoscored_player和player的关系
INSERT INTO `whoscored_player_player` (whoscored_player_id,player_id) SELECT whoscored_player.id,transfermarkt_player_player.player_id FROM `whoscored_player` JOIN `player` ON player.name = whoscored_player.name JOIN `transfermarkt_player_player` ON transfermarkt_player_player.player_id = player.id WHERE whoscored_player.id NOT IN (SELECT whoscored_player_id FROM `whoscored_player_player`) AND transfermarkt_player_player.transfermarkt_player_id != 214906

SELECT whoscored_player.id,whoscored_player.name,player.name,transfermarkt_player_player.player_id,transfermarkt_player_player.transfermarkt_player_id FROM `whoscored_player` JOIN `player` ON player.name = whoscored_player.name JOIN `transfermarkt_player_player` ON transfermarkt_player_player.player_id = player.id WHERE whoscored_player.id NOT IN (SELECT whoscored_player_id FROM `whoscored_player_player`) AND transfermarkt_player_player.transfermarkt_player_id != 214906

SELECT whoscored_player.id,whoscored_player.name,player.name,transfermarkt_player_player.player_id,transfermarkt_player_player.transfermarkt_player_id FROM `whoscored_player` JOIN `player` ON player.name = whoscored_player.name AND player.date_of_birth = whoscored_player.date_of_birth JOIN `transfermarkt_player_player` ON transfermarkt_player_player.player_id = player.id WHERE whoscored_player.id NOT IN (SELECT whoscored_player_id FROM `whoscored_player_player`) AND transfermarkt_player_player.transfermarkt_player_id != 214906

//根据event_team里有的球队，在whoscored_team里找出名字一样的队伍
SELECT whoscored_team.name,whoscored_team.id,team.id,team.name FROM `whoscored_team` JOIN `team` ON team.name = whoscored_team.name JOIN `event_team` ON event_team.team_id = team.id WHERE team.id NOT IN (SELECT team_id FROM `whoscored_team_team`)

INSERT INTO `whoscored_team_team` (whoscored_team_id,team_id) 