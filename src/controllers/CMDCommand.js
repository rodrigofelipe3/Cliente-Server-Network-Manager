const WebSocket = require("ws");
const sudo = require("sudo-prompt");
const iconv = require("iconv-lite"); // Importando o iconv-lite
const { exec } = require("child_process");

const ChkDsk = async () => {
  const port = 5002;
  let ws = null
  const portInUse = await isPortInUse(port);
  if (portInUse) {
    console.log(`Port ${port} is already in use.`);
    return;
  }

  if (!ws) {
    ws = new WebSocket.Server({ port });
    console.log(`WebSocket server started on port ${port}`);
  }

  let execute = false;

  ws.on("connection", (wss) => {
    console.log("Conectado ao servidor CheckDisk.");
    if (!execute) {
      execute = true;
      sudo.exec("chkdsk", { name: "chkdsk" }, (error, stdout, stderr) => {
        if (stderr) {
          wss.send(iconv.decode(Buffer.from(stderr, "binary"), "utf-8"));
          wss.close();
          ws.close();
        }
        if (stdout) {
          console.log(stdout);
          wss.send(iconv.decode(Buffer.from(stdout, "binary"), "utf-8"));
          wss.close();
          ws.close();
          execute = false;
        }
        if (error) {
          wss.send(
            iconv.decode(Buffer.from(error.toString(), "binary"), "utf-8")
          );
          wss.close();
          ws.close();
          execute = false;
        }
      });
    }
  });
};

const SystemFileCheck = async () => {
  const port = 5002;
  let ws = null
  const portInUse = await isPortInUse(port);
  if (portInUse) {
    console.log(`Port ${port} is already in use.`);
    return;
  }

  if (!ws) {
    ws = new WebSocket.Server({ port });
    console.log(`WebSocket server started on port ${port}`);
  }
  let execute = false
  ws.on("connection", (wss) => {
    console.log("Conectado ao servidor SFC SCANNOW.");
    if (!execute) {
      execute = true;
      sudo.exec("sfc /scannow", { name: "sfc" }, (error, stdout, stderr) => {
        if (stderr) {
          wss.send(iconv.decode(Buffer.from(stderr, "binary"), "utf-8"));
          wss.close();
          ws.close();
        }
        if (stdout) {
          console.log(stdout);
          wss.send(iconv.decode(Buffer.from(stdout, "binary"), "utf-8"));
          wss.close();
          ws.close();
          execute = false;
        }
        if (error) {
          wss.send(
            iconv.decode(Buffer.from(error.toString(), "binary"), "utf-8")
          );
          wss.close();
          ws.close();
          execute = false;
        }
      });
    }
  });
};

const ScanHealth = async () => {
  const port = 5002;
  let ws = null
  const portInUse = await isPortInUse(port);
  if (portInUse) {
    console.log(`Port ${port} is already in use.`);
    return;
  }

  if (!ws) {
    ws = new WebSocket.Server({ port });
    console.log(`WebSocket server started on port ${port}`);
  }

  let execute = false;
  ws.on("connection", (wss) => {
    console.log("Conectado ao servidor ScanHealth.");
    if (!execute) {
      execute = true;
      sudo.exec(
        "dism /online /cleanup-image /scanhealth",
        { name: "scanhealth" },
        (error, stdout, stderr) => {
          if (stderr) {
            wss.send(iconv.decode(Buffer.from(stderr, "binary"), "utf-8"));
            wss.close();
            ws.close();
          }
          if (stdout) {
            console.log(stdout);
            wss.send(iconv.decode(Buffer.from(stdout, "binary"), "utf-8"));
            wss.close();
            ws.close();
            execute = false;
          }
          if (error) {
            wss.send(
              iconv.decode(Buffer.from(error.toString(), "binary"), "utf-8")
            );
            wss.close();
            ws.close();
            execute = false;
          }
        }
      );
    }
  });
};

