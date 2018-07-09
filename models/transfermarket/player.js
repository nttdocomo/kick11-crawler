'use strict';
module.exports = (sequelize, DataTypes) => {
  var Player = sequelize.define('transfermarket_player', {
  	full_name: DataTypes.STRING,
  	name_in_native_country: DataTypes.STRING,
  	date_of_birth:DataTypes.DATE,
	height:DataTypes.INTEGER.UNSIGNED,
	market_value:DataTypes.DECIMAL(10,2),
	foot:DataTypes.STRING(10),
	position:DataTypes.STRING(20),
	profile_uri:DataTypes.STRING(100),
	nation_id:DataTypes.INTEGER.UNSIGNED
  }, {
  	underscored: true,
  });
  Player.associate = function(models) {
    // associations can be defined here
  };
  return Player;
};

//node_modules/.bin/sequelize model:generate --name Player --attributes firstName:string,lastName:string,email:string