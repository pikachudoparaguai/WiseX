const { Permissions, MessageEmbed } = require("discord.js");
const ms = require("ms");
const db = require('../../database/index.js');
const config = require('../../config.json');
const emoji = require("../../utils/emojis");

module.exports = {
    name: "timeout",
    description: "Proiba um player de falar em seu servidor temporariamente.",
    aliases: ["mute", "mutar"],

    async execute(message, client, args) {

        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply(`${message.author}, você não tem permissão para executar este comando.`)

        const [existPrefix] = await db.query(`SELECT * FROM Prefixes WHERE serverId='${message.guild.id}'`);
        const prefix = existPrefix?.[0]?.prefix || config.prefix;

        let member = message.mentions.members.first();
        if (!member) return message.reply(`${message.author}, você deve informar o **usúario**. ${prefix}timeout @Usúario 28d Motivo **[Máximo 28 dias]**`)

        if (member == message.member) return message.reply(`${message.author}, você não pode se punir.`)
        if (!member.bannable) return message.reply(`${message.author}, eu não posso punir um usúario com o cargo maior que o meu.`)

        let MuteTime = args[1]
        if (!MuteTime) return message.reply(`${message.author}, você deve inserir o tempo de punição do usúario. **${prefix}timeout @Usúario 28m Motivo [Máximo 28 dias]**`)

        let MuteReason = args.slice(2).join(' ');
        if (!MuteReason) {
            MuteReason = "Motivo não fornecido"
        }

        if (ms(MuteTime) > 2419200000) return message.reply(`${message.author}, o tempo do timeout deve ser menor do que 28 dias.`)

        client.api.guilds(message.guild.id).members(member.id).patch({
            data: {
                communication_disabled_until: new Date(Date.now() + ms(MuteTime))
            },
            reason: MuteReason
        }).catch(async error => {
            return await message.reply(`${message.author}, ocorreu um erro ao tentar dar timeout no usúario.`)
        })

        const banEmbed = new MessageEmbed()

            .setTitle(`${emoji.name.punir} Um membro foi mutado temporariamente!`)
            .setDescription(`
    **Membro Mutado:**
    ${member}
    
    **Autor da Punição:**
    \`\`\`${message.author.username}#${message.author.discriminator} (${message.author.id})\`\`\`
    **Tempo da Punição:**
    \`\`\`${MuteTime}\`\`\`
    **Motivo da Punição:**
    \`\`\`${MuteReason}\`\`\`
    `)
            .setColor("RED")
            .setFooter(message.guild.name)
            .setTimestamp()

        message.reply({
            embeds: [banEmbed]
        })
    }
};