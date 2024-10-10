const fs = require('fs');
const path = require('path');

function loadConfig() {
    const configPath = "./config.json";

    try {
        const data = fs.readFileSync(configPath, 'utf8'); 
        const config = JSON.parse(data); 
        return config.serverIp
    } catch (error) {
        console.error('Erro ao carregar o arquivo config.json:', error);
    }
}

module.exports = { loadConfig }