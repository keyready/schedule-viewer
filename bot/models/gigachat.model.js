const { DataTypes } = require('sequelize');
const DB = require('../config/db.connect');

const GigachatModel = DB.define(
    'gigachat',
    {
        content: DataTypes.TEXT,
        role: DataTypes.STRING,
    },
    {
        tableName: 'gigachat',
        timestamps: false,
    },
);

module.exports = {
    GigachatModel,
};
