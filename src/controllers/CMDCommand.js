
const WebSocket = require("ws")
const sudo = require('sudo-prompt')

const ws = new WebSocket.Server({ port: 5002 })

const closeAllConnections = () => {
  ws.clients.forEach(client => {
    if (client.readState === WebSocket.OPEN) {
      client.close()
    }
  })
}

let execute = false


const ChkDsk = async () => {
  ws.on('connection', (ws) => {
    console.log('Conectado ao servidor CheckDisk.');
    if (!execute) {
      execute = true
      sudo.exec('chkdsk', { name: 'chkdsk' }, (error, stdout, stderr) => {
        if (stderr) {
          ws.send(stderr.toString('utf-8'))
          ws.terminate()
          closeAllConnections()
          execute = false
        }
        if (stdout) {
          console.log(stdout)
          ws.send(stdout)
          ws.terminate()
          closeAllConnections()
          execute = false
        }
        if (error) {
          ws.send(error.toString('utf-8'))
          ws.terminate()
          closeAllConnections()
          execute = false
        }

      })
    }
  })
}

const SystemFileCheck = () => {
  ws.on('connection', (ws) => {
    console.log('Conectado ao servidor SFC SCANNOW.');
    if (!execute) {
      execute = true
      sudo.exec('sfc /scannow', { name: 'sfc' }, (error, stdout, stderr) => {
        if (stderr) {
          ws.send(stderr.toString('utf-8'))
          ws.terminate()
          closeAllConnections()
          execute = false
        }
        if (stdout) {
          console.log(stdout)
          ws.send(stdout.toString())
          ws.terminate()
          closeAllConnections()
          execute = false
         
        }
        if (error) {
          ws.send(error.toString('utf-8'))
          ws.terminate()
          closeAllConnections()
          execute = false
        }

      })
    }
  })
  ws.close()

}

const ScanHealth = () => {
  ws.on('connection', (ws) => {
    console.log('Conectado ao servidor ScanHealth.');
    if (!execute) {
      execute = true
      sudo.exec('dism /online /cleanup-image /scanhealth', { name: 'scanhealth' }, (error, stdout, stderr) => {
        if (stderr) {
          ws.send(stderr.toString('utf-8'))
          ws.terminate()
          closeAllConnections()
          execute = false
        }
        if (stdout) {
          ws.send(stdout.toString('utf-8'))
          ws.terminate()
          closeAllConnections()
          execute = false
        }
        if (error) {
          ws.send(error.toString('utf-8'))
          ws.terminate()
          closeAllConnections()
          execute = false
        }

      })
    }
  })

}

const checkHealth = () => {
  ws.on('connection', (ws) => {
    console.log('Conectado ao servidor CheckHealth.');
    if (!execute) {
      execute = true
      sudo.exec('dism /online /cleanup-image /checkhealth', { name: 'checkhealth' }, (error, stdout, stderr) => {
        if (stderr) {
          ws.send(stderr.toString('utf-8'))
          ws.terminate()
          closeAllConnections()
          execute = false
        }
        if (stdout) {
          console.log(stdout)
          ws.send(stdout)
          ws.terminate()
          closeAllConnections()
          execute = false
        }
        if (error) {
          ws.send(error.toString('utf-8'))
          ws.terminate()
          closeAllConnections()
          execute = false
        }

      })
    }
  })

}

const RestoreHealth = () => {

  ws.on('connection', (ws) => {
    console.log('Conectado ao servidor RestoreHealth.');
    if (!execute) {
      execute = true
      sudo.exec('dism /online /cleanup-image /restorehealth', { name: 'restorehealth' }, (error, stdout, stderr) => {
        if (stderr) {
          ws.send(stderr.toString('utf-8'))
          ws.terminate()
          closeAllConnections()
          execute = false
        }
        if (stdout) {
          console.log(stdout)
          ws.send(stdout.toString('utf-8'))
          ws.terminate()
          closeAllConnections()
          execute = false
        }
        if (error) {
          ws.send(error.toString('utf-8'))
          ws.terminate()
          closeAllConnections()
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