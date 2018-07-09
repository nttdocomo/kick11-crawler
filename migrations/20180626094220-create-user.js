'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('transfermarket_player', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      full_name: {
        type: Sequelize.STRING
      },
      name_in_native_country: {
        type: Sequelize.STRING
      },
      date_of_birth: {
        type: Sequelize.DATE
      },
      height: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      market_value: {
        type: Sequelize.DECIMAL(10,2)
      },
      foot: {
        type: Sequelize.STRING(10)
      },
      position: {
        type: Sequelize.STRING(20)
      },
      profile_uri: {
        type: Sequelize.STRING(100)
      },
      nation_id: {
        type: Sequelize.INTEGER.UNSIGNED
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('transfermarket_player');
  }
};