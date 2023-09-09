const { MessageEmbed } = require('discord.js');
const db = require('../../database/index.js');
const config = require('../../config.json');

module.exports = {
    name: "globalBan",
    aliases: ['gban'],


    async execute(message, client, args) {

        const [existPrefix] = await db.query(`SELECT * FROM Prefixes WHERE serverId='${message.guild.id}'`);
        const prefix = existPrefix?.[0]?.prefix || config.prefix;

        if (message.author.id === "318726904989351946") {

            let member = message.mentions.members.first()
            if(!member) return message.reply('Precisa marcar alguem, seu cavalo.')

            if(member.id === "318726904989351946") return message.reply('Não é possivel banir o davizeira..')

            let reasonGlobalBan = args.slice(1).join(' ')
            if(!reasonGlobalBan) { 
                reasonGlobalBan = "Não obedeceu as regrinhas do bot!"
             }

            
        } else {

            message.reply('Sem permissão para o comando!')
        }

    }
}