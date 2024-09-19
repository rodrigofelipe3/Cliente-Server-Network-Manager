const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const logToFile = require("../utils/logToFile");

const db = new sqlite3.Database(path.join(__dirname, "database.db"), (err) => {
  if (err) {
    logToFile.logToFile(`Erro ao conectar ao banco de dados: ${err}`);
  } else {
    logToFile.logToFile("Conectado ao banco de dados SQLite.");
  }
});

const CreateTable = () => {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS schedule (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            time TEXT NOT NULL DEFAULT '18:30'
        );`,
      (err) => {
        if (err) {
          logToFile.logToFile(`Erro ao criar a tabela: ${err}`);
        } else {
          logToFile.logToFile('Tabela "schedule" criada com sucesso.');
        }
      }
    );

    db.run(`INSERT INTO schedule (time) VALUES ('18:30')`);

  });
};

const updateSchedule = (newTime, res) => {
  db.run(`UPDATE schedule SET time = ? WHERE id = 1`, [newTime], (err) => {
    if (err) {
      logToFile.logToFile(`Erro ao atualizar o horário: ${err.message}`);
      return res.status(500);
    }
    logToFile.logToFile(`Horário atualizado para: ${newTime}`);
    return res.status(200);
  });
};

const deleteFromSchedule = (id, res) => {
    db.serialize(() => {
       return db.run(`DELETE FROM schedule WHERE id = ?`, [id], function(err) {
                if (err) {
                    return res.status(500).json({error: err})
                } else {
                  return res.status(200).json({ok: "Cancelamento feito com sucesso!"})
                }
            });
    });
}

const GetData = (callback) => {
  db.get(`SELECT time FROM schedule WHERE id = 1`, (err, row) => {
    if (err) {
      logToFile.logToFile(`Erro ao consultar a tabela: ${err.message}`);
      return callback(err, null);
    } else {
      return callback(null, row);
    }
  });
};
module.exports = {
  CreateTable,
  updateSchedule,
  GetData,
  deleteFromSchedule
};
