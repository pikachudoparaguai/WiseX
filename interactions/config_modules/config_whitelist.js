const { MessageEmbed, MessageActionRow, MessageButton, TextInputComponent, Modal, Permissions, MessageSelectMenu } = require('discord.js');
const emojis = require('../../utils/emojis');
const db = require('../../database/index')

const Question = require('../../database/models/questionsWhitelist');

module.exports = async (interaction, client) => {

    // Verifique se a interação tem valores definidos
    if (interaction.values && interaction.values.length > 0) {
        const selectedValue = interaction.values[0];

        if (selectedValue === 'conf-wl') {

            let embed = new MessageEmbed()

                .setTitle("Configuração Geral")
                .setDescription(`${interaction.user}, configure as funções existentes no bot.`)
                .addField('Categorias: ', `??/??`)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
                .setColor("BLUE")
                .setFooter(interaction.guild.name, interaction.guild.iconURL({ dynamic: true, size: 1024 }))
                .setTimestamp()

            const configButton = new MessageActionRow()

                .addComponents(
                    new MessageButton()
                        .setCustomId(`conf-wl-questions`)
                        .setLabel('Configurar perguntas')
                        .setStyle('SECONDARY'),

                    new MessageButton()
                        .setCustomId(`conf-wl-answers`)
                        .setLabel('Configurar respostas')
                        .setStyle('SECONDARY'),

                    new MessageButton()
                        .setCustomId(`conf-wl-minimum`)
                        .setLabel('Configurar mínimo de acertos')
                        .setStyle('SECONDARY'),
                );

            interaction.editReply({ embeds: [embed], components: [configButton], content: null })

        }
    }

    const questions = await db.query(`SELECT * FROM whitelists WHERE serverId='${interaction.guild.id}'`);
    const questionPull = questions?.[0]

    if (interaction.customId.startsWith(`conf-wl-questions`)) {

        const serverId = interaction.guild.id;

        // Recupere todas as perguntas da tabela para o servidor específico
        const questions = await Question.findAll({
            where: { serverId },
        });

        const questionCount = questions.length;
        const hasQuestions = questionCount > 0;

        // Crie a mensagem interativa com botões
        const buttons = [
            {
                type: 'BUTTON',
                style: 'PRIMARY',
                customId: 'addQuestion',
                label: 'Adicionar Pergunta',
            },
            {
                type: 'BUTTON',
                style: 'DANGER',
                customId: 'removeQuestion',
                label: 'Remover Pergunta',
                disabled: !hasQuestions,
            },
        ];

        const messageOptions = {
            embeds: [
                new MessageEmbed()
                    .setTitle('Configuração perguntas whitelist')
                    .setDescription(`${interaction.user}, aqui neste painel você pode definir suas perguntas para a whitelist do seu servidor.`)
                    .addField('Perguntas:', `${questionCount}/10`)
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
                    .setColor('BLUE')
                    .setFooter(interaction.guild.name, interaction.guild.iconURL({ dynamic: true, size: 1024 }))
                    .setTimestamp(),
            ],
            components: [new MessageActionRow().addComponents(buttons)],
        };
        await interaction.editReply(messageOptions);
    }

    if (interaction.customId.startsWith(`'addQuestion'`)) {

        const modal = new Modal() // We create a Modal
            .setCustomId('whitelistQuestionModal')
            .setTitle('Adicionar perguntas da whitelist')

        const definirPergunta = new TextInputComponent()
            .setCustomId('questionModal')
            .setLabel('Pergunta')
            .setStyle('LONG')
            .setPlaceholder('Coloque sua pergunta aqui.')
            .setMinLength(1)
            .setMaxLength(250)
            .setRequired(true)

        const definirResposta1 = new TextInputComponent()
            .setCustomId('answerQuestion1')
            .setLabel('Resposta 1')
            .setStyle('SHORT')
            .setPlaceholder('Coloque uma resposta da pergunta aqui.')
            .setMinLength(1)
            .setMaxLength(150)
            .setRequired(true)

        const definirResposta2 = new TextInputComponent()
            .setCustomId('answerQuestion2')
            .setLabel('Resposta 2')
            .setStyle('SHORT')
            .setPlaceholder('Coloque uma resposta da pergunta aqui.')
            .setMinLength(1)
            .setMaxLength(150)
            .setRequired(true)

        const definirResposta3 = new TextInputComponent()
            .setCustomId('answerQuestion3')
            .setLabel('Resposta 3')
            .setStyle('SHORT')
            .setPlaceholder('Coloque uma resposta da pergunta aqui.')
            .setRequired(false)

        const definirResposta4 = new TextInputComponent()
            .setCustomId('answerQuestion4')
            .setLabel('Resposta 4')
            .setStyle('SHORT')
            .setPlaceholder('Coloque uma resposta da pergunta aqui.')
            .setRequired(false)

        const perguntaActionRow = new MessageActionRow().addComponents(definirPergunta);
        const resposta1ActionRow = new MessageActionRow().addComponents(definirResposta1);
        const resposta2ActionRow = new MessageActionRow().addComponents(definirResposta2);
        const resposta3ActionRow = new MessageActionRow().addComponents(definirResposta3);
        const resposta4ActionRow = new MessageActionRow().addComponents(definirResposta4);

        modal.addComponents(perguntaActionRow, resposta1ActionRow, resposta2ActionRow, resposta3ActionRow, resposta4ActionRow);
        await interaction.showModal(modal);

    } else if (interaction.customId.startsWith(`'removeQuestion'`)) {

        async function handleInteraction(interaction) {
            if (interaction.isModalSubmit()) {
                const questions = interaction.components.filter(c => c.components[0].customId.startsWith('answerQuestion'));
                const responses = [];
                for (const question of questions) {
                    responses.push(question.components[0].value);
                }
        
                const index = interaction.customId.slice(-1);
                const removedQuestion = await db.removeQuestion(index);
                const embed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('Questão removida')
                    .setDescription(`${removedQuestion.question}\n\nRespostas: ${responses.join(', ')}`)
                    .setTimestamp();
                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else if (interaction.customId.startsWith('removeQuestion')) {
                const index = interaction.customId.slice(-1);
                const question = await db.getQuestion(index);
                const modal = new Modal()
                    .setTitle('Remover Questão')
                    .setCustomId('confirmRemoveQuestion')
                    .setSubmitText('Remover');
        
                const questionComponent = new TextInputComponent()
                    .setCustomId('removedQuestion')
                    .setLabel('Questão')
                    .setStyle('LONG')
                    .setValue(question.question)
                    .setDisabled(true);
        
                const answers = question.answers.map((answer, i) => new TextInputComponent()
                    .setCustomId(`removedAnswer${i + 1}`)
                    .setLabel(`Resposta ${i + 1}`)
                    .setStyle('SHORT')
                    .setValue(answer)
                    .setDisabled(true));
        
                const actionRows = [
                    new MessageActionRow().addComponents(questionComponent),
                    ...answers.map((answer, i) => new MessageActionRow().addComponents(answer))
                ];
        
                actionRows.forEach(row => modal.addComponents(row));
                await interaction.showModal(modal);
            }
        }
    }

}