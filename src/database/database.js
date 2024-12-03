const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const logToFile = require("../utils/logToFile");

const db = new sqlite3.Database("./database/database.db")

const CreateDatabase = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await CreateTable();

      if (response.ok === true) {
        isRegistred((err, row) => {
          if (err) {
            logToFile.logToFile(`Erro em isRegistred: ${err}`);
            return reject(false); // Rejeita em caso de erro
          }

          // Verifica se a tabela está vazia
          if (!row || (Array.isArray(row) && row.length === 0)) {
            console.log('Tabela vazia. Inserindo valores padrão...');
            db.run('INSERT INTO cliente DEFAULT VALUES;', [], (err) => {
              if (err) {
                logToFile.logToFile(`Erro ao inserir valores padrão: ${err}`);
                return reject(false); // Rejeita em caso de erro
              }
              logToFile.logToFile("Valores padrões inseridos com sucesso!");
              resolve(true); // Resolve com sucesso
            });
          } else {
            // A tabela já possui dados
            resolve(true);
          }
        });
      } else {
        logToFile.logToFile("Erro em CreateTable: resposta não OK.");
        reject(false); // Rejeita se CreateTable não retornar `ok`
      }
    } catch (error) {
      logToFile.logToFile(`Erro inesperado em CreateDatabase: ${error}`);
      reject(false); // Rejeita em caso de erro inesperado
    }
  });
};



const CreateTable = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS cliente (
            id INTEGER PRIMARY KEY,
            time TEXT NOT NULL DEFAULT '18:30',
            registred INTEGER NOT NULL DEFAULT 0,
            poweroff INTEGER NOT NULL DEFAULT 1,
            serverfound INTEGER NOT NULL DEFAULT 0
        );
        `,
        (err) => {
          if (err) {
            logToFile.logToFile(`Erro ao criar a tabela: ${err}`);

            console.log('Erro ao criar tabela cliente' + err)
            resolve({ ok: false })
          } else {
            resolve({ ok: true })
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
        return true
      }
    });
  });
}

const GetTime = (callback) => {
  db.get(`SELECT time FROM cliente WHERE id = 1`, (err, row) => {
    if (err) {
      logToFile.logToFile(`Erro ao consultar a tabela: ${err.message}`);
      return callback(err, null);
    } else {
      return callback(null, row);
    }
  });
};

const GetFoundServer = (callback) => {
  db.get(`SELECT serverfound FROM cliente WHERE id = 1`, (err, row) => {
    if (err) {
      logToFile.logToFile(`Erro ao consultar a tabela: ${err.message}`);
      return callback(err, null);
    } else {
      return callback(null, row);
    }
  });
};

const UpdateServerFound = () => {
  console.log('Executando Update Server Found')
  db.run('UPDATE cliente SET serverfound = 1 WHERE id = 1', [], (err) => {
    if (err) {
      logToFile.logToFile("Erro ao atualizar o estado de Registro" + err)
    }
  })
}

const UpdateRegister = () => {
  db.run('UPDATE cliente SET registred = 1 WHERE id = 1', [], (err) => {
    if (err) {
      logToFile.logToFile("Erro ao atualizar o estado de Registro" + err)
    }
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
  GetTime,
  deleteFromSchedule,
  UpdateRegister,
  isRegistred,
  CreateDatabase,
  UpdateServerFound,
  GetFoundServer
};
