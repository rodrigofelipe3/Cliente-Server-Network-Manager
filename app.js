const express = require("express");
const sendHeartbeat = require("./src/controllers/SendAHb");
const route = require("./src/routes/routes");
const cors = require("cors");
const { exec } = require('child_process')
const logToFile = require("./src/utils/logToFile");
const sendComputerInfo = require("./src/controllers/sendComputerinfo");
const { CreateDatabase, GetFoundServer } = require("./src/database/database");
const { ChangeWallPaper } = require("./src/utils/ChangeWallpaper");
const { loadConfig } = require("./loadConfig");
const { ManagerUpdates } = require("./src/utils/UpdateProgram");
const { findIpResponse } = require("./src/utils/findServer");

const app = express();
const PORT = 5001;
(async () => {
    try {

        const haveUpdates = await ManagerUpdates()
        const TableCreated = await CreateDatabase();
        if (haveUpdates == true) {
            exec('start "" """C:\\Program Files\\NetworkPower Manager\\Update.exe""" ')
        }
        else {
            
            // Altera o papel de parede
            ChangeWallPaper();
            if (TableCreated == true) {
                const {version, serverIp} = await loadConfig()
                GetFoundServer(async (err, row) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    const serverFound = row.serverfound;
                    if(serverIp == '') { 
                        findIpResponse('10.10.1.1', '10.10.1.253', 5000, '/api/')
                    }
                    if (serverFound === 1) {
                        //sendComputerInfo();
                        setInterval(sendHeartbeat, 50000);
                    }
                });

            }
            // Obtém informações do servidor encontrado

            // Inicializa o servidor após as etapas anteriores
            const options = { 

            }
            app.use(cors());
            app.use(express.json());
            app.use("/api", route);

            app.listen(PORT, (err) => {
                if (err) {
                    console.error("Erro ao iniciar o servidor:", err);
                    return;
                }
                logToFile.clearLogFile();
                logToFile.logToFile("Server rodando na porta 5001");
                console.log(`Servidor rodando na porta ${PORT}`);
            });
        }

    } catch (error) {
        console.error("Erro durante a inicialização:", error);
    }
})();
