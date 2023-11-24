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

    const { v4: uuidv4 } = require('uuid');

    let serverId = '870111779877949492';
    let userId = "1169348902990925932";
    let uuid = uuidv4()

    const CLIENT_ID = '405283998650507';
    const REDIRECT_URI = 'https://pikaxu-api.vercel.app/api/callback/authorization/mercadopago';
    let authorizationUrl = `https://auth.mercadopago.com.br/authorization?client_id=${CLIENT_ID}&response_type=code&platform_id=mp&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${uuid}&serverId=${serverId}`;


    // const database = require('../database/index.js');

    // const Whitelist = database.define('whitelist', {
    //   serverId: {
    //     type: Sequelize.STRING,
    //   },
    //   questions: {
    //     type: Sequelize.JSON,
    //     allowNull: false,
    //   },
    //   minimumToPass: {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    //   },
    // })
    // Whitelist.sync({ force: true })

  },
};