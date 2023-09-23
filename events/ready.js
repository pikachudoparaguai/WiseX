const Sequelize = require('sequelize')

module.exports = {
  name: 'ready', // Nome do evento
  once: true, // Define se o evento deve ser executado apenas uma vez

  // Função para executar o evento
  execute(client) {
    console.clear()
    console.log(`Logged in as ${client.user.tag} \nServidores Total: ${client.guilds.cache.size}`);
    console.log('Bot is ready and online!');

    setInterval(() => {
      client.user.setActivity("bot ta on")
    }, 120000)

    /*const database = require('../database/index.js');


    const serverIp = database.define('ServerIp', {
      serverId: {
        type: Sequelize.STRING,
      },
      Ip: {
        type: Sequelize.STRING,
      }
    })
    serverIp.sync({ force: true })*/

  },
};