const WebSocket = require("ws");
const sudo = require("sudo-prompt");
const iconv = require("iconv-lite"); // Importando o iconv-lite

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
  // Se a porta já está em uso, encerra o processo atual
  if (portInUse) {
    console.log(`Port ${port} is already in use. Reusing existing server.`);
    return;
  }

  // Cria um novo WebSocket Server se ainda não estiver criado
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
          }
          if (stdout) {
            console.log(stdout);
            wss.send(iconv.decode(Buffer.from(stdout, "binary"), "utf-8"));
            wss.close();
          }
          if (error) {
            wss.send(iconv.decode(Buffer.from(error.toString(), "binary"), "utf-8"));
            wss.close();
          }

          // Encerra o servidor WebSocket para evitar conflito de portas
          execute = false;
          ws.close(() => {
            console.log("WebSocket server closed.");
          });
        }
      );
    }
  });

  // Lida com erros do servidor WebSocket
  ws.on("error", (err) => {
    console.error(`WebSocket server error: ${err.message}`);
    ws.close();
  });

  // Fecha o servidor WebSocket ao encerrar o processo
  process.on("SIGINT", () => {
    if (ws) {
      ws.close(() => {
        console.log("WebSocket server closed on process termination.");
        process.exit();
      });
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
  let execute = false;
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

const isPortInUse = async (port) => {
  const net = require("net");
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once("error", (err) => {
        if (err.code === "EADDRINUSE") {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .once("listening", () => {
        tester.close(() => resolve(false));
      })
      .listen(port);
  });
};

const CLICommand = async (command) => {
  const port = 5002;
  let ws = null;
  const portInUse = await isPortInUse(port);
  if (portInUse) {
    console.log(`Port ${port} is already in use.`);
    return;
  } else {
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
