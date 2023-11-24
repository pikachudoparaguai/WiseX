const { Permissions, MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent, MessageSelectMenu, IntegrationApplication } = require('discord.js');
const db = require('quick.db');
const config = require('../../config.json');


module.exports = async (interaction, client) => {

    if (interaction.customId == 'openStore') {

        const produtosLoja = new MessageActionRow()

            .addComponents(
                new MessageButton()
                    .setCustomId('addCoins')
                    .setLabel('Adquirir Coins')
                    .setStyle('SUCCESS'),

                new MessageButton()
                    .setLabel('Ler termos')
                    .setURL('https://wisexbot.site/terms')
                    .setStyle('LINK'),
            );

        const embedInicial = new MessageEmbed()

            .setTitle(`Loja de ${interaction.guild.name}`)
            .setDescription(`Seja bem-vindo(a) à loja do servidor **${interaction.guild.name}**, Use os botões abaixo para escolher o que deseja adquirir no servidor! \n\n**Leia os termos antes de fazer sua compra** \n__*Ao comprar algo você automaticamente concorda com nossos termos de uso e privacidade! \nVocê pode le-lô clicando no botão abaixo (Ler termos)*__`)
            .setColor("GREEN")
            .setFooter(interaction.guild.name)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .setTimestamp()

        await interaction.followUp({ embeds: [embedInicial], components: [produtosLoja], ephemeral: true })

    }

    if (interaction.customId == 'addCoins') {


        const modal = new Modal()
            .setCustomId(`addCoinss`)
            .setTitle('Adicionar Coins')

        const definirCoins = new TextInputComponent()
            .setCustomId('quantidadeCoins')
            .setLabel("📡 Quantidade de Coins")
            .setPlaceholder("📋 Coloque a quantidade que deseja adquirir")
            .setMinLength(1)
            .setMaxLength(4)
            .setRequired(true)
            .setStyle('SHORT')


        const quantiaCoins = new MessageActionRow().addComponents(definirCoins);
        modal.addComponents(quantiaCoins);

        await interaction.showModal(modal);
    }


        //await interaction.followUp({ content: 'testando 1, 2, 3...' })


        // const donationUtils = require("../../utils/donations");
    
        // let valor = 1;
    
        // const donationReference = await donationUtils.createReference();
        // const donationURL = await donationUtils.createDonationURL(interaction.user.id, donationReference, message.guild.id, valor)
    
        // db.set(`payments.${donationReference}`, { user: interaction.user.id, authorId: interaction.user.id, value: valor, product: "Premium", status: "PENDING" })
    
        // const concluirCompraRow = new MessageActionRow()
    
        //     .addComponents(
        //         new MessageButton()
        //             .setLabel(`Pagar Agora`)
        //             .setURL(donationURL)
        //             .setStyle('LINK'),
        //     )
    
        // //const [existePremium] = await database.query(`select * from premiumplans where serverId='${message.guild.id}'`);
    
        // let continuePaymentEmbed = new MessageEmbed()
    
        //     .setTitle("Adquirir plano Premium")
        //     .setDescription(`<@${interaction.user.id}>, você concordou com nossos [Termos de Uso](https://fivelist.site/termos.pdf) com sucesso!\n\nPara finalizar a compra do Premium de **${message.guild.name}**, clique no botão abaixo "Pagar Agora", após o pagamento ser aprovado será enviado uma mensagem no seu privado e os comandos exclusivos serão desbloqueados.`)
        //     .setColor("GREEN")
        //     .setFooter(message.guild.name)
        //     .setThumbnail(message.guild.iconURL({ dynamic: true, size: 1024 }))
        //     .setTimestamp()
    
        // i.editReply({ embeds: [continuePaymentEmbed], components: [concluirCompraRow] })
    
}