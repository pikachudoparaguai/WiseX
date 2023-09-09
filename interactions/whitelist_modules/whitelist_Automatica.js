const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const emojis = require('../../utils/emojis');

module.exports = async (interaction, client) => {
    if (interaction.customId === 'start_whitelist_auto') {
        const confirmEmbed = new MessageEmbed()
            .setTitle('Confirmação para Iniciar a Whitelist')
            .setDescription('Clique no botão "INICIAR" abaixo para começar o processo de Whitelist.')
            .setColor('WHITE')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }));

        const startButton = new MessageButton()
            .setCustomId('confirm_whitelist_auto')
            .setLabel('INICIAR')
            .setStyle('SUCCESS');

        const row = new MessageActionRow().addComponents(startButton);

        await interaction.followUp({ embeds: [confirmEmbed], ephemeral: true, components: [row] });
    }

    if (interaction.customId === 'confirm_whitelist_auto') {
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
                type: 'choice',
                options: ['Usar Hack', 'Andar de bike', 'Usar veiculo como arma', 'Nao ter amor proprio'],
                correct: 2
            },
            {
                text: 'O que é RDM?',
                type: 'choice',
                options: ['Matar alguém sem motivo', 'Assaltar PM', 'Sair do personagem', 'Se passar por ADM'],
                correct: 0
            },
            {
                text: 'O que é Anti-RP?',
                type: 'choice',
                options: ['Matar alguém sem motivo', 'Assaltar PM', 'Sair do personagem', 'Se passar por ADM'],
                correct: 2
            },
            {
                text: 'O que é MetaGaming?',
                type: 'choice',
                options: ['Matar alguém sem motivo', 'Assaltar PM', 'Sair do personagem', 'Usar informações de fora do jogo.'],
                correct: 3
            },
            {
                text: 'O que é Amor-a-vida?',
                type: 'choice',
                options: ['Matar alguém sem motivo', 'Ter amor a sua vida(personagem)', 'Sair do personagem', 'Se passar por ADM'],
                correct: 1
            },
        ];

        let acertosMinimos = "5"

        function createEmbedWithQuestion(question) {
            const embed = new MessageEmbed()
                .setTitle(`> ${emojis.name.right_arrow} **${question.text}**\n\n`)
                .setAuthor(interaction.guild.name)
                .setDescription(`Você tem 2 minutos para responder esta pergunta! \nFaça com calma e atenção, caso reprove no formulário terá de **refaze-lo novamente!** `)
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
            const currentQuestion = questions[currentIndex];

            if (currentQuestion.type === 'choice') {
                const chosenOption = parseInt(response.content);
                if (chosenOption >= 1 && chosenOption <= currentQuestion.options.length) {
                    const isCorrect = chosenOption - 1 === currentQuestion.correct;
                    if (isCorrect) {
                        userResponses[userId].answers[currentIndex] = 'Resposta correta';
                        userResponses[userId].score = (userResponses[userId].score || 0) + 1;
                    } else {
                        userResponses[userId].answers[currentIndex] = 'Resposta incorreta';
                    }
                } else {
                    userResponses[userId].answers[currentIndex] = 'Resposta inválida';
                }
            } else {
                userResponses[userId].answers[currentIndex] = response.content;
            }

            userResponses[userId].index++;

            if (userResponses[userId].index < questions.length) {
                const nextQuestion = questions[userResponses[userId].index];
                await sendQuestion(nextQuestion);
                response.delete();
            } else {
                collector.stop();
                const choiceQuestionCount = countChoiceQuestions(questions);
                const totalScore = userResponses[userId].score || 0;

                if (totalScore >= acertosMinimos) {

                    const respostaPergunta1 = userResponses[userId].answers[0];
                    console.log("Nome personagem: ", respostaPergunta1);

                    const respostaPergunta2 = userResponses[userId].answers[1];
                    console.log("Id: ", respostaPergunta2);

                       // Mensagem aprovado

                    const embedAprovado = new MessageEmbed()

                        .setTitle('Você foi aprovado')
                        .setDescription(`Você foi aprovado com sucesso para entrar no servidor. \nLeia as regras para evitar ser punido por besteira! \n\n Tenha um bom RP!`)
                        .addField('> __Pontuação__', `\`\`\`fix\n${totalScore}/${choiceQuestionCount}\`\`\``)
                        .setColor('GREEN')
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
                        .setTimestamp()

                    interaction.editReply({ embeds: [embedAprovado], ephemeral: true })

                } else {

                    // Mensagem reprovado

                    const embedReprovado = new MessageEmbed()

                        .setTitle('Você foi reprovado')
                        .setDescription(`Parece que você não conseguiu alcançar o número mínimo de acertos para entrar no servidor, tente fazer novamente com calma.`)
                        .addField('> __Pontuação__', `\`\`\`fix\n${totalScore}/${choiceQuestionCount}\`\`\``, true)
                        .addField('> __Necessário__', `\`\`\`fix\n ${acertosMinimos}/${choiceQuestionCount}\`\`\``, true)
                        .setColor('RED')
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
                        .setTimestamp()

                    interaction.editReply({ embeds: [embedReprovado], ephemeral: true })

                }

                // Testar o que está coletando de repostas
                // console.log(userResponses[userId].answers);

                // Excluir a última resposta
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
};

function countChoiceQuestions(questions) {
    let count = 0;
    for (const question of questions) {
        if (question.type === 'choice') {
            count++;
        }
    }
    return count;

};