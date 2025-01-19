const WebSocket = require("ws");
const sudo = require("sudo-prompt");
const iconv = require("iconv-lite"); // Importando o iconv-lite
const { exec } = require("child_process");

const ChkDsk = async () => {
  const ws = new WebSocket.Server({ port: 5002 });

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

const SystemFileCheck = () => {
  let execute = false;

  const ws = new WebSocket.Server({ port: 5002 });

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

const ScanHealth = () => {
  const ws = new WebSocket.Server({ port: 5002 });

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

const checkHealth = () => {
  const ws = new WebSocket.Server({ port: 5002 });

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
            // Converter stdout do formato OEM (cmd padrão) para UTF-8 antes de enviar
            console.log(stdout);
            wss.send(iconv.decode(Buffer.from(stdout, "binary"), "utf-8"));
            wss.close();
            ws.close();
            execute = false;
          }
          if (error) {
            // Converter error do formato OEM para UTF-8 antes de enviar
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

const RestoreHealth = () => {
  const ws = new WebSocket.Server({ port: 5002 });

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
            // Converter stdout do formato OEM (cmd padrão) para UTF-8 antes de enviar
            console.log(stdout);
            wss.send(iconv.decode(Buffer.from(stdout, "binary"), "utf-8"));
            wss.close();
            ws.close();
            execute = false;
          }
          if (error) {
            // Converter error do formato OEM para UTF-8 antes de enviar
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

const CmdKey = (command) => {
  const ws = new WebSocket.Server({ port: 5002 });
  console.log(command);
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
        resolve(stdout.includes(`:${port}`)); // Retorna true se a porta estiver em uso
      }
    });
  });
};

const OpenCMD = async () => {
  let ws = null
  const port = 444;

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

      wss.on("message", async (command) => {
        console.log(command.toString());
        if (command != null && command != undefined && command !== "close") {
          sudo.exec(
            `${command}`,
            { name: "command" },
            (error, stdout, stderr) => {
              if (stderr) {
                console.log(stderr);
                wss.send(iconv.decode(Buffer.from(stderr, "binary"), "utf-8"));
                execute = false;
              }
              if (stdout) {
                wss.send(iconv.decode(Buffer.from(stdout, "binary"), "utf-8"));
                execute = false;
              }
              if (error) {
                console.log(error);
                wss.send(
                  iconv.decode(Buffer.from(error.toString(), "binary"), "utf-8")
                );
                execute = false;
              }
            }
          );
        }
      });

      wss.on("close", () => {
        wss.close();
        ws.close();
      });
    }
  });
};

module.exports = {
  ChkDsk,
  SystemFileCheck,
  ScanHealth,
  checkHealth,
  RestoreHealth,
  ScanHealth,
  CmdKey,
  OpenCMD,
};
