const { Client, Intents } = require('discord.js');
const fs = require('fs');
const { Sequelize } = require('sequelize');
const { token } = require('./config.json');

// Inicialização do cliente do Discord.js
const client = new Client({ intents: 3276543 });

// Carregar os comandos
client.commands = new Map();
client.aliases = new Map(); // Mapa para armazenar os aliases


const bodyParser = require("body-parser");
const db = require("quick.db");
const donationUtils = require("./utils/donations");

const express = require("express");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { MessageEmbed, MessageButton, MessageActionRow, Modal, TextInputComponent, MessageSelectMenu } = require('discord.js');

app.post("/api/donations/callback", async (request, response) => {
  response.status(200).json({ status: 200, message: "Request Received" });

  const { type, data } = request.body;

  if (type === "payment") {

    if (data.id) {

      const { external_reference, status } = await donationUtils.getDonation(data.id)

      let getInfo = await donationUtils.getDonation(data.id)

      if (status === "approved") {
        const donation = db.get(`payments.${external_reference}`)

        if (donation.status === "PENDING") {

          client.guilds.fetch(donation.serverId).then(async server => {
            client.users.fetch(donation.user).then(async donater => {

              let channelTestId = client.channels.cache.get('1176592427243544646')

              if (db.get(`payments.service_fivelist.idOrder.token.${getInfo.order.id}`)) return;
              await db.set(`payments.service_fivelist.idOrder`, { token: getInfo.order.id })

              channelTestId.send({ content: `**${donater.username}#${donater.discriminator}** (${getInfo.order.id})` })

              //const [existePremium] = await database.query(`select * from premiumplans where serverId='${server.id}'`);

              const embedAprovada = new MessageEmbed()

                .setTitle(`Pagamento aprovado!`)
                .setDescription(`Olá ${donater} seu pagamento foi aprovado com sucesso, e já está disponivel para uso em nosso servidor!`)
                .setColor('GREEN')
                .setThumbnail(donater.avatarURL({ format: 'jpeg', size: 2048 }))
                .setFooter({ text: 'Parabéns pela aquisição.' })
                .setTimestamp()

              try {
                await donater.send({ embeds: [embedAprovada], content: `<@${donater.id}> | Seu pedido foi aprovado com sucesso!` });
              } catch (err) {
                console.log('Um erro inesperado aconteceu:', err)
                return;
              }
            })
          })
        }
      }
    }
  }
})

app.all('*', (request, response) => response.status(404).json({ status: 404, message: "Page not found." }));

app.listen(10000); 

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