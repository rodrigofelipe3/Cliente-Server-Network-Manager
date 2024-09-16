const axios = require('axios');
const si = require('systeminformation');
const os = require('os'); // Importa a biblioteca os
const logToFile = require('../utils/logToFile');


const sendProcessInfo = async () => {
    const psList = await import('ps-list');
    console.log(await psList.default())
    try {
        const currentLoad = await si.currentLoad()
        const process = await si.processes()
        const computerData = {
            avgLoad: currentLoad.avgLoad,
            currentLoad: currentLoad.currentLoad,
            currentLoadSystem: currentLoad.currentLoadSystem,
            rawCurrentLoad: currentLoad.rawCurrentLoad,
            process: process.all,
            //processlist: process.list,
            
        };
        
        console.log(await computerData)

        /*const response = await fetch("http://localhost:5000/api/managertask", { 
            method: "POST",
            headers: { 
                "Content-Type":"application/json"
            },
            body: JSON.stringify(computerData)
            
        })*/

        /*const response = await axios.post('http://localhost:5000/api/registerComputer', computerData);*/
        logToFile('Dados enviados com sucesso:', response);
    } catch (error) {
        logToFile('Erro ao coletar ou enviar dados:', error);
    }
};

module.exports = sendProcessInfo