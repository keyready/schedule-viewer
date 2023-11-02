const { DataTypes } = require('sequelize');
const DB = require('../config/db.connect');

const AccessTokenModel = DB.define(
    'access_token',
    {
        access_token: DataTypes.TEXT,
    },
    {
        tableName: 'access_token',
        timestamps: false,
    },
);

module.exports = {
    AccessTokenModel,
};
