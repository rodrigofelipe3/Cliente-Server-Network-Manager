const { spawn } = require('child_process');
const { logToFile } = require("../utils/logToFile");
const { loadConfig } = require('../../loadConfig');
const WebSocket = require("ws")
const server = loadConfig()

const ws = new WebSocket.Server({ port: 5002 })

const ChkDsk = async () => {
  

  ws.on('connection', (ws) => {

    console.log('Conectado ao servidor WebSocket do administrador.');
    const cmdProcess = spawn('cmd', ['/c', 'chkdsk /f ']);

    cmdProcess.stdout.on('data', (data) => {
      console.log(data.toString())
      ws.send(JSON.stringify(data.toString()))
    });

    cmdProcess.stderr.on('data', (data) => {
      logToFile(`Erro: ${data.toString()}`);
      ws.send(JSON.stringify(data.toString()))
    });

    cmdProcess.on('close', (code) => {
      logToFile(`Processo finalizado com código ${code}`);
      ws.send(JSON.stringify(code.toString()));
    });

  })
  ws.on('error', (error) => {
    console.error('Erro na conexão WebSocket:', error);
  });
  ws.on('close', (ws)=> { 
    ws.send("close")
  })
}

const SystemFileCheck = () => {
  
  ws.on('connection', (ws) => {
    const cmdProcess = spawn('cmd', ['sfc', '/scannow']);
    console.log('Conectado ao servidor WebSocket do administrador.');
    
    cmdProcess.stdout.on('data', (data) => {
      ws.send(JSON.stringify(data.toString()))
    });

    cmdProcess.stderr.on('data', (data) => {
      logToFile(`Erro: ${data.toString()}`);
      console.log(data.toString())
      ws.send(JSON.stringify(data.toString()))
    });

    cmdProcess.on('close', (code) => {
      logToFile(`Processo finalizado com código ${code.toString()}`);
      console.log(code)
      ws.send(JSON.stringify(code.toString()));
    });

  })
  ws.on('error', (error) => {
    console.error('Erro na conexão WebSocket:', error);
  });
  ws.on('close', (ws)=> { 
    ws.send('close')
  })

}

const ScanHealth = () => {
  
  ws.on('connection', (ws) => {
    const cmdProcess = spawn('cmd', ['sfc', 'dism', '/online', '/cleanup-image', '/scanhealth']);
    console.log('Conectado ao servidor WebSocket do administrador.');
    
    cmdProcess.stdout.on('data', (data) => {
      ws.send(JSON.stringify(data.toString()))
    });

    cmdProcess.stderr.on('data', (data) => {
      logToFile(`Erro: ${data.toString()}`);
      console.log(data.toString())
      ws.send(JSON.stringify(data.toString()))
    });

    cmdProcess.on('close', (code) => {
      logToFile(`Processo finalizado com código ${code.toString()}`);
      console.log(code)
      ws.send(JSON.stringify(code.toString()));
    });

  })
  ws.on('error', (error) => {
    console.error('Erro na conexão WebSocket:', error);
  });
  ws.on('close', (ws)=> { 
    ws.send('close')
  })

}

const checkHealth = () => {
  
  ws.on('connection', (ws) => {
    const cmdProcess = spawn('cmd', ['sfc', 'dism', '/online', '/cleanup-image', '/checkhealth']);
    console.log('Conectado ao servidor WebSocket do administrador.');
    
    cmdProcess.stdout.on('data', (data) => {
      ws.send(JSON.stringify(data.toString()))
    });

    cmdProcess.stderr.on('data', (data) => {
      logToFile(`Erro: ${data.toString()}`);
      console.log(data.toString())
      ws.send(JSON.stringify(data.toString()))
    });

    cmdProcess.on('close', (code) => {
      logToFile(`Processo finalizado com código ${code.toString()}`);
      console.log(code)
      ws.send(JSON.stringify(code.toString()));
    });

  })
  ws.on('error', (error) => {
    console.error('Erro na conexão WebSocket:', error);
  });
  ws.on('close', (ws)=> { 
    ws.send('close')
  })

}

const RestoreHealth = () => {
  
  ws.on('connection', (ws) => {
    const cmdProcess = spawn('cmd', ['sfc', 'dism', '/online', '/cleanup-image', '/restorehealth']);
    console.log('Conectado ao servidor WebSocket do administrador.');
    
    cmdProcess.stdout.on('data', (data) => {
      ws.send(JSON.stringify(data.toString()))
    });

    cmdProcess.stderr.on('data', (data) => {
      logToFile(`Erro: ${data.toString()}`);
      console.log(data.toString())
      ws.send(JSON.stringify(data.toString()))
    });

    cmdProcess.on('close', (code) => {
      logToFile(`Processo finalizado com código ${code.toString()}`);
      console.log(code)
      ws.send(JSON.stringify(code.toString()));
    });

  })
  ws.on('error', (error) => {
    console.error('Erro na conexão WebSocket:', error);
  });
  ws.on('close', (ws)=> { 
    ws.send('close')
  })

}

module.exports = {ChkDsk, SystemFileCheck, ScanHealth, checkHealth, RestoreHealth, ScanHealth}