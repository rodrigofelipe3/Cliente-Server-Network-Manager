const exec = require("child_process")
const logToFile = require("../utils/logToFile");

const Shutdown0 = (res, seconds) => {
  return new Promise((resolve, reject) => {
    exec(`shutdown -s -t ${seconds}`, (error, stdout, stderr) => {
      if (error) {
        logToFile.logToFile(`Erro ao executar o comando: ${error.message}`);
        resolve({ ok: false, error: error })
      } else if (stderr) {
        logToFile.logToFile(`Erro ao executar comando: ${stderr}`);
        resolve({ ok: false, error: stderr })
      }

      logToFile.logToFile('Comando de shutdown executado com sucesso');
      resolve({ ok: true, msg: "Computador desligado!" })
    });
  })
}

module.exports = Shutdown0