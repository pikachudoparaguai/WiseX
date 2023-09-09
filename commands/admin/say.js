const { Discord, Permissions } = require('discord.js');

module.exports = {
    name: "say",
    description: "Mande uma mensagem com o bot.",
    aliases: ["falar", "speak"],

    async execute(message, client, args) {

        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {

            return message.reply(`${message.author}, você não tem acesso para executar este comando.`)
        }

        let say = args.slice(0).join(' ');

        if (say.length < 1) return message.reply(`${message.author}, você deve digitar uma mensagem.`)
        if (say.length > 900) return message.reply(`${message.author}, você deve digitar uma mensagem com menos de 900 caracteres.`)
        message.channel.send(`${say} \n > Mensagem enviada por: ${message.author}`)

    }
}