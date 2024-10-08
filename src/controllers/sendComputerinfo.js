const si = require('systeminformation');
const os = require('os'); // Importa a biblioteca os
const logToFile = require('../utils/logToFile');
const { loadConfig } = require('../../loadConfig');
const { UpdateRegistered } = require('../database/database');

const sendComputerInfo = async (ip) => {
    try {
        const cpu = await si.cpu();
        const mem = await si.mem();
        const osInfo = await si.osInfo();
        const networkInterfaces = await si.networkInterfaces();

        const ipv4 = networkInterfaces.find(net => net.ip4 !== undefined)?.ip4 || 'N/A';
        const macAddress = networkInterfaces.find(net => net.mac !== undefined)?.mac || 'N/A';
        const host = os.hostname();
        const networkDevices = networkInterfaces.map(net => net.iface).join(', ');

        const server = loadConfig()
        
        const computerData = {
            processor: cpu.manufacturer + ' ' + cpu.brand,
            memory: mem.total,
            operating_system: osInfo.distro,
            arch: osInfo.arch,
            release: osInfo.release,
            ip: ipv4,
            mac_address: macAddress,
            host: host,
            network_devices: networkDevices,
        };
        console.log(computerData)
        const response = await fetch(`http://${server}:5000/api/registerComputer`, {
            method: "POST",
            headers: { 
                "Content-Type":"application/json"
            },
            body: JSON.stringify(computerData)
        })
        .then(response => response.json())
        .then(data => { 
            if(data.ok == true) { 
                UpdateRegistered()
            }else { 
                logToFile.logToFile("Erro no fetch ao atualizar estado")
            }
        })

        logToFile.logToFile('Dados enviados com sucesso:', response);
    } catch (error) {
        logToFile.logToFile('Erro ao coletar ou enviar dados:', error);
    }
};



module.exports = sendComputerInfo;