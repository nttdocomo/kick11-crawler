'use strict';
module.exports = (sequelize, DataTypes) => {
  var Nation = sequelize.define('transfermarket_nation', {
  	name: DataTypes.STRING(30)
  }, {
  	underscored: true,
  });
  Nation.associate = function(models) {
    // associations can be defined here
  };
  return Nation;
};

//node_modules/.bin/sequelize model:generate --name Player --attributes firstName:string,lastName:string,email:string