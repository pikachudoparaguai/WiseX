const { Permissions, MessageEmbed } = require('discord.js');
const db = require('../../database/index.js');
const config = require('../../config.json');

module.exports = {
    name: 'kick',
    description: 'Expulsa alguem do servidor.',
    aliases: ['expulsar'],

    // Função para executar o comando
    async execute(message, client, args) {

        const [existPrefix] = await db.query(`SELECT * FROM Prefixes WHERE serverId='${message.guild.id}'`);
        const prefix = existPrefix?.[0]?.prefix || config.prefix;

        if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {

            return message.reply(`${message.author}, você não tem acesso para expulsar alguém no servidor.`)
        }

        let member = message.mentions.members.first();
        if (!member) return message.reply(`${message.author}, você deve informar o membro que deseja punir. *(${prefix}kick @membro)*`)
        if (member === message.author) return message.reply(`${message.author}, você não pode sí punir.`)

        if (!member.bannable) return message.reply(`${message.author}, eu não possu punir um usúario que está com o cargo maior que eu estou utilizando.`)
        if (!message.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {

            return message.reply(`${message.author}, eu não tenho permissão de \`Expulsar Membros\`, e por isso não consigo expulsar o membro que deseja.`)
        }

        try {
            message.reply({
                content: `${message.author} o usuário foi expulso do servidor como desejado!`
            })
            member.kick({
                days: 0,
            })

        } catch (err) {
            return;
        }

    }
}