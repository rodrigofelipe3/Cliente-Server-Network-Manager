const os = require("os"); // Importa a biblioteca os
const logToFile = require("../utils/logToFile");
const { UpdateRegister, isRegistred } = require("../database/database");
const fetch = require("node-fetch");
const loadConfig = require("../../loadConfig");
const { exec } = require("child_process");
const { spawn } = require('child_process');

// Função para executar comandos no CMD
const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, { encoding: "utf8" }, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr.trim());
      }
      resolve(stdout.trim());
    });
  });
};

// Obter informações do sistema
const sendComputerInfo = async () => {
  try {
    // Processador
    const cpuInfo = await executeCommand("wmic cpu get Name /format:list");
    const processor = cpuInfo.split("=")[1].trim();
    // Memória
    const memInfo = await executeCommand(
      "wmic ComputerSystem get TotalPhysicalMemory /format:list"
    );
    const memory = Math.round(
      memInfo.split("=")[1].trim() / (1024 * 1024 * 1024)
    );

    // Disco rígido
    const diskInfo = await executeCommand(
      "wmic diskdrive get Caption /format:list"
    );
    const hardDisk = diskInfo.trim()
      .split("\r\n")
      .filter((line) => line )
      .map((line) => line.split("=")[1]);
    const FilteredHardDisk = hardDisk.filter(hd => { if(hd != undefined) return hd})
    // Sistema operacional
    const osInfo = await executeCommand(
      "wmic os get Caption,OSArchitecture,Version /format:list"
    );
    const osLines = osInfo.split("\r\n").filter((line) => line);
    const operatingSystem = osLines
      .find((line) => line.startsWith("Caption"))
      .split("=")[1];
    const arch = osLines
      .find((line) => line.startsWith("OSArchitecture"))
      .split("=")[1];
    const release = osLines
      .find((line) => line.startsWith("Version"))
      .split("=")[1];

    // Monitores (obter resolução)
    const monitorsinfo = await getMonitorResolutions()

    const monitors = Array.isArray(monitorsinfo) ? monitorsinfo : monitorsinfo.replace('"', "")
    // IP e endereço MAC
    const ipConfig = await executeCommand("ipconfig");
    const ipMatch = ipConfig.match(/Endere�o IPv4.*:\s*([\d.]+)/);
    const ip = ipMatch ? ipMatch[1] : "Not Available";
    const macConfig = await executeCommand("getmac");
    const macAddressSplited = macConfig.split("\r\n")[2]?.trim().split("   ") || "Not Available";
    const macAddress = macAddressSplited[0]

    // Nome do host
    const host = os.hostname();

    // Adaptadores de rede (filtro aplicado)
    const networkAdapters = await executeCommand(
      "wmic nic get Name,NetConnectionID /format:list"
    );
    const filteredNetworkDevices = networkAdapters
      .split("\r\n\r\n") // Divide os adaptadores em blocos
      .map((block) => {
        return block.trim().split(/\n\s*\n/).map(block => {
          const lines = block.split("\n"); // Divide cada bloco em linhas
          const obj = {};
          lines.forEach(line => {
            const [key, value] = line.split("=").map(s => s.trim());
            obj[key] = value;
          });
          return obj;
        })
        .filter(device => {
          // Filtro para excluir dispositivos com NetConnectionID vazio, "vEthernet", ou "Conex�o de Rede Bluetooth"
          return device.NetConnectionID && 
                 device.NetConnectionID !== "Conex�o de Rede Bluetooth"
        })
      })
      
    const Devices = filteredNetworkDevices.map(device => { 
      return device.map(device2 => { 
        return device2.Name
      })
    })
    isRegistred(async (err, row) => {
      if (err) {
        logToFile.logToFile(err);
      }
      // Montar JSON
      const computerData = {
        processor,
        memory: `${memory} GB`,
        hard_disk: FilteredHardDisk,
        operating_system: operatingSystem,
        arch,
        release,
        monitors,
        ip,
        mac_address: macAddress,
        host,
        network_devices: Devices,
        powerstatus: true,
      };
      console.log(computerData)
      const { version, serverIP } = await loadConfig.loadConfig();
      const response = await fetch(
        `http://${serverIP}:5000/api/registerComputer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(computerData),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.ok == true) {
            UpdateRegister();
          } else {
            logToFile.logToFile("Erro no fetch ao atualizar estado");
          }
        }).catch((err) => {
          logToFile.logToFile("Erro no Fetch (sendInfoCOmputer): " + err)
        })
      logToFile.logToFile("Dados enviados com sucesso:", response);
    });

  } catch (error) {
    console.error("Erro ao obter informações do sistema:", error);
  }
};


function getMonitorResolutions() {
  return new Promise((resolve, reject) => {
    const powershellCommand = `
        Add-Type -AssemblyName System.Windows.Forms;
        $screens = [System.Windows.Forms.Screen]::AllScreens;
        $result = @();
        foreach ($screen in $screens) {
            $result += @{ Resolution = "$($screen.Bounds.Width)x$($screen.Bounds.Height)" };
        }
        $result | ConvertTo-Json -Depth 1
        `;

    const ps = spawn('powershell', ['-Command', powershellCommand]);

    let output = '';
    let errorOutput = '';

    ps.stdout.on('data', (data) => {
      output += data.toString();
    });

    ps.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    ps.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Erro ao executar PowerShell: ${errorOutput || `Código de saída: ${code}`}`));
      }

      try {
        const resolutions = JSON.parse(output.trim());
        if(Array.isArray(resolutions)){ 
          const resolutionArray = resolutions?.map(screen => screen.Resolution);
          resolve(resolutionArray);
        }else { 
          resolve(JSON.stringify(resolutions.Resolution))
        }
        
      } catch (error) {
        reject(new Error(`Erro ao processar os dados JSON: ${error.message}. Saída: ${output}`));
      }
    });
  });
}



module.exports = sendComputerInfo;
