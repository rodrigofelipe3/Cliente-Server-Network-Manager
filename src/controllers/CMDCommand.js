
const WebSocket = require("ws")
const sudo = require('sudo-prompt')

const CloseAllConnections = () => {
  ws.clients.forEach(client => {
    if (client.readState === WebSocket.OPEN) {
      client.close()
    }
  })
}




const ChkDsk = async () => {
  
  const wss = new WebSocket.Server({ port: 5002 })

  let execute = false
  wss.on('connection', (ws) => {
    console.log('Conectado ao servidor CheckDisk.');
    if (!execute) {
      execute = true
      sudo.exec('chkdsk', { name: 'chkdsk' }, (error, stdout, stderr) => {
        if (stderr) {
          ws.send(stderr.toString('utf-8'))
          ws.terminate()
          wss.close()
        }
        if (stdout) {
          console.log(stdout)
          ws.send(stdout)
          ws.terminate()
          wss.close()
          execute = false
        }
        if (error) {
          ws.send(error.toString('utf-8'))
          ws.terminate()
          wss.close()
          execute = false
        }

      })
    }
  })
}

const SystemFileCheck = () => {
  let execute = false
  
  const wss = new WebSocket.Server({ port: 5002 })

  wss.on('connection', (ws) => {
    console.log('Conectado ao servidor SFC SCANNOW.');
    if (!execute) {
      execute = true
      sudo.exec('sfc /scannow', { name: 'sfc' }, (error, stdout, stderr) => {
        if (stderr) {
          ws.send(stderr.toString('utf-8'))
          ws.terminate()
          wss.close()
          execute = false
        }
        if (stdout) {
          console.log(stdout)
          ws.send(stdout)
          ws.terminate()
          wss.close()
          execute = false
        }
        if (error) {
          ws.send(error.toString('utf-8'))
          ws.terminate()
          wss.close()
          execute = false
        }

      })
    }
  })


}

const ScanHealth = () => {
  
  const wss = new WebSocket.Server({ port: 5002 })

  let execute = false
  wss.on('connection', (ws) => {
    console.log('Conectado ao servidor ScanHealth.');
    if (!execute) {
      execute = true
      sudo.exec('dism /online /cleanup-image /scanhealth', { name: 'scanhealth' }, (error, stdout, stderr) => {
        if (stderr) {
          ws.send(stderr.toString('utf-8'))
          ws.terminate()
          wss.close()
          execute = false
        }
        if (stdout) {
          ws.send(stdout.toString('utf-8'))
          ws.terminate()
          wss.close()
          execute = false
        }
        if (error) {
          ws.send(error.toString('utf-8'))
          ws.terminate()
          wss.close()
          execute = false
        }

      })
    }
  })

}

const checkHealth = () => {
  
  const wss = new WebSocket.Server({ port: 5002 })

  let execute = false
  wss.on('connection', (ws) => {
    console.log('Conectado ao servidor CheckHealth.');
    if (!execute) {
      execute = true
      sudo.exec('dism /online /cleanup-image /checkhealth', { name: 'checkhealth' }, (error, stdout, stderr) => {
        if (stderr) {
          ws.send(stderr.toString('utf-8'))
          ws.terminate()
          wss.close()
          execute = false
        }
        if (stdout) {
          console.log(stdout)
          ws.send(stdout)
          ws.terminate()
          wss.close()
          execute = false
        }
        if (error) {
          ws.send(error.toString('utf-8'))
          ws.terminate()
          wss.close()
          execute = false
        }

      })
    }
  })

}

const RestoreHealth = () => {
  
  const ws = new WebSocket.Server({ port: 5002 })

  let execute = true
  ws.on('connection', (ws) => {
    console.log('Conectado ao servidor RestoreHealth.');
    if (!execute) {
      execute = true
      sudo.exec('dism /online /cleanup-image /restorehealth', { name: 'restorehealth' }, (error, stdout, stderr) => {
        if (stderr) {
          ws.send(stderr.toString('utf-8'))
          ws.terminate()
          ws.close()
          execute = false
        }
        if (stdout) {
          console.log(stdout)
          ws.send(stdout.toString('utf-8'))
          ws.terminate()
          ws.close()
          execute = false
        }
        if (error) {
          ws.send(error.toString('utf-8'))
          ws.terminate()
          ws.close()
          execute = false
        }

      })
    }
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