const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const emojis = require('../../utils/emojis');

module.exports = async (interaction, client) => {

    if (interaction.customId === 'start_whitelist_manual') {
        const confirmEmbed = new MessageEmbed()
            .setTitle('Confirmação para Iniciar a Whitelist')
            .setDescription('Clique no botão "INICIAR" abaixo para começar o processo de Whitelist.')
            .setColor('WHITE')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }));

        const startButton = new MessageButton()
            .setCustomId('confirm_whitelist_manual')
            .setLabel('INICIAR')
            .setStyle('SUCCESS');

        const row = new MessageActionRow().addComponents(startButton);

        await interaction.followUp({ embeds: [confirmEmbed], ephemeral: true, components: [row] });
    }

    if (interaction.customId === 'confirm_whitelist_manual') {
        // Aqui começa o processo de envio das perguntas e coleta de respostas

        const questions = [
            {
                text: 'Qual o nome do personagem?',
                type: 'open'
            },
            {
                text: 'Qual é o seu id?',
                type: 'open'
            },
            {
                text: 'O que é VDM?',
                type: 'open'
            },
            {
                text: 'O que é RDM?',
                type: 'open'
            },
            {
                text: 'O que é Anti-RP?',
                type: 'open'
            },
            {
                text: 'O que é MetaGaming?',
                type: 'open'
            },
            {
                text: 'O que é Amor-a-vida?',
                type: 'open'
            },
        ];

        function createEmbedWithQuestion(question) {
            const embed = new MessageEmbed()
                .setTitle(`> ${emojis.name.right_arrow} **${question.text}**\n\n`)
                .setAuthor(interaction.guild.name)
                .setDescription(`Você tem 2 minutos para responder esta pergunta! \nFaça com calma e atenção, caso reprove no formulário terá de **refaze-lo novamente!** \n\n\`Apenas você consegue ver essa mensagem!\` `)
                .setColor('WHITE')
                .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }));

            if (question.type === 'choice') {
                const optionsText = question.options.map((option, index) => `${index + 1}. ${option}`).join('\n');
                embed.addField('Opções', optionsText);
            }

            return embed;
        }

        const userResponses = {};
        const userId = interaction.user.id;

        userResponses[userId] = {
            channel: interaction.channel.id,
            index: 0,
            answers: {},
            score: 0,
            questionMessage: null
        };

        const userChannel = await interaction.guild.channels.cache.get(userResponses[userId].channel);

        const filter = (response) => response.author.id === userId;
        const collector = userChannel.createMessageCollector({ filter, time: 120000 });

        const sendQuestion = async (question) => {
            const embed = createEmbedWithQuestion(question);
            if (userResponses[userId].questionMessage) {
                try {
                    await interaction.editReply({ embeds: [embed], components: [], ephemeral: true });
                } catch (error) {
                    console.log("Erro ao editar a mensagem:", error.message);
                }
            } else {
                userResponses[userId].questionMessage = await interaction.editReply({ embeds: [embed], components: [], ephemeral: true });
            }
        };

        collector.on('collect', async (response) => {
            const currentIndex = userResponses[userId].index;

            userResponses[userId].answers[currentIndex] = response.content;

            userResponses[userId].index++;

            if (userResponses[userId].index < questions.length) {
                const nextQuestion = questions[userResponses[userId].index];
                await sendQuestion(nextQuestion);
                response.delete();
            } else {
                collector.stop();

                const embedFinal = new MessageEmbed()
                    .setTitle(`> ${emojis.name.right_arrow} **formulário de whitelist finalizado!**\n\n`)
                    .setAuthor(interaction.guild.name)
                    .setDescription(`Seu formulário já foi enviado para a equipe staff, em pouco tempo você já poderá se conectar ao servidor. \n\n> **Veja suas respostas de acordo com cada pergunta:**`)
                    .setColor('GREEN')
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }));

                for (let i = 0; i < questions.length; i++) {
                    const question = questions[i];
                    const answer = userResponses[userId].answers[i];
                    const questionCounter = i + 1;

                    embedFinal.addField(`${questionCounter} - ${question.text}`, ` \`\`\`fix\n${answer} \`\`\``, true);
                }

                userResponses[userId].questionMessage = await interaction.editReply({ embeds: [embedFinal], components: [], ephemeral: true });

                const canalAprovacaoAdm = client.channels.cache.get('788203261475684362');

                const embedAprovar = new MessageEmbed()
                    .setTitle('Análise de formulário.')
                    .setDescription(`Avalie o formulário abaixo e verifique se o player poderá ou não entrar no servidor.\n\n> **Formulário de: <@${interaction.user.id}>** \n\n${emojis.name.right_arrow} **Aprove** o player clicando: \`APROVAR\` \n${emojis.name.right_arrow} **Reprove** o player clicando: \`REPROVAR\``)
                    .setColor('WHITE')
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
                    .setTimestamp();

                for (let i = 0; i < questions.length; i++) {
                    const question = questions[i];
                    const answer = userResponses[userId].answers[i];
                    const questionCounter = i + 1;

                    embedAprovar.addField(`${questionCounter} - ${question.text}`, `\`\`\`fix\n${answer} \`\`\``, true);
                }

                const aprovarButton = new MessageActionRow()

                    .addComponents(
                        new MessageButton()
                            .setCustomId(`aprovar_player_button:${interaction.user.id}`)
                            .setLabel('Aprovar')
                            .setStyle('SUCCESS'),

                        new MessageButton()
                            .setCustomId(`reprovar_player_button:${interaction.user.id}`)
                            .setLabel('Reprovar')
                            .setStyle('DANGER'),
                    );

                canalAprovacaoAdm.send({ embeds: [embedAprovar], components: [aprovarButton], content: null });

                // Testar o que está coletando de repostas
                console.log(userResponses[userId].answers);

                response.delete();

            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                interaction.editReply('Tempo esgotado para responder ao formulário.');
            }
        });

        await sendQuestion(questions[0]);
    }

    if (interaction.customId.startsWith(`aprovar_player_button:`)) {

        let split = interaction.customId.split(":")
        let idPlayer = split[1]

        let userAproved = await client.users.fetch(idPlayer);
        // console.log(userAproved)

        const aprovadoButton = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`aprovado_button`)
                    .setLabel('Aprovado')
                    .setStyle('SUCCESS')
                    .setDisabled(),
            )

        const embedAprovada = new MessageEmbed()
            .setTitle(`Resultado whitelist ${interaction.guild.name}`)
            .setDescription(`O formulário foi **aprovado** com sucesso, e o jogador <@${idPlayer}> está apto para conectar na cidade. Boa jogatina \n\n**Leia as regras da cidade para evitar futuras punições!!**`)
            .addField(`> Membro:`, `<@${idPlayer}>`, true)
            .addField(`> Aprovador:`, `<@${interaction.user.id}>`, true)
            .setColor('GREEN')
            .setThumbnail(userAproved.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }))
            .setTimestamp();

        userAproved.send({ embeds: [embedAprovada], content: `<@${idPlayer}>, você foi aprovado no formulário de **${interaction.guild.name}**!` }).catch(errsend => { return; })

        return interaction.editReply({ embeds: [embedAprovada], components: [aprovadoButton], content: `<@${idPlayer}>` })

    }

    if (interaction.customId.startsWith(`reprovar_player_button:`)) {

        let split = interaction.customId.split(":")
        let idPlayer = split[1]

        let userReproved = await client.users.fetch(idPlayer);

        const reprovadoButton = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`reprovado_button`)
                    .setLabel('Aprovado')
                    .setStyle('DANGER')
                    .setDisabled(),
            )

        const embedReprovada = new MessageEmbed()
            .setTitle(`Resultado whitelist ${interaction.guild.name}`)
            .setDescription(`O formulário foi **reprovado**, e o jogador terá que refazer o formulário novamente!`)
            .addField(`> Membro:`, `<@${idPlayer}>`, true)
            .addField(`> Aprovador:`, `<@${interaction.user.id}>`, true)
            .setColor('RED')
            .setThumbnail(userReproved.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }))
            .setTimestamp();

        userReproved.send({ embeds: [embedReprovada], content: `<@${idPlayer}>, você foi reprovado no formulário de **${interaction.guild.name}**!` }).catch(errsend => { return; })

        return interaction.editReply({ embeds: [embedReprovada], components: [reprovadoButton], content: `<@${idPlayer}>` })


    }
};
