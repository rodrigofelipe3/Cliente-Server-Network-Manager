const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const robot = require("robotjs");
const { io } = require("socket.io-client");

const app = express();
const server = http.createServer(app);
const clientIo = socketIo(server);

const ADMIN_SERVER_URL = "http://localhost:8080"; // URL do servidor administrador
const adminSocket = io(ADMIN_SERVER_URL);

// Conectar ao servidor administrador
adminSocket.on("connect", () => {
  console.log("Conectado ao servidor administrador.");
});

// Inicia o servidor cliente
const PORT = 8081; // Use uma porta diferente para o cliente
server.listen(PORT, () => {
  console.log(`Servidor cliente aguardando conexões na porta ${PORT}`);
});

// Receber movimento do mouse do servidor administrador
adminSocket.on("mouseMove", (data) => {
  robot.moveMouse(data.x, data.y);
  console.log(`Movimento do mouse replicado: X=${data.x}, Y=${data.y}`);
});

// Receber pressionamentos de teclas do servidor administrador
adminSocket.on("keyboard", (data) => {
  const keysToPress = data.key; // data.key pode ser uma string
  for (const char of keysToPress) {
    robot.keyTap(char);
    console.log(`Tecla replicada: ${char}`);
  }
});
