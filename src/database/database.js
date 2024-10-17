const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const logToFile = require("../utils/logToFile");

const db = new sqlite3.Database("./database/database.db")


const CreateDatabase = async () => {
  const response = await CreateTable()
  if(response.ok == true){ 
    isRegistred((err, row) => {
      if (Array.isArray(row) && row.length === 0 || row == null) {
        db.run('INSERT INTO cliente DEFAULT VALUES;', [], (err) => {
          if (err) {
            logToFile.logToFile(err)
          }
          console.log(row)
          logToFile.logToFile("Valores padrões inseridos com sucesso!")
        })
      }
    })
  }
}


const CreateTable = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS cliente (
            id INTEGER PRIMARY KEY,
            time TEXT NOT NULL DEFAULT '18:30',
            registred INTEGER NOT NULL DEFAULT 0,
            poweroff INTEGER NOT NULL DEFAULT 1
        );
        `,
        (err) => {
          if (err) {
            logToFile.logToFile(`Erro ao criar a tabela: ${err}`);
            resolve({ok: false})
          } else {
            logToFile.logToFile('Tabela "cliente" criada com sucesso.');
            resolve({ok: true})
          }
        }
      );
    })
  })
};

const updateSchedule = (newTime, res) => {
  db.run(`UPDATE cliente SET time = ? WHERE id = 1`, [newTime], (err) => {
    if (err) {
      logToFile.logToFile(`Erro ao atualizar o horário: ${err.message}`);
      return res.status(500).json({ ok: false, msg: err.message });
    }
    logToFile.logToFile(`Horário atualizado para: ${newTime}`);
    return res.status(200).json({ ok: true, msg: "Desligamento programado com sucesso!" });
  });
};

const deleteFromSchedule = (id) => {
  db.serialize(() => {
    return db.run(`UPDATE cliente SET time = 'none' WHERE id = ?`, [id], function (err) {
      if (err) {
        logToFile.logToFile("Erro ao deletar horário de desligamento: " + err)
        return false
      } else {
        logToFile.logToFile("Cancelamento feito com sucesso!")
        return true
      }
    });
  });
}

const GetData = (callback) => {
  db.get(`SELECT time FROM cliente WHERE id = 1`, (err, row) => {
    if (err) {
      logToFile.logToFile(`Erro ao consultar a tabela: ${err.message}`);
      return callback(err, null);
    } else {
      return callback(null, row);
    }
  });
};

const UpdateRegister = () => {
  db.run('UPDATE cliente SET registred = 1 WHERE id = 1', [], (err) => {
    if (err) {
      logToFile.logToFile("Erro ao atualizar o estado de Registro" + err)
    }
    logToFile.logToFile("Estado de registro atualizado com sucesso! ")
  })
}

const isRegistred = (callback) => {
  db.get('SELECT * FROM cliente WHERE id = 1', [], (err, row) => {

    if (err) {
      logToFile.logToFile("Erro ao consultar a tabela cliente: " + err)
      return callback(err, null)
    } else {
      return callback(null, row)
    }
  })

}
module.exports = {
  CreateTable,
  updateSchedule,
  GetData,
  deleteFromSchedule,
  UpdateRegister,
  isRegistred,
  CreateDatabase
};
