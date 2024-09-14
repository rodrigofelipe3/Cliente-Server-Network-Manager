const exec = require("child_process");
const logToFile = require("../utils/logToFile");


const cancelShutdown = (res) => {
    exec('shutdown -a', (error, stdout, stderr) => {
        if (error) {
            logToFile(`Erro ao cancelar o shutdown: ${error.message}`);
            return res.status(500).json({error: 'Erro ao cancelar o shutdown'});
        }

        logToFile('Shutdown cancelado com sucesso');
        return res.status(200).json({msg: 'Shutdown cancelado com sucesso'});
    });
};

module.exports = cancelShutdown;