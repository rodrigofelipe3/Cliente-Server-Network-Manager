
const si = require('systeminformation');
const os = require('os'); // Importa a biblioteca os
const logToFile = require('../utils/logToFile');



async function getSystemStats() {
    const cpu = await si.currentLoad();
    const mem = await si.mem();
  
    return {
      cpuUsage: cpu.currentLoad.toFixed(2), 
      memoryUsage: ((mem.used / mem.total) * 100).toFixed(2), 
    };
  }

  async function getTopMemoryProcesses() {
    const processes = await si.processes();
    
    const topProcesses = processes.list
      .sort((a, b) => b.mem - a.mem) 
      .slice(0, 15); 
    const processDetails = await Promise.all(topProcesses.map(async (proc) => {
      return {
        name: proc.name,
        pid: proc.pid,
        memory: (proc.mem).toFixed(2), 
        cpu: proc.cpu.toFixed(2), 
      };
    }));
  
    return processDetails;
  }

  const sendProcessInfoByMemory = async () => {
    try {
      const systemStats = await getSystemStats();
      const processList = await getTopMemoryProcesses(); 
      const computerData = { 
        system: systemStats,
        processes: processList,
      };
      
      logToFile.logToFile('Dados de processos que mais usam memória enviados com sucesso');
      
      return computerData;
    } catch (error) {
      logToFile.logToFile('Erro ao coletar ou enviar dados de memória:', error);
    }
  };


async function getProcessList() {
    const processes = await si.processes();
    const topProcesses = processes.list
      .sort((a, b) => b.cpu - a.cpu) 
      .slice(0, 15); 
  
    const processDetails = await Promise.all(topProcesses.map(async (proc) => {
      return {
        name: proc.name,
        cpu: proc.cpu.toFixed(2),
        memory: (proc.mem).toFixed(2), 
        pid: proc.pid
      };
    }));

    return processDetails
}



const sendProcessInfo = async () => {
    try {
        const systemStats = await getSystemStats();
        const processList = await getProcessList();
        const computerData = { 
            system: systemStats,
            processes: processList
        }
        logToFile.logToFile('Dados enviados com sucesso');
        
        return computerData
    } catch (error) {
      logToFile.logToFile('Erro ao coletar ou enviar dados:', error);
    }
};

module.exports = {
  sendProcessInfo,
  sendProcessInfoByMemory
  }