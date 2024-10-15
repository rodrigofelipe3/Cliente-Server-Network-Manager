const { spawn } = require('child_process');
const {logToFile} = require("../utils/logToFile");
const { loadConfig } = require('../../loadConfig');

const ChkDsk = async () => {
    const cmdProcess = spawn('cmd', ['/c', 'chkdsk /f']);
    const server = loadConfig()
    cmdProcess.stdout.on('data', (data) => {
     if (data.toString().includes("(S/N)") || data.toString().includes("Sim/Não")) {
        cmdProcess.stdin.write('S\n');
      }
    });
    cmdProcess.stderr.on('data', (data) => {
        logToFile(`Erro: ${data.toString()}`);
        return ({ok: false, error: data})
    });
    cmdProcess.on('close', (code) => {
      logToFile(`Processo finalizado com código ${code}`);
      return({ok: true, msg: code})
    });
 

}

const SystemFileCheck = () => {
  return new Promise((resolve, reject) => {
    const cmdProcess = spawn('cmd', ['/c', 'sfc /scannow']);

    cmdProcess.stdout.on('data', (data) => {
        resolve({ok: true, msg: data })
    });

    cmdProcess.stderr.on('data', (data) => {
        logToFile(`Erro: ${data.toString()}`);
        resolve({ok: false, error: data})
    });

    cmdProcess.on('close', (code) => {
      logToFile(`Processo finalizado com código ${code}`);
      resolve({ok: false, error: data})
    });
  })

}


module.exports = { ChkDsk, SystemFileCheck}