const fs = require('fs');

const clearLogFile = () => {
    if (fs.existsSync("./log/log.txt")) {
        fs.unlink("./log/log.txt", (err) => {
            if (err) {
                console.error('Erro ao apagar o arquivo de log:', err.message);
            } else {
                console.log('Arquivo de log apagado com sucesso.');
            }
        });
    } else {
        console.log('Nenhum arquivo de log encontrado.');
    }
};

const logToFile = (message) => {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;

    fs.appendFile("./log/log.txt", logMessage, (err) => {
        if (err) {
            console.error('Erro ao escrever no arquivo de log:', err.message);
        } else {
            console.log('Mensagem de log gravada com sucesso.');
        }
    });
};

module.exports = { logToFile, clearLogFile };
