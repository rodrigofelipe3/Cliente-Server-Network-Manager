const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logToFile = require('../utils/logToFile');

const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
    if (err) {
        logToFile(`Erro ao conectar ao banco de dados: ${err}`);
    } else {
        logToFile('Conectado ao banco de dados SQLite.');
    }
});

const CreateTable = () => { 

    db.run(`CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        time TEXT NOT NULL
    )`, (err) => {
        if (err) {
            logToFile(`Erro ao criar a tabela: ${err}`);
        } else {
            logToFile('Tabela "schedule" criada com sucesso.');
        }
    });
}

const updateSchedule = (newTime, res) => {
    db.run(`UPDATE schedule SET time = ? WHERE id = 1`, [newTime], (err) => {
        if (err) {
            logToFile(`Erro ao atualizar o horário: ${err.message}`);
            return res.status(500)
        }
        logToFile(`Horário atualizado para: ${newTime}`);
        return res.status(200)
    });
};

const GetData = (callback) => { 
    db.get(`SELECT time FROM schedule WHERE id = 1`, (err, row) => {
        if (err) {
            logToFile(`Erro ao consultar a tabela: ${err.message}`);
            return callback(err, null);
        }else { 
            return callback(null, row)
        }
    })
}
module.exports = {
    CreateTable,
    updateSchedule,
    GetData
}