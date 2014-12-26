/**
 * @author nttdocomo
 */
var excute  = require('../../excute');
excute("CREATE TABLE IF NOT EXISTS `fm_player_player` (\
	`id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
	`fm_player_id` int(10) unsigned NOT NULL,\
	`player_id` int(10) unsigned NOT NULL,\
	PRIMARY KEY (`id`)\
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;");
excute("INSERT INTO `fm_player_player`(fm_player_id,player_id) SELECT fm_player.id,player.id FROM `fm_player` JOIN `player` ON fm_player.name = player.name AND fm_player.date_of_birth = player.date_of_birth WHERE fm_player.id NOT IN (SELECT fm_player_id FROM `fm_player_player`) AND player.id NOT IN (SELECT player_id FROM `fm_player_player`)",function(){
	console.log('complete!');
});