const axios = require('axios');
const si = require('systeminformation');
const os = require('os'); // Importa a biblioteca os
const logToFile = require('../utils/logToFile');

const sendComputerInfo = async () => {
    try {
        const cpu = await si.cpu();
        const mem = await si.mem();
        const osInfo = await si.osInfo();
        const networkInterfaces = await si.networkInterfaces();
        const ipv4 = networkInterfaces.find(net => net.ip4 !== undefined)?.ip4 || 'N/A';
        const macAddress = networkInterfaces.find(net => net.mac !== undefined)?.mac || 'N/A';
        const host = os.hostname();

        const computerData = {
            processor: cpu.manufacturer + ' ' + cpu.brand,
            memory: mem.total,
            operating_system: osInfo.distro,
            arch: osInfo.arch,
            release: osInfo.release,
            ip: ipv4,
            mac_address: macAddress,
            host: host, 
        };

        const response = await axios.post('http://localhost:5000/api/registerComputer', computerData);
        logToFile('Dados enviados com sucesso:', response);
    } catch (error) {
        logToFile('Erro ao coletar ou enviar dados:', error);
    }
};

module.exports = sendComputerInfo