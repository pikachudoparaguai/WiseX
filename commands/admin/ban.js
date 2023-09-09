const { Permissions, MessageEmbed } = require('discord.js');
const db = require('../../database/index.js');
const config = require('../../config.json');

module.exports = {
  name: 'ban',
  description: 'Bane alguém do servidor.',
  aliases: ['banir'],

  // Função para executar o comando
  async execute(message, client, args) {

    const [existPrefix] = await db.query(`SELECT * FROM Prefixes WHERE serverId='${message.guild.id}'`);
    const prefix = existPrefix?.[0]?.prefix || config.prefix;

    if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
      return message.reply(`**${message.author}**, você não tem permissão para banir alguém no servidor.`);
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply(`**${message.author}**, você deve informar o membro que deseja punir. *(${prefix}ban @membro)*`);
    }
    if (member === message.author) {
      return message.reply(`**${message.author}**, você não pode se punir.`);
    }

    if (!member.bannable) {
      return message.reply(`**${message.author}**, eu não posso punir um usuário que está com um cargo maior do que o meu.`);
    }
    if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
      return message.reply(`**${message.author}**, eu não tenho permissão de \`Banir Membros\`, e por isso não consigo banir o membro que deseja.`);
    }

    try {
      message.reply({
        content: `${message.author} o usuário foi punido como desejado!`,
      });

      await member.ban({ days: 0});
    } catch (err) {
      console.error(err);
      message.reply(`**${message.author}**, ocorreu um erro ao executar este comando.`);
    }
  },
};