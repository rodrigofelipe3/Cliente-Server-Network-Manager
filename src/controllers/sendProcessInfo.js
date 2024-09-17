const axios = require('axios');
const si = require('systeminformation');
const os = require('os'); // Importa a biblioteca os
const logToFile = require('../utils/logToFile');


async function getSystemStats() {
    const cpu = await si.currentLoad();
    const mem = await si.mem();
  
    return {
      cpuUsage: cpu.currentLoad.toFixed(2), // uso do processador em %
      memoryUsage: ((mem.used / mem.total) * 100).toFixed(2), // uso de memória em %
    };
  }


async function getProcessList() {
    const processes = await si.processes();
    const topProcesses = processes.list
      .sort((a, b) => b.cpu - a.cpu) 
      .slice(0, 50); 
  
    const processDetails = await Promise.all(topProcesses.map(async (proc) => {
      return {
        name: proc.name,
        cpu: proc.cpu.toFixed(2), // uso do processador em %
        memory: (proc.mem).toFixed(2), // memória usada em MB
        pid: proc.pid
      };
    }));
}


const sendProcessInfo = async () => {
    try {
        const systemStats = await getSystemStats();
        const processList = await getProcessList();
        const computerData = { 
            system: systemStats,
            processes: processList
        }
        
        logToFile('Dados enviados com sucesso');
    } catch (error) {
        logToFile('Erro ao coletar ou enviar dados:', error);
    }
};

module.exports = sendProcessInfo
