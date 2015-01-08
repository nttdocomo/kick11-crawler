var get_player_by_team = require('./crawler/transfermarkt.co.uk/player/get_player_by_team').get_player_by_team,
transfermarket_migrate = require('./migrate/transfermarket/migrate').migrate;
get_player_by_team(transfermarket_migrate);