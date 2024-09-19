const axios = require('axios');
const os = require('os');
const logToFile = require('../utils/logToFile');

const hostname = os.hostname();

const sendHeartbeat = async () => {
  try {
    const response = await axios.post(`http://localhost:5000/api/heartbeat/${hostname}`);
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