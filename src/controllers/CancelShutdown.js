const exec = require("child_process");
const logToFile = require("../utils/logToFile");
const { deleteFromSchedule } = require("../database/database");


const cancelShutdown = async (id) => {
    const comando = "shutdown -a";
    
    return new Promise((resolve, reject) => {
        exec.exec(comando, (error, stdout, stderr) => {
            if (error) {
                logToFile.logToFile(`Erro ao cancelar o shutdown: ${error.message}`);
                resolve({ ok: false, msg: error.message }); // Retorna o erro
            } else if (stderr) {
                logToFile.logToFile(stderr);
                resolve({ ok: false, msg: stderr }); // Retorna o stderr
            } else {
                logToFile.logToFile('Shutdown cancelado com sucesso');
                deleteFromSchedule(id); // Executa a função de deletar
                resolve({ ok: true, msg: 'Shutdown cancelado com sucesso' }); // Retorna sucesso
            }
        });
    });
};

module.exports = cancelShutdown;