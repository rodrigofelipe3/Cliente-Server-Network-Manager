const express = require("express")
const sendHeartbeat = require("./src/controllers/SendAHb")
const route = require("./src/routes/routes")
const cors = require("cors")
const checkShutdownTime = require("./src/utils/scheduleShutdown")
const logToFile = require("./src/utils/logToFile")
const sendComputerInfo = require("./src/controllers/sendComputerinfo")
const  CreateTable = require("./src/database/database")
const { createWebSocketServer } = require('./src/WebSocket/websocketserver'); // Importando o servidor WebSocket
const http = require('http');
const app = express()
const WebSocket = require('ws');
const PORT = 5001

//############APP USE
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    console.log('WebSocket connection established');
  
    ws.on('message', message => {
      console.log('Received:', message);
      // Handle incoming messages
    });
  
    ws.send(JSON.stringify({ message: 'Hello from WebSocket server' }));
  });
app.use(cors())
app.use(express.json())
app.use("/api", route)
//###########FUNÇÕES

// Iniciando o servidor WebSocket
createWebSocketServer(server);

CreateTable
sendComputerInfo()
setInterval(sendHeartbeat, 60000);
setInterval(checkShutdownTime, 60000);

//#########INICIANDO O SERVIDOR
server.listen(PORT, ()=> { 
    logToFile.clearLogFile()
    logToFile.logToFile("Server rodando na porta 5001")
})