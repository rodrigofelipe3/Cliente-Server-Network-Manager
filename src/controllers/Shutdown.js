const exec = require("child_process")
const logToFile = require("../utils/logToFile");

const Shutdown0 = (res) => { 
    exec('shutdown -s -t 3600', (error, stdout, stderr) => {
        if (error) {
          logToFile.logToFile(`Erro ao executar o comando: ${error.message}`);
          return res.status(500).json({error})
        }
    
        logToFile.logToFile('Comando de shutdown executado com sucesso');
        return res.status(200).json({msg: "Tudo Certo!"})
    });
}


module.exports = Shutdown0