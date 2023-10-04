const Sequelize = require('sequelize');
const database = require('../index.js');

const Whitelist = database.define('whitelist', {
    serverId: {
        type: Sequelize.STRING,
    },
    questions: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    minimumToPass: {
        type: Sequelize.NUMBER,
        allowNull: false,
    },
})

module.exports = Whitelist;