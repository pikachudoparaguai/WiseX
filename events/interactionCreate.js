const { MessageButton, MessageActionRow, Modal, TextInputComponent } = require('discord.js');

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

                const whitelistAutoInteractionAprovar = require('../interactions/whitelist_modules/whitelist_Manual');
                whitelistAutoInteractionAprovar(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`start_point`)) {
                const baterPontoInteraction = require('../interactions/baterponto_modules/baterponto');
                baterPontoInteraction(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`finish_point`)) {
                const baterPontoFinalInteraction = require('../interactions/baterponto_modules/baterponto');
                baterPontoFinalInteraction(interaction, client)
            }

            return;
        }

        if (interaction.isModalSubmit()) { // se for modal ponha aqui

            await interaction.deferUpdate()

        }

        if (interaction.isSelectMenu()) { // Se for aqueles menu por seleção ponha aqui

            await interaction.deferUpdate()

        }
    },
};
