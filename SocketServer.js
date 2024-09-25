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
  console.log(data);
  if (
    data == "UP ARROW" ||
    data == "LEFT ARROW" ||
    data == "DOWN ARROW" ||
    data == "RIGHT ARROW"
  ) {
    const key = data.split(" ")[0];
    console.log(key)
    robot.keyTap(key.toLowerCase());
  }
  if (
    data !== "MOUSE LEFT" &&
    data !== "MOUSE RIGHT" &&
    data !== "MOUSE MIDDLE" &&
    data !== "UP ARROW" &&
    data !== "LEFT ARROW" &&
    data !== "DOWN ARROW" &&
    data !== "RIGHT ARROW" &&
    data !== "PRINT SCREEN" && 
    data !== "LEFT CTRL" &&
    data !== "RIGHT CTRL" &&
    data !== "RETURN" && 
    data == "PAGE DOWN" &&
    data == "PAGE UP"
    
  ) {
    robot.keyTap(data.toLowerCase());
  }else if(data == "PRINT SCREEN"){ 
    robot.keyTap("printscreen");
  }else if(
    data == "LEFT CTRL" ||
    data == "RIGHT CTRL"
  ){ 
    robot.keyTap("control");
  }else if(data == "RETURN") { 
      robot.keyTap("enter")
  }
  else if(data == "PAGE DOWN" || data == "PAGE UP") { 
    const key = data.replace(" ", "")
    robot.keyTap(key.toLowerCase())
  }
  else if(
    data == "NUMPAD 1"|| 
    data == "NUMPAD 2"||
    data == "NUMPAD 3"||
    data == "NUMPAD 4"||
    data == "NUMPAD 5"||
    data == "NUMPAD 6"||
    data == "NUMPAD 7"||
    data == "NUMPAD 8"||
    data == "NUMPAD 9"
  ) { 
    const key = data.replace(" ", "_")
    robot.keyTap(key.toLowerCase())
  }else (
    console.log(data)
  )

});
