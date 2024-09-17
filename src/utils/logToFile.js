const fs = require('fs');
const path = require('path');

const logToFile = (message) => {
    console.log(path.basename(""))
    //const logFilePath = path.join("C:/Users/Rodrigo/Documents/Programação/ClienteServer", 'log.txt');
    const logFilePath = path.join(__dirname, 'log.txt');
    const logMessage = `${new Date().toISOString()} - ${message}\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Erro ao escrever no arquivo de log:', err.message);
        } else {
            console.log('Mensagem de log gravada com sucesso.');
        }
    });
};

module.exports = logToFile