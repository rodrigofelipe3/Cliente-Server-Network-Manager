const si = require('systeminformation');
const os = require('os'); // Importa a biblioteca os
const logToFile = require('../utils/logToFile');

const sendComputerInfo = async (ip) => {
    try {
        const cpu = await si.cpu();
        const mem = await si.mem();
        const osInfo = await si.osInfo();
        const networkInterfaces = await si.networkInterfaces();
        const networkStats = await si.networkStats();

        const ipv4 = networkInterfaces.find(net => net.ip4 !== undefined)?.ip4 || 'N/A';
        const macAddress = networkInterfaces.find(net => net.mac !== undefined)?.mac || 'N/A';
        const host = os.hostname();
        const networkDevices = networkInterfaces.map(net => net.iface).join(', ');
        const networkSpeeds = networkStats.map(stat => `${stat.iface}: ${(stat.rx_sec / 1024).toFixed(2)} KB/s`).join(', ');
        const adapterTypes = networkInterfaces.map(net => `${net.iface}: ${net.type}`).join(', ');

        
        const mainAdapter = networkStats
            .filter(stat => stat.rx_sec > 0 || stat.tx_sec > 0) // Filtrar por adaptadores que estão enviando/recebendo dados
            .map(stat => stat.iface)[0] || 'N/A'; // Pega o primeiro adaptador com tráfego de dados

        const mainAdapterDetails = networkInterfaces.find(net => net.iface === mainAdapter) || { iface: 'N/A', type: 'N/A' };

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
            network_speed: networkSpeeds,
            adapter_types: adapterTypes,
            main_adapter: `${mainAdapterDetails.iface} (${mainAdapterDetails.type})`, // Adaptador principal
        };
        
        const response = await fetch(`http://${"10.10.1.45"}:5000/api/registerComputer`, {
            method: "POST",
            headers: { 
                "Content-Type":"application/json"
            },
            body: JSON.stringify(computerData)
        });
        console.log(response)
        logToFile.logToFile('Dados enviados com sucesso:', response);
    } catch (error) {
        logToFile.logToFile('Erro ao coletar ou enviar dados:', error);
    }
};

module.exports = sendComputerInfo;
