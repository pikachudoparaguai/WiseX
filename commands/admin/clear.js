const { Permissions, MessageEmbed } = require("discord.js");
const db = require("../../database/index.js");
const config = require('../../config.json');
const emojis = require("../../utils/emojis");

module.exports = {
    name: "clear",
    description: "Limpa mensagens em um canal.",
    aliases: ["clean", "delete"],

    async execute(message, client, args) {

        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            return message.reply(`${message.author}, você não tem permissão para executar este comando.`);
        }

        const [existPrefix] = await db.query(`SELECT * FROM Prefixes WHERE serverId='${message.guild.id}'`);
        const prefix = existPrefix?.[0]?.prefix || config.prefix;

        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount <= 0 || amount > 100) {
            return message.reply(`${message.author}, você deve inserir um número entre 1 e 100 para limpar mensagens. **${prefix}clear <quantidade>**`);
        }

        try {
            const messages = await message.channel.messages.fetch({ limit: amount + 1 });

            if (messages.size === 1) {
                return message.reply(`${message.author}, não há mensagens suficientes para limpar.`);
            }

            await message.channel.bulkDelete(messages);

            if (message.deletable) {
                const clearEmbed = new MessageEmbed()
                    .setTitle(`${emojis.name.correto} Limpeza de Mensagens`)
                    .setDescription(`**${amount} mensagens foram limpas por ${message.author.username}#${message.author.discriminator}**`)
                    .setColor("GREEN")
                    .setFooter(message.guild.name)
                    .setTimestamp();

                // Envia a mensagem de confirmação
                message.channel.send({ embeds: [clearEmbed] });
            }
        } catch (error) {
            message.reply(`**${message.author}**, Você tentou usar caracteres invalidos, tente novamente mas usando apenas números.`);
        }
    }
};