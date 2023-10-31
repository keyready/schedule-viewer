const { Sequelize } = require('sequelize');

module.exports = new Sequelize('schedule-viewer', 'postgres', 'qwerty', {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
});
