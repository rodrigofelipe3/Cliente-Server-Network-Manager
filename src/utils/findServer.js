const fetch = require('node-fetch');
const fs = require('fs'); // Para criar o arquivo config.json
const { UpdateServerFound } = require('../database/database');

const createConfigJson = (serverIp) => { 
    const config = {
        serverIp: String(serverIp) // Define o IP recebido na função
    };
    console.log(serverIp)
    const jsonString = JSON.stringify(config, null, 4);

    // Escrever o JSON no arquivo config.json
    fs.writeFile('config.json', jsonString, (err) => {
        if (err) {
            console.error('Erro ao criar o arquivo config.json:', err);
        } else {
            console.log('Arquivo config.json criado com sucesso!');
        }
    });
}
// Função para realizar solicitações a uma faixa de IPs
async function findIpResponse(start, end, port, path) {
    const ipToInt = (ip) => ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct), 0);
    const intToIP = (int) =>
        [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');

    const startInt = ipToInt(start);
    const endInt = ipToInt(end);
    let found = false;

    console.log(`Buscando resposta entre os IPs ${start} e ${end}...`);

    for (let i = startInt; i <= endInt; i++) {
        const ipAtual = intToIP(i);
        const url = `http://${ipAtual}:${port}${path}`;
        console.log(`Tentando: ${url}`);
        
        try {
            // Controlando timeout manualmente
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 100); // Timeout de 2 segundos

            const response = await fetch(url, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
            });

            clearTimeout(timeout); // Limpar timeout se a requisição terminar

            if (response.ok) {
                console.log(`SERVIDOR RESPONDEU no IP: ${ipAtual}`);
                createConfigJson(ipAtual);
                UpdateServerFound()
                found = true;
                break; // Interrompe o loop
            } else {
                console.log(`Resposta inválida de: ${ipAtual}`);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log(`Timeout na requisição para: ${ipAtual}`);
            } else {
                console.log(`Erro ao tentar conectar em: ${ipAtual} - ${error.message}`);
            }
        }
    }

    if (!found) {
        console.log('Nenhuma resposta encontrada no intervalo.');
    }

    return found;
}


module.exports = { findIpResponse}