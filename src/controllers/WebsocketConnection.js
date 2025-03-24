const { exec } = require('child_process');
const WebSocket = require('ws');
const iconv = require('iconv-lite');
const sudo = require('sudo-prompt')
const encoding = 'cp437'; // Tente 'windows-1252' ou 'cp437'

function iconvDecode(buffer) {
    return iconv.decode(buffer, encoding);
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


const port = 444;
let wss = null;
let activeUsers = {};

const WssConnection = async () => {


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
                if (messageString != '' && messageString != 'close' && ws.readyState == 1) {

                    const messageJson = JSON.parse(messageString);
                    ws.send('C:/Windows/System32> ' + messageJson.command)
                    ws.send('await')
                    if(messageJson.type == "CLI") ExecuteCommand(messageJson.command, ws)

                } else if (messageString == 'close') {
                    console.log('Fechando Conexão')
                    ws.close()
                }
            });

            ws.on('error', (err) => {
                console.error('Erro na conexão WebSocket: ', err);
            });
        });

        wss.on('close', () => {
            wss.close();
        });

    } catch (e) {
        console.error(e)
    }
};

const ExecuteCommand = (command, ws) => {
    try {
        sudo.exec(command, { name: 'Command' }, (err, stdout, stderr) => {
            if (err) {
                if (stderr) {
                    const result = iconvDecode(stderr); 
                    ws.send(`Sterr: ${result} \nNode error: ${err}
                        `)
                }
                ws.send(`Node error: ${err}`)
            }
            ws.send(String(stdout).toString())
        });
    } catch (err) {
        console.log(err)
        ws.send(err.toString())
    }

}

module.exports = { WssConnection };
