const { Discord, MessageEmbed } = require('discord.js');

module.exports = {
    name: "userinfo",
    aliases: ["memberinfo"],

    async execute(message, client, args) {

        let guild = message.guild

        const member = message.mentions.members.first() || message.guild.members.cache.get(message.author.id)

        let infoEmbed = new MessageEmbed()

            .setAuthor(`👤 | Informações de Usúario`)
            .addField("Usúario", `${member.user}`, true)
            .addField("ID do Usúario", `${member.user.id}`, true)
            .addField("Entrada do Usúario", `<t:${Math.floor(member.joinedTimestamp / 1000)}>`, false)
            .addField("Criação da Conta", `<t:${Math.floor(member.user.createdTimestamp / 1000)}>`, false)
            .setColor("RANDOM")
            .setThumbnail(member.user.avatarURL({ format: 'jpeg', size: 2048 }))
            .setFooter(guild.name)
            .setTimestamp()

        message.reply({ embeds: [infoEmbed] })
    }
}