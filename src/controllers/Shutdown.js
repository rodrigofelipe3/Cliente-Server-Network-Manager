const {exec} = require("child_process")
const logToFile = require("../utils/logToFile");

const Shutdown0 = (seconds) => {
  return new Promise((resolve, reject) => {
    console.log(seconds)
    exec(`shutdown -s -t ${seconds}`, (error, stdout, stderr) => {
      if (error) {
        logToFile.logToFile(`Erro ao executar o comando: ${error.message}`);
        console.log(error)
        resolve({ ok: false, error: error })
      } else if (stderr) {
        onsole.log(stderr)
        logToFile.logToFile(`Erro ao executar comando: ${stderr}`);
        resolve({ ok: false, error: stderr })
      }
      console.log(stdout)
      logToFile.logToFile('Comando de shutdown executado com sucesso');
      resolve({ ok: true, msg: "Computador desligado!" })
    });
  })
}

const Restart = () => { 
  return new Promise((resolve, reject) => {
    const seconds = 100
    exec(`shutdown /r /f /t ${seconds}`, (error, stdout, stderr) => {
      if (error) {
        logToFile.logToFile(`Erro ao executar o comando: ${error.message}`);
        resolve({ ok: false, error: error })
      } else if (stderr) {
        
        logToFile.logToFile(`Erro ao executar comando: ${stderr}`);
        resolve({ ok: false, error: stderr })
      }
      console.log(stdout)
      logToFile.logToFile('Comando de shutdown executado com sucesso');
      resolve({ ok: true, msg: "Computador reiniciado!" })
    });
  })
}

module.exports = {Shutdown0, Restart}