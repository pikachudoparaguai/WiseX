module.exports = {
    name: 'ping', // Nome do comando
    description: 'Veja o ping do bot.', // Descrição do comando (opcional)
    aliases: ['ms'], // Palavras-chave adicionais que acionarão o comando
  
    // Função para executar o comando
    execute(message, args) {
      message.reply(`🏓 Pong: \`${message.client.ws.ping}ms\``);
    },
  };