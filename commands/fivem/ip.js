const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const emojis = require('../../utils/emojis.js');
const db = require("../../database/index")
const config = require('../../config.json');
const fetch = require("node-fetch");
const fivem = require("discord-fivem-api");
const links = require('../../utils/links.js');

module.exports = {
    name: 'ip',
    description: 'Exibe informações sobre o servidor.',
    aliases: ['status'],

    async execute(message, client, args) {

        const [existPrefix] = await db.query(`SELECT * FROM Prefixes WHERE serverId='${message.guild.id}'`);
        const prefixo = existPrefix?.[0]?.prefix || config.prefix;

        /*const [existServer, serverMetadata] = await db.query(`select * from ipservidors where serverId='${message.guild.id}'`);
        const ipRequest = existServer[0];

        const ipservidor = ipRequest?.ip;*/

        let ipservidor = "cfx.re/join/x64xox"

        if (!ipservidor) {

            return message.reply(`**${message.author}, o ip do servidor ainda não foi definido! Use:** \`${prefixo}config-ip \` **para definir o ip do servidor.**`)

        } else {

            const loadingRow = new MessageActionRow()

                .addComponents(
                    new MessageButton()
                        .setCustomId('loadingIPRow')
                        .setLabel(`Carregando...`)
                        .setDisabled()
                        .setStyle('PRIMARY')
                )

            message.reply({ content: `${emojis.name.loading} **|** ${message.author}, estou coletando informações do servidor...`, components: [loadingRow] }).then(async msg => {

                if (ipservidor.startsWith("cfx.re/join/")) {

                    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
                    var req = new XMLHttpRequest();

                    req.open('GET', "https://" + ipservidor, false)
                    req.send()
                    var headers = req.getResponseHeader('x-citizenfx-url')
                    if (!headers) { return catchError() }

                    rep_one = headers.replace("http://", "")
                    rep_two = rep_one.replace("cfx.re/", "")
                    rep_three = rep_two.replace("join", "")
                    rep_done = rep_three.replace("/", "")

                    const serverCfxOff = new fivem.DiscordFivemApi(rep_done);

                    if (!serverCfxOff) {

                        const rowServerOffline = new MessageActionRow()

                            .addComponents(
                                new MessageButton()
                                    .setCustomId('serverOffline')
                                    .setLabel('Servidor Offline!')
                                    .setDisabled()
                                    .setStyle('DANGER')
                            )

                        const serverOff = new MessageEmbed()

                            .setTitle(`${emojis.name.config} | Servidor offline`)
                            .setDescription(`O servidor está offline. Verifique a ortografia do ip:\`${ipservidor}\` caso o ip esteja correto entre em contato com a desenvolvedora do bot por nosso [discord de suporte](${links.discord}).`)
                            .setTimestamp()
                            .setColor("RED")
                            .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true, size: 1024 }))

                        return msg.edit({ embeds: [serverOff], components: [rowServerOffline] })

                    }

                    const jsonfivem = await fetch(headers + "info.json").catch(err => {

                        return msg.edit(`${message.author}, ocorreu um erro ao coletar os dados do servidor, tente novamente.`)
                    })
                    const responsefivem = await jsonfivem.json().catch(err => {

                        return msg.edit(`${message.author}, ocorreu um erro ao coletar os dados do servidor, tente novamente.`)
                    })

                    const rowOnline = new MessageActionRow()

                        .addComponents(
                            new MessageButton()
                                .setCustomId('serverOnline')
                                .setLabel('Servidor Online!')
                                .setDisabled()
                                .setStyle('SUCCESS')
                        )

                    let server2 = new fivem.DiscordFivemApi(rep_done)

                    const playersOn2 = await server2.getPlayersOnline()

                    const embed = new MessageEmbed()

                        .setTitle(`${responsefivem.vars.sv_projectName}`)
                        .setDescription(responsefivem.vars.sv_projectDesc)
                        .addField(`> __**Status:**__`, `**\`\`\`yaml\nONLINE \`\`\`**`, true)
                        .addField(`> __**Jogadores:**__ `, `**\`\`\`yaml\n${playersOn2}/${responsefivem.vars.sv_maxClients}\`\`\`**`, true)
                        .addField(`> __**IP de Conexão:**__`, `**\`\`\`fix\n${ipservidor}\`\`\`**`)
                        .addField(`> __**Tags:**__`, `**\`\`\`${responsefivem.vars.tags}\`\`\`**`)
                        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 1024 }))
                        .setImage(responsefivem.vars.banner_connecting)
                        .setColor("BLUE")
                        .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true, size: 1024 }))
                        .setTimestamp()

                    return msg.edit({ embeds: [embed], components: [rowOnline], content: null });
                }

                if (isNaN(ipservidor)) {

                    let server = new fivem.DiscordFivemApi(ipservidor)

                    const playersOn = await server.getPlayersOnline()
                    const playersMax = await server.getMaxPlayers()
                    const serverTags = await server.getServerTags()
                    const serverBanner = await server.getServerBanner()
                    const serverDesc = await server.getServerDesciption()
                    const serverName = await server.getServerName()

                    if (server.getServerStatus = "online") {

                        const rowOnline2 = new MessageActionRow()

                            .addComponents(
                                new MessageButton()
                                    .setCustomId('serverOnline')
                                    .setLabel('Servidor Online!')
                                    .setDisabled()
                                    .setStyle('SUCCESS')
                            )

                        const serverOn = new MessageEmbed()

                            .setTitle(`${serverName}`)
                            .setDescription(serverDesc)
                            .addField(`> __**Status:**__`, `**\`\`\`yaml\nONLINE \`\`\`**`, true)
                            .addField(`> __**Jogadores:**__ `, `**\`\`\`yaml\n${playersOn}/${playersMax}\`\`\`**`, true)
                            .addField(`> __**IP de Conexão:**__`, `**\`\`\`fix\n${ipservidor}\`\`\`**`)
                            .addField(`> __**Tags:**__`, `**\`\`\`${serverTags}\`\`\`**`)
                            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 1024 }))
                            .setImage(serverBanner)
                            .setColor("BLUE")
                            .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true, size: 1024 }))
                            .setTimestamp()

                        return msg.edit({ embeds: [serverOn], components: [rowOnline2] })

                    } else {

                        const rowServerOffline2 = new MessageActionRow()

                            .addComponents(
                                new MessageButton()
                                    .setCustomId('serverOffline')
                                    .setLabel('Servidor Offline!')
                                    .setDisabled()
                                    .setStyle('DANGER')
                            )

                        const serverOff = new MessageEmbed()

                            .setTitle(`${emojis.name.config} | Servidor offline`)
                            .setDescription(`O servidor está offline. Verifique a ortografia do ip:\`${ipservidor}\` caso o ip esteja correto entre em contato com a desenvolvedora do bot por nosso [discord de suporte](${links.discord}).`)
                            .setTimestamp()
                            .setColor("RED")
                            .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true, size: 1024 }))

                        return msg.edit({ embeds: [serverOff], components: [rowServerOffline2] })

                    }
                }
            })
        }

        function catchError() {

            const rowOffline = new MessageActionRow()

                .addComponents(
                    new MessageButton()
                        .setCustomId('serverOffline')
                        .setLabel('Servidor Offline!')
                        .setDisabled()
                        .setStyle('DANGER')
                )

            const embed = new MessageEmbed()

                .setTitle(`${emojis.name.config} | Servidor offline`)
                .setDescription(`O servidor está offline. Verifique a ortografia do ip:\`${ipservidor}\` caso o ip esteja correto entre em contato com a desenvolvedora do bot por nosso [discord de suporte](${links.discord}).`)
                .setTimestamp()
                .setColor("RED")
                .setFooter(message.guild.name, message.guild.iconURL({ dynamic: true, size: 1024 }))

            return msg.edit({ embeds: [embed], components: [rowOffline], content: null });
        }
    }
}