const { Permissions, MessageEmbed } = require("discord.js");
const db = require("../../database/index");
const config = require('../../config.json');
const emoji = require("../../utils/emojis");

module.exports = {
    name: "setnick",
    description: "Defina um nick para um membro de seu servidor.",
    aliases: ["nick"],

    async execute(message, client, args) {

        const [existPrefix] = await db.query(`SELECT * FROM Prefixes WHERE serverId='${message.guild.id}'`);
        const prefix = existPrefix?.[0]?.prefix || config.prefix;

        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) {
            return message.reply(`**${message.author}**, você não tem permissão para executar este comando.`);
        }

        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_NICKNAMES)) {
            return message.reply(`**${message.author}**, eu não tenho permissão de \`Gerenciar Apelidos\`, e por isso não consigo alterar o nick do membro que deseja.`);
        }

        const member = message.mentions.members.first();
        if (!member) {
            return message.reply(`${message.author}, você deve informar o **usuário**. ${prefix}setnick @Usuário Nick **[Máximo de 32 caracteres]**`);
        }

        if (message.guild.me.roles.highest.position <= member.roles.highest.position) {
            return message.reply(`Desculpe, não consigo alterar o nick de uma pessoa com cargo maior que o meu.`);
        }

        let newUserNickname = args[1];
        if (!newUserNickname) {
            return message.reply(`${message.author}, você deve inserir o novo nick para o membro. ${prefix}setnick @Usuário Nick **[Máximo de 32 caracteres]**`);
        }

        try {
            await member.setNickname(newUserNickname);
            message.reply(`Apelido foi alterado com sucesso.`);
        } catch (err) {
            message.reply(`**${message.author}**, ocorreu um erro ao executar este comando. Verifique se o bot possui todas as permissões requiridas, ou se o seu cargo é maior que o do bot (caso seja o dono não tem como alterar seu nick mesmo com cargo maior).`);
        }
    }
};