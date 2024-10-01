const exec = require("child_process");
const logToFile = require("../utils/logToFile");
const { deleteFromSchedule } = require("../database/database");


const cancelShutdown = async (id) => {
    const comando = "shutdown -a";
    
    return new Promise((resolve, reject) => {
        exec.exec(comando, (error, stdout, stderr) => {
            if (error) {
                logToFile.logToFile(`Erro ao cancelar o shutdown: ${error.message}`);
                resolve({ ok: false, msg: error.message }); 
            } else if (stderr) {
                logToFile.logToFile(stderr);
                resolve({ ok: false, msg: stderr }); 
            } else {
                logToFile.logToFile('Shutdown cancelado com sucesso');
                deleteFromSchedule(id); 
                resolve({ ok: true, msg: 'Shutdown cancelado com sucesso' }); 
            }
        });
    });
};



module.exports = cancelShutdown;