const { DataTypes } = require('sequelize');
const DB = require('../config/db.connect');

const UserModel = DB.define(
    'users',
    {
        chat_id: DataTypes.STRING,
        group: DataTypes.STRING,
    },
    {
        tableName: 'users',
        timestamps: false,
    },
);

module.exports = {
    UserModel,
};
