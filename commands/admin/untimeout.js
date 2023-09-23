const { Permissions, MessageEmbed } = require("discord.js");
const db = require('../../database/index.js');

const config = require("../../config.json");
const emoji = require("../../utils/emojis");


module.exports = {
    name: "untimeout",
    description: "Remova o mute de uma pessoa mutada.",
    aliases: ["desmute", "unmute"],

    async execute(message, client, args) {

        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply(`${message.author}, você não tem permissão para executar este comando.`)
        
        const [existPrefix] = await db.query(`SELECT * FROM Prefixos WHERE serverId='${message.guild.id}'`);
        const prefix = existPrefix?.[0]?.prefix || config.prefix

        let member = message.mentions.members.first();
        if (!member) return message.reply(`${message.author}, você deve informar o **usúario**. ${prefix}untimeout @Usúario`)

        if (member == message.member) return message.reply(`${message.author}, você não pode se despunir.`)
        if (!member.bannable) return message.reply(`${message.author}, eu não posso despunir um usúario com o cargo maior que o meu.`)

        client.api.guilds(message.guild.id).members(member.id).patch({
            data: {
                communication_disabled_until: null
            },
            reason: "Desmutado!"
        }).catch(async error => {
            return await message.reply(`${message.author}, ocorreu um erro ao tentar dar untimeout no usúario.`)
        })

        const banEmbed = new MessageEmbed()

            .setTitle(`${emoji.name.punir} Um membro foi desmutado!`)
            .setDescription(`
**Membro Desmutado:**
${member}

**Autor da Revogação:**
\`\`\`${message.author.username}#${message.author.discriminator} (${message.author.id})\`\`\`
`)
            .setColor("RED")
            .setFooter(message.guild.name)
            .setTimestamp()

        message.reply({
            embeds: [banEmbed]
        })

    }
}