const checkHealth = async () => {
  const port = 5002;
  let ws = null
  const portInUse = await isPortInUse(port);
  if (portInUse) {
    console.log(`Port ${port} is already in use.`);
    return;
  }

  if (!ws) {
    ws = new WebSocket.Server({ port });
    console.log(`WebSocket server started on port ${port}`);
  }

  let execute = false;
  ws.on("connection", (wss) => {
    console.log("Conectado ao servidor CheckHealth.");
    if (!execute) {
      execute = true;
      sudo.exec(
        "dism /online /cleanup-image /checkhealth",
        { name: "checkhealth" },
        (error, stdout, stderr) => {
          if (stderr) {
            // Converter stderr do formato OEM (cmd padrão) para UTF-8 antes de enviar
            wss.send(iconv.decode(Buffer.from(stderr, "binary"), "utf-8"));
            wss.close();
            ws.close();
          }
          if (stdout) {

            console.log(stdout);
            wss.send(iconv.decode(Buffer.from(stdout, "binary"), "utf-8"));
            wss.close();
            ws.close();
            execute = false;
          }
          if (error) {

            wss.send(
              iconv.decode(Buffer.from(error.toString(), "binary"), "utf-8")
            );
            wss.close();
            ws.close();
            execute = false;
          }
        }
      );
    }
  });
};

const RestoreHealth = async () => {
  const port = 5002;
  let ws = null
  const portInUse = await isPortInUse(port);
  if (portInUse) {
    console.log(`Port ${port} is already in use.`);
    return;
  }

  if (!ws) {
    ws = new WebSocket.Server({ port });
    console.log(`WebSocket server started on port ${port}`);
  }
  let execute = true;
  ws.on("connection", (wss) => {
    if (!execute) {
      execute = true;
      sudo.exec(
        "dism /online /cleanup-image /restorehealth",
        { name: "restorehealth" },
        (error, stdout, stderr) => {
          if (stderr) {
            // Converter stderr do formato OEM (cmd padrão) para UTF-8 antes de enviar
            wss.send(iconv.decode(Buffer.from(stderr, "binary"), "utf-8"));
            wss.close();
            ws.close();
          }
          if (stdout) {

            console.log(stdout);
            wss.send(iconv.decode(Buffer.from(stdout, "binary"), "utf-8"));
            wss.close();
            ws.close();
            execute = false;
          }
          if (error) {

            wss.send(
              iconv.decode(Buffer.from(error.toString(), "binary"), "utf-8")
            );
            wss.close();
            ws.close();
            execute = false;
          }
        }
      );
    }
  });
};

const CmdKey = async (command) => {
  const port = 5002;
  let ws = null
  const portInUse = await isPortInUse(port);
  if (portInUse) {
    console.log(`Port ${port} is already in use.`);
    return;
  }

  if (!ws) {
    ws = new WebSocket.Server({ port });
    console.log(`WebSocket server started on port ${port}`);
  }

  let execute = false;
  ws.on("connection", (wss) => {
    if (!execute) {
      execute = true;
      sudo.exec(
        `cmdkey ${command}`,
        { name: "cmdkey" },
        (error, stdout, stderr) => {
          if (stderr) {
            console.log(stderr);
            wss.send(iconv.decode(Buffer.from(stderr, "binary"), "utf-8"));
            wss.close();
            ws.close();
          }
          if (stdout) {
            console.log(stdout.toString());
            wss.send(iconv.decode(Buffer.from(stdout, "binary"), "utf-8"));
            wss.close();
            ws.close();
            execute = false;
          }
          if (error) {
            console.log(error);
            wss.send(
              iconv.decode(Buffer.from(error.toString(), "binary"), "utf-8")
            );

            wss.close();
            ws.close();
            execute = false;
          }
        }
      );
    }
  });
};

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

const CLICommand = async (command) => {
  const port = 5002;
  let ws = null;
  const portInUse = await isPortInUse(port);
  if (portInUse) {
    console.log(`Port ${port} is already in use.`);
    return;
  }else { 
    if (!ws) {
      ws = new WebSocket.Server({ port });
      console.log(`WebSocket server started on port ${port}`);
    }
  
    let execute = false;
    ws.on("connection", (wss) => {
      if (!execute) {
        execute = true;
        sudo.exec(command,
          { name: "CLICommand" },
          (error, stdout, stderr) => {
            if (stderr) {
              
              wss.send(iconv.decode(Buffer.from(stderr, "binary"), "utf-8"));
              wss.close();
              ws.close();
            }
            if (stdout) {
  
              console.log(stdout);
              wss.send(iconv.decode(Buffer.from(stdout, "binary"), "utf-8"));
              wss.close();
              ws.close();
              execute = false;
            }
            if (error) {
              
              wss.send(
                iconv.decode(Buffer.from(error.toString(), "binary"), "utf-8")
              );
              wss.close();
              ws.close();
              execute = false;
            }
          }
        );
      }
    });
  }

  
};
module.exports = {
  ChkDsk,
  SystemFileCheck,
  ScanHealth,
  checkHealth,
  RestoreHealth,
  ScanHealth,
  CmdKey,
  CLICommand
};
