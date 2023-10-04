const { MessageButton, MessageActionRow, Modal, TextInputComponent, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    once: false,

    async execute(interaction, client) {

        if (interaction.isButton()) { // Se for botao coloque aqui

            await interaction.deferUpdate()

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`start_whitelist_auto`)) {

                const whitelistInteraction = require('../interactions/whitelist_modules/whitelist_Automatica');
                whitelistInteraction(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`confirm_whitelist_auto`)) {

                const whitelistAutoInteraction = require('../interactions/whitelist_modules/whitelist_Automatica');
                whitelistAutoInteraction(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`start_whitelist_manual`)) {

                const whitelistAutoInteraction = require('../interactions/whitelist_modules/whitelist_Manual');
                whitelistAutoInteraction(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`confirm_whitelist_manual`)) {

                const whitelistAutoInteractionConfirm = require('../interactions/whitelist_modules/whitelist_Manual');
                whitelistAutoInteractionConfirm(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`aprovar_player_button:`)) {

                const whitelistAutoInteractionAprovar = require('../interactions/whitelist_modules/whitelist_Manual');
                whitelistAutoInteractionAprovar(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`reprovar_player_button:`)) {

                const whitelistAutoInteractionReprovar = require('../interactions/whitelist_modules/whitelist_Manual');
                whitelistAutoInteractionReprovar(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`conf-wl-questions`)) {

                const ConfigWlQuestionsButton = require('../interactions/config_modules/config_whitelist');
                ConfigWlQuestionsButton(interaction, client)
            }

            return;
        }

        if (interaction.isModalSubmit()) { // se for modal ponha aqui

            await interaction.deferUpdate()

        }

        if (interaction.isSelectMenu()) {
            await interaction.deferUpdate();

            // Recupere o valor selecionado
            const selectedValue = interaction.values[0];

            if (selectedValue === 'conf-wl') {
                const configWhitelist = require('../interactions/config_modules/config_whitelist');
                configWhitelist(interaction, client);
            }
        }
    },
};
