const { Permissions, MessageActionRow, MessageButton } = require('discord.js');
// const whitelistInteraction = require('../../interactions/whitelistInteraction');

module.exports = {
    name: 'wl_manual',
    description: 'Inicia o processo de whitelist.',
    aliases: ["wl-manu"],

    async execute(interaction) {
        // Enviar a mensagem de início da whitelist com o botão
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('start_whitelist_manual')
                    .setLabel('Iniciar Whitelist Manual')
                    .setStyle('PRIMARY')
            );

        await interaction.channel.send({ content: 'Clique no botão para iniciar a Whitelist.', components: [row] });
    },
};
