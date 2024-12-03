
const WebSocket = require("ws")
const sudo = require('sudo-prompt')
const iconv = require('iconv-lite'); // Importando o iconv-lite

const ChkDsk = async () => {
  const wss = new WebSocket.Server({ port: 5002 });

  let execute = false;

  wss.on('connection', (ws) => {
    console.log('Conectado ao servidor CheckDisk.');
    if (!execute) {
      execute = true;
      sudo.exec('chkdsk', { name: 'chkdsk' }, (error, stdout, stderr) => {
        if (stderr) {
          // Converter stderr do formato OEM (cmd padrão) para UTF-8 antes de enviar
          ws.send(iconv.decode(Buffer.from(stderr, 'binary'), 'cp850'));
          ws.terminate();
          wss.close();
        }
        if (stdout) {
          // Converter stdout do formato OEM (cmd padrão) para UTF-8 antes de enviar
          console.log(stdout);
          ws.send(iconv.decode(Buffer.from(stdout, 'binary'), 'cp850'));
          ws.terminate();
          wss.close();
          execute = false;
        }
        if (error) {
          // Converter error do formato OEM para UTF-8 antes de enviar
          ws.send(iconv.decode(Buffer.from(error.toString(), 'binary'), 'cp850'));
          ws.terminate();
          wss.close();
          execute = false;
        }
      });
    }
  });
};

const SystemFileCheck = () => {
  let execute = false
  
  const wss = new WebSocket.Server({ port: 5002 })

  wss.on('connection', (ws) => {
    console.log('Conectado ao servidor SFC SCANNOW.');
    if (!execute) {
      execute = true
      sudo.exec('sfc /scannow', { name: 'sfc' }, (error, stdout, stderr) => {
        if (stderr) {
          // Converter stderr do formato OEM (cmd padrão) para UTF-8 antes de enviar
          ws.send(iconv.decode(Buffer.from(stderr, 'binary'), 'cp850'));
          ws.terminate();
          wss.close();
        }
        if (stdout) {
          // Converter stdout do formato OEM (cmd padrão) para UTF-8 antes de enviar
          console.log(stdout);
          ws.send(iconv.decode(Buffer.from(stdout, 'binary'), 'cp850'));
          ws.terminate();
          wss.close();
          execute = false;
        }
        if (error) {
          // Converter error do formato OEM para UTF-8 antes de enviar
          ws.send(iconv.decode(Buffer.from(error.toString(), 'binary'), 'cp850'));
          ws.terminate();
          wss.close();
          execute = false;
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
          // Converter stderr do formato OEM (cmd padrão) para UTF-8 antes de enviar
          ws.send(iconv.decode(Buffer.from(stderr, 'binary'), 'cp850'));
          ws.terminate();
          wss.close();
        }
        if (stdout) {
          // Converter stdout do formato OEM (cmd padrão) para UTF-8 antes de enviar
          console.log(stdout);
          ws.send(iconv.decode(Buffer.from(stdout, 'binary'), 'cp850'));
          ws.terminate();
          wss.close();
          execute = false;
        }
        if (error) {
          // Converter error do formato OEM para UTF-8 antes de enviar
          ws.send(iconv.decode(Buffer.from(error.toString(), 'binary'), 'cp850'));
          ws.terminate();
          wss.close();
          execute = false;
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
          // Converter stderr do formato OEM (cmd padrão) para UTF-8 antes de enviar
          ws.send(iconv.decode(Buffer.from(stderr, 'binary'), 'cp850'));
          ws.terminate();
          wss.close();
        }
        if (stdout) {
          // Converter stdout do formato OEM (cmd padrão) para UTF-8 antes de enviar
          console.log(stdout);
          ws.send(iconv.decode(Buffer.from(stdout, 'binary'), 'cp850'));
          ws.terminate();
          wss.close();
          execute = false;
        }
        if (error) {
          // Converter error do formato OEM para UTF-8 antes de enviar
          ws.send(iconv.decode(Buffer.from(error.toString(), 'binary'), 'cp850'));
          ws.terminate();
          wss.close();
          execute = false;
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
          // Converter stderr do formato OEM (cmd padrão) para UTF-8 antes de enviar
          ws.send(iconv.decode(Buffer.from(stderr, 'binary'), 'cp850'));
          ws.terminate();
          wss.close();
        }
        if (stdout) {
          // Converter stdout do formato OEM (cmd padrão) para UTF-8 antes de enviar
          console.log(stdout);
          ws.send(iconv.decode(Buffer.from(stdout, 'binary'), 'cp850'));
          ws.terminate();
          wss.close();
          execute = false;
        }
        if (error) {
          // Converter error do formato OEM para UTF-8 antes de enviar
          ws.send(iconv.decode(Buffer.from(error.toString(), 'binary'), 'cp850'));
          ws.terminate();
          wss.close();
          execute = false;
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