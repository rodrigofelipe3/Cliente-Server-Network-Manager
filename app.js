const express = require("express")
const sendHeartbeat = require("./src/controllers/SendAHb")
const route = require("./src/routes/routes")
const cors = require("cors")
const checkShutdownTime = require("./src/utils/scheduleShutdown")
const logToFile = require("./src/utils/logToFile")
const sendComputerInfo = require("./src/controllers/sendComputerinfo")
const  {CreateTable, isRegistred} = require("./src/database/database")
const app = express()


const PORT = 5001

//############APP USE

app.use(cors())
app.use(express.json())
app.use("/api", route)
CreateTable()
sendComputerInfo()
setInterval(sendHeartbeat, 10000);
//setInterval(checkShutdownTime, 60000); ##Função que checa o horário e desliga o computador

//#########INICIANDO O SERVIDOR
app.listen(PORT, ()=> { 
    console.log("Servidor rodando na porta 5001")
    logToFile.clearLogFile()
    logToFile.logToFile("Server rodando na porta 5001")
})