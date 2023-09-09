const { Permissions, MessageEmbed } = require("discord.js");
const db = require("../../database/index");
const config = require('../../config.json');
const emoji = require("../../utils/emojis");
const databasePrefixo = require('../../database/models/prefix');

module.exports = {
  name: 'config-prefix',
  description: 'Configura o prefixo do bot.',
  aliases: ['prefix', 'setprefix'],

  // Função para executar o comando
  async execute(message, client, args) {
    
    const [existPrefix] = await db.query(`SELECT * FROM Prefixes WHERE serverId='${message.guild.id}'`);
    const prefix = existPrefix?.[0]?.prefix || config.prefix;
    const newPrefix = args.join(" ").trim();

    if (newPrefix.length > 4) {
      return message.reply(`${emoji.name.negado} Você deve inserir um prefixo menor do que 4 caracteres. Ex: \`${prefix}config-prefix <prefixo>\``);
    }

    if (newPrefix.length < 1) {
      return message.reply(`${emoji.name.negado} Você deve inserir um prefixo válido. Ex: \`${prefix}config-prefix <prefixo>\``);
    }

    if (prefix === newPrefix) {
      return message.reply(`${emoji.name.negado} Você inseriu um prefixo já existente. Ex: \`${prefix}config-prefix <prefixo>\``);
    }

    if (prefix) {
      await db.query(`DELETE FROM Prefixes WHERE serverId='${message.guild.id}'`);
    }

    message.reply(`${emoji.name.correto} Prefixo definido para: \`${newPrefix}\``);
    databasePrefixo.create({
      serverId: message.guild.id,
      prefix: newPrefix,
    });
  }
};