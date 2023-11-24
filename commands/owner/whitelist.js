const { Permissions, MessageActionRow, MessageButton } = require('discord.js');
// const whitelistInteraction = require('../../interactions/whitelist_modules/whitelistInteraction');

module.exports = {
    name: 'whitelist',
    description: 'Inicia o processo de whitelist.',
    aliases: ["wl"],

    async execute(interaction) {
        // Enviar a mensagem de início da whitelist com o botão
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('start_whitelist_auto')
                    .setLabel('Iniciar Whitelist')
                    .setStyle('PRIMARY')
            );

        await interaction.channel.send({ content: 'Clique no botão para iniciar a Whitelist.', components: [row] });
    },
};
