const express = require("express")
const { Registerme } = require("./src/controllers/Registerme")
const sendHeartbeat = require("./src/controllers/SendAHb")
const { route } = require("./src/routes/routes")
const app = express()
const PORT = 5001

app.use("/api", route)

Registerme()

setInterval(sendHeartbeat, 60000);


app.listen(PORT, ()=> { 
    console.log("Server rodando na porta 5001")
})