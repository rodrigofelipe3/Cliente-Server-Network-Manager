const WebSocket = require('ws');
const {exec } = require('child_process')
// Cria o servidor WebSocket na porta 5000
const wss = new WebSocket.Server({ port: 5002 });

wss.on('connection', (ws) => {
  console.log('Cliente conectado.');

  ws.on('message', (message) => {
    console.log(`Mensagem recebida: ${message}`);
  });

  ws.on('close', () => {
    console.log('Cliente desconectado.');
  });

  // Enviar uma mensagem para o cliente de teste
  ws.send(JSON.stringify('Bem-vindo ao servidor WebSocket!'));
});

console.log( 'Servidor WebSocket rodando na porta 5000');
