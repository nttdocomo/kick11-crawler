const Sequelize = require('sequelize')
const Player = sequelize.define('player', {
  	full_name: Sequelize.STRING,
  	name_in_native_country: Sequelize.STRING,
  	date_of_birth:Sequelize.DATE,
	height:Sequelize.INTEGER.UNSIGNED,
	market_value:Sequelize.STRING(20),
	foot:Sequelize.STRING(10),
	position:Sequelize.STRING(20),
	profile_uri:Sequelize.STRING(100),
	nation_id:Sequelize.INTEGER.UNSIGNED
}, {
	freezeTableName: true
})

module.export = Player