const { MessageEmbed, MessageButton, MessageActionRow, Modal, TextInputComponent, MessageSelectMenu } = require('discord.js');

const db = require('quick.db')

module.exports = {
    name: 'interactionCreate',
    once: false,

    async execute(interaction, client) {

        if (interaction.isButton()) { // Se for botao coloque aqui

            if (interaction.customId.startsWith(`addCoins`)) {

                const paymentsModule = require('../interactions/payments_modules/payment_finish');
                paymentsModule(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`start_whitelist_auto`)) {

                await interaction.deferUpdate()

                const whitelistInteraction = require('../interactions/whitelist_modules/whitelist_Automatica');
                whitelistInteraction(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`confirm_whitelist_auto`)) {

                await interaction.deferUpdate()

                const whitelistAutoInteraction = require('../interactions/whitelist_modules/whitelist_Automatica');
                whitelistAutoInteraction(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`start_whitelist_manual`)) {

                await interaction.deferUpdate()

                const whitelistAutoInteraction = require('../interactions/whitelist_modules/whitelist_Manual');
                whitelistAutoInteraction(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`confirm_whitelist_manual`)) {

                await interaction.deferUpdate()

                const whitelistAutoInteractionConfirm = require('../interactions/whitelist_modules/whitelist_Manual');
                whitelistAutoInteractionConfirm(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`aprovar_player_button:`)) {

                await interaction.deferUpdate()

                const whitelistAutoInteractionAprovar = require('../interactions/whitelist_modules/whitelist_Manual');
                whitelistAutoInteractionAprovar(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`reprovar_player_button:`)) {

                await interaction.deferUpdate()

                const whitelistAutoInteractionReprovar = require('../interactions/whitelist_modules/whitelist_Manual');
                whitelistAutoInteractionReprovar(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`conf-wl-questions`)) {

                await interaction.deferUpdate()

                const ConfigWlQuestionsButton = require('../interactions/config_modules/config_whitelist');
                ConfigWlQuestionsButton(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`addQuestion`)) {

                await interaction.deferUpdate()

                const ConfigWlAddQuestionsButton = require('../interactions/config_modules/config_whitelist');
                ConfigWlAddQuestionsButton(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`removeQuestion`)) {

                await interaction.deferUpdate()

                const ConfigWlRemoveQuestionsButton = require('../interactions/config_modules/config_whitelist');
                ConfigWlRemoveQuestionsButton(interaction, client)
            }

            ////////////////////////////////////////////////////////////////////

            if (interaction.customId.startsWith(`openStore`)) {

                await interaction.deferUpdate()

                const paymentsModule = require('../interactions/payments_modules/payment_finish');
                paymentsModule(interaction, client)
            }

            return;
        }

        if (interaction.isModalSubmit()) { // se for enviar modal ponha aqui

            if (interaction.customId.startsWith("addCoins")) {

                await interaction.deferUpdate()

                let montanteDesejado = await interaction.fields.getTextInputValue('quantidadeCoins')
               // console.log(montanteDesejado, 'coins')

               if (isNaN(montanteDesejado)){ 
                return interaction.followUp({ content: '*A quantidade inserida é inválida!* **Tente novamente usando apenas números** __*ex: 50*__', ephemeral: true })
               }


                // Criando o link de pagamento

                const donationUtils = require("../utils/donations");

                let valor = 1 * montanteDesejado;

                const donationReference = await donationUtils.createReference();
                const donationURL = await donationUtils.createDonationURL( interaction.user.username, donationReference, interaction.guild.name, valor)

                db.set(`payments.${donationReference}`, { user: interaction.user.id, authorId: interaction.user.id, value: valor, product: "Premium", status: "PENDING" })

                const concluirCompraRow = new MessageActionRow()

                    .addComponents(
                        new MessageButton()
                            .setLabel(`Pagar Agora`)
                            .setURL(donationURL)
                            .setStyle('LINK'),
                    )

                //const [existePremium] = await database.query(`select * from premiumplans where serverId='${message.guild.id}'`);

                let continuePaymentEmbed = new MessageEmbed()

                    .setTitle(`Link de pagamento ${interaction.guild.name}`)
                    .setDescription(`*Seu link de pagamento foi criado com sucesso!* \n\n**Quando seu pagamento for aprovado você receberá uma mensagem do bot no seu privado, caso esteja com ele desabilitado o bot não conseguirá alerta-lo!** \n\n__Clique no botão abaixo para finalizar o pagamento e deixe o resto com a gente.__`)
                    .addField('Quantidade:', `\`${montanteDesejado}\``, true)
                    .addField('Valor Unitário:', '\`R$ 1\`', true)
                    .addField('Total à pagar:', `\`R$ ${valor}\``, true)
                    .setColor("GREEN")
                    .setFooter(interaction.guild.name)
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
                    .setTimestamp()

                interaction.editReply({ embeds: [continuePaymentEmbed], components: [concluirCompraRow], ephemeral: true })

            }

        }


        if (interaction.isSelectMenu()) {
            await interaction.deferUpdate();

            // Recupere o valor selecionado
            // const selectedValue = interaction.values[0];

            if (interaction.values && interaction.values.length > 0) {
                const configWhitelist = require('../interactions/config_modules/config_whitelist');
                configWhitelist(interaction, client);
            }
        }
    },
};
