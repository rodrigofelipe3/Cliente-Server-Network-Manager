
const WebSocket = require("ws")
const sudo = require('sudo-prompt')

const ws = new WebSocket.Server({ port: 5002 })

const CloseAllConnections = () => { 
  ws.clients.foreach(client => { 
    if(client.readState === WebSocket.OPEN) { 
      client.close()
    }
  })
}



const ChkDsk = async () => {
  ws.on('connection', (ws) => {
    console.log('Conectado ao servidor WebSocket do administrador.');
    sudo.exec('sfc /scannow', { name: 'sfc' }, (error, stdout, stderr) => {
      if (stderr) {
        ws.send(stderr.toString('utf-8'))
        ws.close()
      }
      if (stdout) {

        ws.send(stdout.toString('utf-8'))
        ws.close()
      }
      if(error){ 
        ws.send(error.toString('utf-8'))
        ws.close()
      }
    })
  })
  ws.on('close', ()=> { 
    ws.close()
  })

}

const SystemFileCheck = () => {
  ws.on('connection', (ws) => {
    console.log('Conectado ao servidor WebSocket do administrador.');
    sudo.exec('sfc /scannow', { name: 'sfc' }, (error, stdout, stderr) => {
      if (stderr) {
        ws.send(stderr.toString('utf-8'))
        ws.close()
      }
      if (stdout) {

        ws.send(stdout.toString('utf-8'))
        ws.close()
      }
      if(error){ 
        ws.send(error.toString('utf-8'))
        ws.close()
      }
    })
  })
  ws.on('close', ()=> { 
    ws.close()
  })
}

const ScanHealth = () => {
  ws.on('connection', (ws) => {
    console.log('Conectado ao servidor WebSocket do administrador.');
    sudo.exec('dism /online /cleanup-image /scanhealth', { name: 'checkhealth' }, (error, stdout, stderr) => {
      if (stderr) {
        ws.send(stderr.toString('utf-8'))
        ws.close()
      }
      if (stdout) {
        ws.send(stdout.toString('utf-8'))
        ws.close()
      }
      if(error){ 
        ws.send(error.toString('utf-8'))
        ws.close()
      }
    })
  })
  ws.on('close', ()=> { 
    ws.close()
  })
}

const checkHealth = () => {

  ws.on('connection', (ws) => {
    console.log('Conectado ao servidor WebSocket do administrador.');
    sudo.exec('dism /online /cleanup-image /checkhealth', { name: 'checkhealth' }, (error, stdout, stderr) => {
      if (stderr) {
        ws.send(stderr.toString('utf-8'))
        ws.close()
      }
      if (stdout) {
        ws.send(stdout.toString('utf-8'))
        ws.close()
      }
      if(error){ 
        ws.send(error.toString('utf-8'))
        ws.close()
      }
    })
  })
  ws.on('close', ()=> { 
    ws.close()
  })

}

const RestoreHealth = () => {

  ws.on('connection', (ws) => {
    console.log('Conectado ao servidor WebSocket do administrador.');
    sudo.exec('dism /online /cleanup-image /restorehealth', { name: 'restorehealth' }, (error, stdout, stderr) => {
      if (stderr) {
        ws.send(stderr.toString('utf-8'))
        ws.close()
      }
      if (stdout) {
        ws.send(stdout.toString('utf-8'))
        ws.close()
      }
      if(error){ 
        ws.send(error.toString('utf-8'))
        ws.close()
      }
    })
  })
  ws.on('close', ()=> { 
    ws.close()
  })

}

module.exports = { 
  ChkDsk, 
  SystemFileCheck, 
  ScanHealth, 
  checkHealth, 
  RestoreHealth, 
  ScanHealth 
}