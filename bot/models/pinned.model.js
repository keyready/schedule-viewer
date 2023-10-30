const { DataTypes } = require('sequelize');
const DB = require('../config/db.connect');

const PinnedModel = DB.define(
    'pinned',
    {
        message_id: DataTypes.STRING,
        chat_id: DataTypes.STRING,
    },
    {
        tableName: 'pinned',
        timestamps: false,
    },
);

module.exports = {
    PinnedModel,
};
