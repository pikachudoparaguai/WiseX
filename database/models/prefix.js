const Sequelize = require('sequelize');
const database = require('../index.js');

const Prefix = database.define('Prefix', {
    serverId: {
        type: Sequelize.STRING,
    },
    Prefix: {
        type: Sequelize.STRING,
    }
})

module.exports = Prefix;