const fs = require('fs');
const path = require('path');
const { findIpResponse } = require('./src/utils/findServer');

async function loadConfig() {
    const configPath = "./config.json";

    try {
        const data = fs.readFileSync(configPath, 'utf8'); 
        const config = JSON.parse(data); 
        return {version: config.version, serverIp: config.serverIp}
    } catch (error) {
        console.error('Erro ao carregar o arquivo config.json:', error);
        findIpResponse('10.10.1.1', '10.10.1.253', 5000, '/api/')
    }
}

module.exports = { loadConfig }