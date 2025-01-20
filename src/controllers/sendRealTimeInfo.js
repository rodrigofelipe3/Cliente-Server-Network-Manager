const { exec } = require('child_process');
const WebSocket = require('ws');

// Função para capturar dados de processos do PowerShell
const getProcessMemoryData = () => {
    return new Promise((resolve, reject) => {
        // Comando PowerShell para listar os processos com consumo de memória
        const command = `Get-Process | Select-Object Name, Id, @{Name='Memory_MB';Expression={[math]::Round($_.WorkingSet64 / 1MB, 2)}} | Sort-Object Memory_MB -Descending | ConvertTo-Csv -NoTypeInformation`;

        exec(`powershell -Command "${command}"`, (error, stdout, stderr) => {
            if (error || stderr) {
                reject(error || stderr);
            } else {
                const lines = stdout.trim().split('\n').slice(1); // Remove cabeçalhos CSV

                // Mapeia os dados e filtra o processo "Memory Compression"
                const data = lines.map(line => {
                    const [Name, Id, Memory_MB] = line.split(',').map(val => val.trim().replace(/"/g, ''));
                    return { Name, Id: parseInt(Id, 10), Memory_MB: parseFloat(Memory_MB) || 0 };
                }).filter(process => process.Name !== 'Memory Compression'); // Filtra o processo Memory Compression

                resolve(data);
            }
        });
    });
};

const sendTopMemoryProcesses = async () => {
    try {
        const processes = await getProcessMemoryData();
        const topProcesses = processes.slice(0, 15);
        return JSON.stringify(topProcesses)
    } catch (error) {
        console.error('Erro ao obter dados de memória:', error);
    }
};


// Função assíncrona para obter o uso da CPU
const getCpuUsage = async () => {
    return new Promise((resolve, reject) => {
        exec('wmic cpu get loadpercentage', async (error, stdout, stderr) => {
            if (error) return reject(`exec error: ${error}`);
            if (stderr) return reject(`stderr: ${stderr}`);

            // Processar a saída para obter o uso do processador
            const lines = stdout.trim().split('\n');
            const usage = lines[1] ? parseInt(lines[1].trim(), 10) : 0;
            resolve({ usage });
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


const { spawn } = require('child_process');

function getCpuTemperature() {
    return new Promise((resolve, reject) => {
        // Comando PowerShell para obter a temperatura
        const command = `
      (Get-WmiObject MSAcpi_ThermalZoneTemperature -Namespace "root/wmi").CurrentTemperature / 10 - 273.15
    `;

        // Executa o PowerShell usando spawn
        const powershell = spawn('powershell.exe', ['-Command', command]);

        let stdout = '';
        let stderr = '';

        // Captura a saída padrão
        powershell.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        // Captura erros, se houver
        powershell.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        // Trata o fechamento do processo
        powershell.on('close', (code) => {
            if (code !== 0 || stderr) {
                return reject(`Erro ao executar o comando: ${stderr || 'Código de saída ' + code}`);
            }

            const temperature = parseFloat(stdout.trim());
            if (isNaN(temperature)) {
                return reject('Não foi possível converter a saída em um número.');
            }

            resolve(temperature);
        });

        // Trata erros do próprio processo spawn
        powershell.on('error', (error) => {
            reject(`Erro ao iniciar o processo: ${error.message}`);
        });
    });
}




const isPortInUse = (port) => {
    return new Promise((resolve, reject) => {
        exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
            if (error) {
                resolve(false); // Porta não está em uso
            } else {
                const output = stdout.toString();
                const lines = output.split('\n');
                const isInUse = lines.some(line => {
                    const columns = line.trim().split(/\s+/);
                    return columns.includes('SYN_SENT') || columns.includes(`:${port}`);
                });
                resolve(isInUse && !output.includes('SYN_SENT'));
            }
        });
    });
};




const WebSocketConnection = async () => {
    const port = 443;
    let wss = null;
    let activeUsers = {};

    const portInUse = await isPortInUse(port);
    if (portInUse) {
        console.log(`Port ${port} is already in use.`);
        return;
    }

    if (!wss) {
        wss = new WebSocket.Server({ port });
        console.log(`WebSocket server started on port ${port}`);
    }

    try {

        wss.on('connection', (ws) => {

            console.log('Conectado ao cliente');
            // Função para enviar mensagens assíncrona
            ws.on('message', (message) => {
                const messageString = message.toString()
                console.log(messageString)
                if (messageString != 'close') {
                    const data = JSON.parse(messageString)
                    if (data.type === 'authenticate') {
                        // Associar a nova conexão a um ID de usuário
                        activeUsers[data.userId] = ws;
                        console.log('Usuário autenticado:', data.userId);
                    }
                } else {
                    ws.close()
                    wss != null ? wss.close() : undefined
                    wss != null ? wss = null : undefined
                    activeUsers = {}
                }
            })
            const sendMessageAsync = async () => {
                try {
                    const cpuData = await getCpuUsage();
                    const memoryData = await getMemoryUsage();
                    const processes = await sendTopMemoryProcesses()
                    const temp = await // Uso da função
                        getCpuTemperature()
                            .then((temperature) => {
                                return temperature.toFixed(2)

                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    const message = `usage:${cpuData.usage},memper:${memoryData.usedMemoryPercentage},usedmemory:${memoryData.usedMemory},totalmemory:${memoryData.totalMemory},freemem:${memoryData.freeMemory},temp:${temp},processes:${processes}`;

                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(message, (err) => {
                            if (err) console.error(err);
                        });
                    }
                } catch (error) {
                    console.error('Erro ao enviar mensagem:', error);
                }
            };
            const intervalLoop = async () => {
                while (ws.readyState === WebSocket.OPEN) {
                    await sendMessageAsync();
                    await new Promise(resolve => setTimeout(resolve, 800));
                }
            };
            intervalLoop();
            ws.on('close', () => {
                for (const userId in activeUsers) {
                    if (activeUsers[userId] === ws) {
                        delete activeUsers[userId];
                        console.log('Usuário desconectado:', userId);
                        break;
                    }
                }
                wss != null ? wss.close() : undefined
                wss != null ? wss = null : undefined
                activeUsers = {}
            });
            ws.on('error', (err) => {
                console.error('Erro na conexão WebSocket:', err);
            });
        });

    } catch (e) {
        if (e.code == 'EADDRINUSE') console.error('A porta 443 já está em uso')
    }
};

module.exports = { WebSocketConnection };
