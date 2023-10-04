const { MessageEmbed, MessageActionRow, MessageButton, Permissions, MessageSelectMenu } = require('discord.js');
const emojis = require('../../utils/emojis');
const db = require('../../database/index')

module.exports = async (interaction, client) => {

    const selectedValue = interaction.values[0];

    if (selectedValue === 'conf-wl') {

        let embed = new MessageEmbed()

            .setTitle("Configuração Geral")
            .setDescription(`${interaction.user}, configure as funções existentes no bot.`)
            .addField('Categorias: ', `??/??`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .setColor("BLUE")
            .setFooter(interaction.guild.name, interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .setTimestamp()

        const configButton = new MessageActionRow()

            .addComponents(
                new MessageButton()
                    .setCustomId(`conf-wl-questions`)
                    .setLabel('Configurar perguntas')
                    .setStyle('SECONDARY'),

                new MessageButton()
                    .setCustomId(`conf-wl-answers`)
                    .setLabel('Configurar respostas')
                    .setStyle('SECONDARY'),

                new MessageButton()
                    .setCustomId(`conf-wl-minimum`)
                    .setLabel('Configurar mínimo de acertos')
                    .setStyle('SECONDARY'),
            );

        interaction.editReply({ embeds: [embed], components: [configButton], content: null })
    }

    const questions = await db.query(`SELECT * FROM whitelists WHERE serverId='${interaction.guild.id}'`);
    const prefix = questions?.[0]?.prefix || config.prefix

    if (interaction.customId.startsWith(`conf-wl-questions`)) {

        let embedPerguntas = new MessageEmbed()

        .setTitle("Configuração perguntas whitelist")
        .setDescription(`${interaction.user}, aqui neste painel você pode definir suas perguntas para a whitelist do seu servidor.`)
        .addField('Perguntas: ', `${questions.leght}/10`)
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        .setColor("BLUE")
        .setFooter(interaction.guild.name, interaction.guild.iconURL({ dynamic: true, size: 1024 }))
        .setTimestamp()

    }

}