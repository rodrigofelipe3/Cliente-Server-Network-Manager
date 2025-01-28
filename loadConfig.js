const fs = require('fs');
const { logToFile } = require('./src/utils/logToFile');

async function loadConfig() {
    const configPath = "./config.json";

    try {
        const data = fs.readFileSync(configPath, 'utf8'); 
        const config = JSON.parse(data); 
        return {version: config.version, serverIP: config.serverIP, startIP: config.startIP, endIP: config.endIP}
    } catch (error) {
        console.error('Erro ao carregar o arquivo config.json:', error);
        logToFile('Erro ao carregar o arquivo config.json:', error)
    }
}

module.exports = { loadConfig }