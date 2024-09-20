
const si = require('systeminformation');
const os = require('os'); // Importa a biblioteca os
const logToFile = require('../utils/logToFile');


async function getProcessListByMemory() {
  
    const processes = await si.processes();
    const memInfo = await si.mem();

    const topProcessesByMemory = processes.list
      .sort((a, b) => b.mem - a.mem)
      .slice(0, 15);

    const processDetails = topProcessesByMemory.map(proc => {
      const memoryPercent = ((proc.mem / memInfo.total) * 100).toFixed(2);
      return {
        name: proc.name,
        cpu: proc.cpu.toFixed(2),
        memoryPercent: memoryPercent,
        pid: proc.pid
      };
    });
    console.log(processDetails)
    return processDetails;
  
}
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
      .slice(0, 15); 
  
    const processDetails = await Promise.all(topProcesses.map(async (proc) => {
      return {
        name: proc.name,
        cpu: proc.cpu.toFixed(2), // uso do processador em %
        memory: (proc.mem).toFixed(2), // memória usada em MB
        pid: proc.pid
      };
    }));

    return processDetails
}


const sendProcessInfoByMemory = async () => {
  try {
    const systemStats = await getSystemStats();
    const processListByMemory = await getProcessListByMemory();
    const computerData = {
      system: systemStats,
      processes: processListByMemory
    };
    logToFile.logToFile('Dados de processos por uso de memória enviados com sucesso');
    
    return computerData;
  } catch (error) {
    logToFile.logToFile('Erro ao coletar ou enviar dados de memória:', error);
  }
};

const sendProcessInfo = async () => {
    try {
        const systemStats = await getSystemStats();
        const processList = await getProcessList();
        const computerData = { 
            system: systemStats,
            processes: processList
        }
        logToFile.logToFile('Dados enviados com sucesso');
        console.log(computerData)
        return computerData
    } catch (error) {
      logToFile.logToFile('Erro ao coletar ou enviar dados:', error);
    }
};

module.exports = {
  sendProcessInfo,
  sendProcessInfoByMemory
  }
