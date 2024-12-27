const { exec } = require('child_process')
const si = require('systeminformation')
const WebSocket = require('ws')

const getCpuUsage = (callback) => {

    exec('wmic cpu get loadpercentage', async (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        const temp = await si.cpuTemperature()
        // Processar a saída para obter o uso do processador
        const lines = stdout.trim().split('\n');
        const usage = lines[1] ? parseInt(lines[1].trim(), 10) : 0;
        callback(usage, temp);
    });
}
function getMemoryUsage(callback) {
    exec('wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /Value', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }

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

        callback({
            usedMemoryPercentage: usedMemoryPercentage.toFixed(2),
            usedMemory: usedMemoryGB,
            totalMemory: totalMemoryGB,
            freeMemory: freeMemoryGB,
        });
    });
}

const WebSocketConnection = () => {
    try {
        const wss = new WebSocket.Server({ port: 443 });
        let connectionCount = 0;

        wss.on('connection', async (ws) => {
            if (connectionCount >= 2) {
                ws.close(1008, 'Server is already handling the maximum number of connections'); // Código de fechamento personalizado
                return;
            }
            setInterval(() => {
                getCpuUsage((usage, temp) => {
                    ws.send(usage.toString(), temp.toString());
                });
            }, 500);

            setInterval(() => {
                getMemoryUsage((usedMemoryPercentage, usedMemory, totalMemory, freeMemory) => {
                    ws.send(usedMemoryPercentage.toString(), usedMemory.toString(), totalMemory.toString(), freeMemory.toString());
                });
            }, 500);

            ws.on('close', () => {
                connectionCount--;
                console.log(`Connection closed. Current active connections: ${connectionCount}`);
            });
        });
    } catch (e) {
        console.log(e)
    }

}


getCpuUsage((usage, temp) => {
    console.log(usage, temp.main)
})

module.exports = { WebSocketConnection }