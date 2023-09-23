const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const emojis = require('../../utils/emojis.js');
const db = require("../../database/index")
const config = require('../../config.json');
const links = require('../../utils/links.js');
const axios = require('axios');
const sequelize = require('../../database/index');

const databaseIp = require('../../database/models/serverip.js');

module.exports = {
    name: 'ip',
    description: 'Exibe informações sobre o servidor.',
    aliases: ['status'],

    async execute(message, client, args) {

        const [existPrefix] = await db.query(`SELECT * FROM Prefixos WHERE serverId='${message.guild.id}'`);
        const prefix = existPrefix?.[0]?.prefix || config.prefix

        const [existIp] = await db.query(`SELECT * FROM ServerIps WHERE serverId='${message.guild.id}'`);

        let ip = args[0];

        if (ip.startsWith("cfx.re/join/")) {
            axios.get(`https://${ip}`)
                .then(async (response) => {
                    const headers = response.headers['x-citizenfx-url'];
                    const rep_one = headers.replace('http://', '');
                    const rep_two = rep_one.replace(':30120', '');
                    const rep_done = rep_two.replace('/', '');
                    console.log('IP EXTRACTED: ' + rep_done);

                    if (existIp[0]) {
                        await sequelize.query(`UPDATE ServerIps SET Ip = '${rep_done}' WHERE serverId='${message.guild.id}'`)
                    } else {
                        await databaseIp.create({
                            serverId: message.guild.id,
                            Ip: rep_done,
                        });
                    }

                }).catch((error) => {
                    console.error(error);
                    return message.reply('ocorreu um erro :/');
                });
            return;
        }

        if (ip.includes(".") || ip.includes(":")) {

            if (existIp[0]) {

                await sequelize.query(`UPDATE ServerIps SET Ip = '${ip}' WHERE serverId='${message.guild.id}'`)

            } else {
                await databaseIp.create({
                    serverId: message.guild.id,
                    Ip: ip,
                });
            }
        }
    }
}
