const si = require("systeminformation");
const os = require("os"); // Importa a biblioteca os
const logToFile = require("../utils/logToFile");
const { UpdateRegister, isRegistred } = require("../database/database");
const fetch = require("node-fetch");
const  loadConfig  = require("../../loadConfig");

const sendComputerInfo = async () => {
  
  
  try {
    const cpu = await si.cpu();
    const mem = await si.mem();
    const osInfo = await si.osInfo();
    const networkInterfaces = await si.networkInterfaces();
    const diskData = await si.diskLayout();
    const storageDevices = diskData.map((disk) => {
      return `${disk.name} `; 
    });

    const graphicsData = await si.graphics();
    const displays = graphicsData.displays;
        const monitorInfo = displays.map((display, index) => {
            const resolution = `${display.resolutionX}x${display.resolutionY}`;
            return `Tela ${index + 1}: ${resolution}`;
        });
    const adaptadoresRemover = ['Loopback Pseudo-Interface 1', 'Hyper-V Virtual Ethernet Adapter', 'Bluetooth Device (Personal Area Network)'];
    const ipv4 = networkInterfaces.find((net) => net.ip4 !== undefined)?.ip4 || "N/A";
    const macAddress = networkInterfaces.find((net) => net.mac !== undefined)?.mac || "N/A";
    const host = os.hostname();
    const networkDevices = networkInterfaces.map((net) => net.ifaceName).join(" , ")
    const filtredDevices = networkDevices.split(" , ")
    
    
    isRegistred(async (err, row) => {
      if (err) {
        logToFile.logToFile(err);
      }
      const poweroff = row.poweroff;
      const poweroffhour = row.time;

      const computerData = {
        processor: cpu.manufacturer + " " + cpu.brand,
        memory: mem.total,
        hard_disk: storageDevices,
        operating_system: osInfo.distro,
        arch: osInfo.arch,
        release: osInfo.release,
        monitors: monitorInfo,
        ip: ipv4,
        mac_address: macAddress,
        host: host,
        network_devices: filtredDevices.filter(data => !adaptadoresRemover.includes(data)),
        poweroff: poweroff,
        poweroffhour: poweroffhour,
        powerstatus: true,
      };
      console.log(computerData);
      const server = await loadConfig.loadConfig();
      const response = await fetch(
        `http://${server}:5000/api/registerComputer`,
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
        }).catch((err)=> { 
          logToFile.logToFile("Erro no Fetch (sendInfoCOmputer): " + err)
        })
        logToFile.logToFile("Dados enviados com sucesso:", response);
    });
    
  } catch (error) {
    logToFile.logToFile("Erro ao coletar ou enviar dados:", error);
    console.log(error)
  }
};

module.exports = sendComputerInfo;
