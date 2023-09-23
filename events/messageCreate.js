const config = require('../config.json')
const db = require("../database/index");

module.exports = {
  name: 'messageCreate', // Nome do evento
  once: false,

  // Função para executar o evento
  async execute(message, client) {

    if (message.author.bot || message.channel.type === 'DM') return;
    

    const [existPrefix] = await db.query(`SELECT * FROM Prefixos WHERE serverId='${message.guild.id}'`);
    const prefix = existPrefix?.[0]?.prefix || config.prefix

    // const wasBanned = await db.query(`SELECT * FROM GlobalBans WHERE userId='${message.author.id}'`);
    // const bannedInfo = wasBanned[0]?.[0]; // Pega o primeiro elemento do primeiro array
    
    // if (bannedInfo) {
    //   console.log('Usuário banido detectado:', message.author.id);
    //   return message.reply('Você foi banido de utilizar o bot. Caso ache que isso foi um engano entre em contato no servidor de (suporte)[https://discord.gg/B5tFthfgDy]');
    // }

    // Verifica se a mensagem foi enviada por um bot, para evitar respostas em cadeia
    if (message.author.bot) return;

    // Se o bot foi mencionado sem um comando, responde com uma mensagem

    if (!message.content.startsWith(prefix)) return;

    // Separa o nome do comando e os argumentos
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    
    // Verifica se o comando existe ou se é um alias
    let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    
    if (!command) return;

    try {
      if (command) {
        command.execute(message, client, args); // Passe args como o terceiro argumento
      }
    } catch (error) {
      console.error(error);
      message.channel.send('Ocorreu um erro ao executar este comando. Caso ocorra novamente entre em contato com a (equipe de desenvolvimento)[https://discord.gg/B5tFthfgDy]');
    }
  },
};