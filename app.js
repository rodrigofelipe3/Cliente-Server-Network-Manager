const express = require("express")
const { Registerme } = require("./src/controllers/Registerme")
const app = express()
const PORT = 5001

app.use(express.Router)

Registerme()

app.listen(PORT, ()=> { 
    console.log("Server rodando na porta 5001")
})