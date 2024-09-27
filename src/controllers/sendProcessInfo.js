
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

  async function getTopMemoryProcesses() {
    const processes = await si.processes();
    
    // Ordenar pelo uso de memória (em ordem decrescente)
    const topProcesses = processes.list
      .sort((a, b) => b.mem - a.mem) // Ordena os processos pelo uso de memória
      .slice(0, 15); // Pega os 15 processos que mais usam memória
  
    // Monta os detalhes dos processos no formato "Detalhes" do Gerenciador de Tarefas
    const processDetails = await Promise.all(topProcesses.map(async (proc) => {
      return {
        name: proc.name,
        pid: proc.pid,
        memory: (proc.mem).toFixed(2), // memória usada em MB (ou porcentagem)
        cpu: proc.cpu.toFixed(2), // uso do processador em %
      };
    }));
  
    return processDetails;
  }

  const sendProcessInfoByMemory = async () => {
    try {
      const systemStats = await getSystemStats();
      const processList = await getTopMemoryProcesses(); // Agora usando os processos que mais usam memória
      const computerData = { 
        system: systemStats,
        processes: processList,
      };
      
      logToFile.logToFile('Dados de processos que mais usam memória enviados com sucesso');
      console.log(computerData);
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
        cpu: proc.cpu.toFixed(2), // uso do processador em %
        memory: (proc.mem).toFixed(2), // memória usada em MB
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