const express = require("express");
const sendHeartbeat = require("./src/controllers/SendAHb");
const route = require("./src/routes/routes");
const cors = require("cors");
const logToFile = require("./src/utils/logToFile");
const sendComputerInfo = require("./src/controllers/sendComputerinfo");
const { CreateDatabase, GetFoundServer } = require("./src/database/database");
const { ChangeWallPaper } = require("./src/utils/ChangeWallpaper");
const { loadConfig } = require("./loadConfig");

const app = express();
const PORT = 5001;

(async () => {
    try {
        // Aguarda a criação do banco de dados
        const TableCreated = await CreateDatabase();

        console.log(TableCreated)
        // Altera o papel de parede
        ChangeWallPaper();
        if(TableCreated == true) { 
            await loadConfig()
            GetFoundServer(async (err, row) => {
                if (err) {
                    console.error(err);
                    return;
                }
    
                const serverFound = row.serverfound;
    
                if (serverFound === 1) {
                    sendComputerInfo();
                    setInterval(sendHeartbeat, 10000);
                }
            });
    
        }
        // Obtém informações do servidor encontrado
        
        // Inicializa o servidor após as etapas anteriores
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
    } catch (error) {
        console.error("Erro durante a inicialização:", error);
    }
})();
