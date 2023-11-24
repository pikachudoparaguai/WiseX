const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');
const config = require('../../config.json');

module.exports = {
    name: 'pagamento',
    description: 'Adquira o vip no servidor.',
    aliases: ['comprarvip', 'vips', 'buyvip', 'loja', 'shop'],

    // Função para executar o comando
    async execute(interaction, client) {

        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {

            return message.reply(`<@${interaction.user.id}>, você não tem acesso neste comando, é necessário permissão de **Gerenciar Servidor**.`)
        }

        const criarMensagemLoja = new MessageActionRow()

            .addComponents(
                new MessageButton()
                    .setCustomId('openStore')
                    .setLabel('Abrir loja')
                    .setStyle('SUCCESS'),

                // new MessageButton()
                //     .setLabel('Ler termos')
                //     .setURL('https://wisexbot.site/terms')
                //     .setStyle('LINK'),
            );

        const embedInicial = new MessageEmbed()

            .setTitle(`Loja de ${interaction.guild.name}`)
            .setDescription(`Seja bem-vindo(a) ao menu de loja do servidor **${interaction.guild.name}**, clique no botão abaixo para adentrar na loja do servidor!`)
            .setColor("GREEN")
            .setFooter(interaction.guild.name)
           // .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
            .setTimestamp()

            await interaction.reply({ embeds: [embedInicial], components: [criarMensagemLoja] })//.then(async continuePayment => {

            // const filter = (i) => i.user.id === interaction.author.id;
            // const collector = continuePayment.createMessageComponentCollector({ filter: filter, max: 1 });

            // collector.on('collect', async i => {
            //     if (i.user.id != interaction.author.id) return;

            //     if (i.customId == "addCoins") {

            //         await interaction.editReply({ content: 'Sa porra acho q vai', ephemeral: true })


                    /*const donationUtils = require("../../utils/donations");

                    let valor = 1;

                    const donationReference = await donationUtils.createReference();
                    const donationURL = await donationUtils.createDonationURL(interaction.user.id, donationReference, message.guild.id, valor)

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

                        .setTitle("Adquirir plano Premium")
                        .setDescription(`<@${interaction.user.id}>, você concordou com nossos [Termos de Uso](https://fivelist.site/termos.pdf) com sucesso!\n\nPara finalizar a compra do Premium de **${message.guild.name}**, clique no botão abaixo "Pagar Agora", após o pagamento ser aprovado será enviado uma mensagem no seu privado e os comandos exclusivos serão desbloqueados.`)
                        .setColor("GREEN")
                        .setFooter(message.guild.name)
                        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 1024 }))
                        .setTimestamp()

                    i.editReply({ embeds: [continuePaymentEmbed], components: [concluirCompraRow] })*/
                //}
          //  })
        //})
    },
}