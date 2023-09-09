const { Client, Intents } = require('discord.js');
const fs = require('fs');
const { Sequelize } = require('sequelize');
const { token } = require('./config.json');

// Inicialização do cliente do Discord.js
const client = new Client({ intents: 3276543 });

// Carregar os comandos
client.commands = new Map();
client.aliases = new Map(); // Mapa para armazenar os aliases

const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);

    // Verifica se o comando possui aliases e os adiciona ao objeto client.commands
    if (command.aliases) {
      command.aliases.forEach(alias => {
        client.aliases.set(alias, command.name); // Armazena o nome do comando correspondente
      });
    }
  }
}

// Carregar os eventos
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Inicialização do bot e login com o token do bot
client.login(token);