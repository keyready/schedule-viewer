const { DataTypes } = require('sequelize');
const DB = require('../config/db.connect');

const GroupModel = DB.define(
    'groups',
    {
        group: DataTypes.STRING,
        chat_id: DataTypes.STRING,
    },
    {
        tableName: 'groups',
        timestamps: false,
    },
);

module.exports = {
    GroupModel,
};
