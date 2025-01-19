const exec = require("child_process");
const {logToFile} = require("../utils/logToFile");
const { deleteFromSchedule } = require("../database/database");


const cancelShutdown = async (id) => {
    const comando = "shutdown -a";
    
    return new Promise((resolve, reject) => {
        exec.exec(comando, (error, stdout, stderr) => {
            if (error) {
                logToFile(`Erro ao cancelar o shutdown: ${error.message}`);
                resolve({ ok: false, msg: error.message }); 
                console.log(error)
            } else if (stderr) {
                logToFile(stderr);
                console.log(stderr)
                resolve({ ok: false, msg: stderr }); 
            } else {
                logToFile('Shutdown cancelado com sucesso');
                console.log('Shutdown Cancelado')
                deleteFromSchedule(id); 
                resolve({ ok: true, msg: 'Shutdown cancelado com sucesso' }); 
            }
        });
    });
};



module.exports = cancelShutdown;