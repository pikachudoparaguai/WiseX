const { MessageEmbed, MessageActionRow, MessageButton, Permissions, MessageSelectMenu } = require('discord.js');
const axios = require('axios');
const config = require('../../config.json');
const sequelize = require('../../database/index');
const db = require('../../database/index');

const emojis = require('../../utils/emojis');

module.exports = {
    name: "config-geral",
    description: "Configure todos os sistemas do bot.",
    aliases: ["config-g", "config-all", "c-geral", "c-all"],

    async execute(message, client, args) {

        const [existPrefix] = await db.query(`SELECT * FROM Prefixos WHERE serverId='${message.guild.id}'`);
        const prefix = existPrefix?.[0]?.prefix || config.prefix

        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {

            const embedSemPerm = new MessageEmbed()
                .setDescription(`${message.author}, você não possui permissão suficiente para utilizar esse comando!`)

            return message.reply({ embeds: embedSemPerm })
        }


        let embedConfig = new MessageEmbed()

            .setTitle("Configuração Geral")
            .setDescription(`${message.author}, configure as funções existentes no bot.`)
            .addField('Categorias: ', `??/??`)
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 1024 }))
            .setColor("BLUE")
            .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true, size: 1024 }))
            .setTimestamp()

        message.reply({

            embeds: [embedConfig], components: [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId("config-select")
                        .setPlaceholder("Nenhuma categoria selecionada.")
                        .addOptions([
                            {
                                label: 'Configurar Whitelist',
                                value: 'conf-wl',
                            },
                            {
                                label: 'Configurar Ip de Conexão',
                                value: 'conf-ip',
                            },
                            {
                                label: 'Configurar Loja Virtual',
                                value: 'conf-loja',
                            },
                        ])
                ),
            ]
        })
    }
}