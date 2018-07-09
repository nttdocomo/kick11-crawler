const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'root', 'password', {
  host: '10.96.84.201',
  port: 3306
  dialect: 'mysql'
});

module.export = sequelize