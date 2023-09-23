const Sequelize = require('sequelize');
const database = require('../index.js');

const serverIp = database.define('ServerIp', {
    serverId: {
        type: Sequelize.STRING,
    },
    Ip: {
        type: Sequelize.STRING,
    }
})

module.exports = serverIp;