const os = require('os');
const logToFile = require('../utils/logToFile');
const { loadConfig } = require('../../loadConfig');
const hostname = os.hostname();


const sendHeartbeat = async () => {
  const server = loadConfig()
  try {
    const response = await fetch(`http://${server}:5000/api/heartbeat/${hostname}`,{ 
      method: "POST",
      headers: { 
        "Content-Type":"application/json"
      }
    });
    if(response.status == 200){ 
      logToFile.logToFile("HeartBeat enviado com sucesso!")
    }else  { 
      logToFile.logToFile("Servidor não encontrado ou está offline")
    }
  } catch (error) {
    logToFile.logToFile(`Erro ao enviar heartbeat: ${error}`);
  }
};

module.exports = sendHeartbeat