const fetch = require('node-fetch');
const fs = require('fs'); // Para criar o arquivo config.json
const { UpdateServerFound } = require('../database/database');
const { logToFile } = require('./logToFile');
const { loadConfig } = require('../../loadConfig');

const createConfigJson = (serverIp) => {
    try {
        fs.readFile('./config.json', 'utf-8', (err, data) => {
            
            if (err) {
                console.error(err)
                logToFile(err)
            }
            let JSONData = JSON.parse(data)
            const config = {
                version: String(JSONData.version),
                serverIP: String(serverIp),
                startIP: String(JSONData.startIP),
                endIP: String(JSONData.endIP)
            };
            fs.writeFile('./config.json', JSON.stringify(config, null, 4), (err) => {
                if (err) {
                    console.error('Erro ao criar o arquivo config.json:', err);
                } else {
                    console.log('Arquivo config.json criado com sucesso!');
                }
            });
        })
    } catch (err) {
        logToFile(err)
    }

}


const findIpResponse = async () => {
    const {version, serverIP, startIP, endIP } = await loadConfig();
    if (startIP != undefined) {
        const ipToInt = (ip) =>
            ip.split(".").reduce((acc, oct) => (acc << 8) + parseInt(oct), 0);
        const intToIP = (int) =>
            [
                (int >>> 24) & 255,
                (int >>> 16) & 255,
                (int >>> 8) & 255,
                int & 255,
            ].join(".");

        const startInt = ipToInt(startIP);
        const endInt = ipToInt(endIP);
        let found = false;

        console.log(`Buscando resposta entre os IPs ${startIP} e ${endIP}...`);

        for (let i = startInt; i <= endInt; i++) {
            const ipAtual = intToIP(i);
            const url = `http://${ipAtual}:${3000}`;
            console.log(`Tentando: ${url}`);

            try {
                // Controlando timeout manualmente
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 100); // Timeout de 2 segundos

                const response = await fetch(url, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    signal: controller.signal,
                });

                clearTimeout(timeout); // Limpar timeout se a requisição terminar
                console.log(response); if (response.status == 200) {
                    console.log(`SERVIDOR RESPONDEU no IP: ${ipAtual}`);
                    createConfigJson(ipAtual);
                    UpdateServerFound()
                    found = true;
                    break; // Interrompe o loop
                } else {
                    console.log(`Resposta inválida de: ${ipAtual}`);
                }
            } catch (error) {
                if (error.name === "AbortError") {
                    console.log(`Timeout na requisição para: ${ipAtual}`);
                } else {
                    console.log(
                        `Erro ao tentar conectar em: ${ipAtual} - ${error.message}`
                    );
                }
            }
        }

        if (!found) {
            console.log("Nenhuma resposta encontrada no intervalo.");
        }

        return found;
    }
};



module.exports = { findIpResponse }