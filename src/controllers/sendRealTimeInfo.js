const { exec } = require('child_process');
const si = require('systeminformation');
const WebSocket = require('ws');

// Função assíncrona para obter o uso da CPU
const getCpuUsage = async () => {
    return new Promise((resolve, reject) => {
        exec('wmic cpu get loadpercentage', async (error, stdout, stderr) => {
            if (error) return reject(`exec error: ${error}`);
            if (stderr) return reject(`stderr: ${stderr}`);


            // Processar a saída para obter o uso do processador
            const lines = stdout.trim().split('\n');
            const usage = lines[1] ? parseInt(lines[1].trim(), 10) : 0;
            resolve({ usage});
        });
    });
};

// Função assíncrona para obter o uso da memória
const getMemoryUsage = async () => {
    return new Promise((resolve, reject) => {
        exec('wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /Value', (error, stdout, stderr) => {
            if (error) return reject(`exec error: ${error}`);
            if (stderr) return reject(`stderr: ${stderr}`);

            // Processar a saída para obter o uso da memória
            const lines = stdout.trim().split('\n');
            const freeMemory = parseInt(lines[0].split('=')[1].trim(), 10);
            const totalMemory = parseInt(lines[1].split('=')[1].trim(), 10);

            const usedMemory = totalMemory - freeMemory;
            const usedMemoryPercentage = (usedMemory / totalMemory) * 100;

            // Converter para GB
            const freeMemoryGB = (freeMemory / 1048576).toFixed(2);
            const totalMemoryGB = (totalMemory / 1048576).toFixed(2);
            const usedMemoryGB = (usedMemory / 1048576).toFixed(2);

            resolve({
                usedMemoryPercentage: usedMemoryPercentage.toFixed(2),
                usedMemory: usedMemoryGB,
                totalMemory: totalMemoryGB,
                freeMemory: freeMemoryGB,
            });
        });
    });
};

// Inicializar o WebSocket
let wss;
const WebSocketConnection = () => {
    try {
        if (!wss) {
            wss = new WebSocket.Server({ port: 443 });
        }

        wss.on('connection', (ws) => {
            console.log('Conectado ao cliente');

            // Função para enviar mensagens assíncronas
            const sendMessageAsync = async () => {
                try {
                    const cpuData = await getCpuUsage();
                    const memoryData = await getMemoryUsage();
                    console.log('enviando mensagem')
                    const message = `usage:${cpuData.usage},memper:${memoryData.usedMemoryPercentage},usedmemory:${memoryData.usedMemory},totalmemory:${memoryData.totalMemory},freemem:${memoryData.freeMemory}`;
                    
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(message, (err) => {
                            if (err) console.error(err);
                        });
                    }
                } catch (error) {
                    console.error("Erro ao enviar mensagem:", error);
                }
            };

            // Loop assíncrono para enviar mensagens com intervalo dinâmico
            const intervalLoop = async () => {
                while (ws.readyState === WebSocket.OPEN) {
                    await sendMessageAsync();
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 2.5s antes da próxima execução
                }
            };

            // Iniciar o envio de mensagens
            intervalLoop();

            // Evento de fechamento da conexão pelo cliente
            ws.on('close', () => {
                console.log("Fechando conexão com cliente");
            });
        });

        process.on('SIGINT', () => {
            console.log('Encerrando servidor WebSocket...');
            wss.close(() => {
                console.log('Servidor WebSocket encerrado.');
                process.exit(0);
            });
        });

    } catch (e) {
        console.log(e);
    }
};

module.exports = { WebSocketConnection };
