const express = require("express");
const Shutdown0 = require("../controllers/Shutdown");
const { updateSchedule, deleteFromSchedule } = require("../database/database");
const logToFile = require("../utils/logToFile");
const {sendProcessInfo, sendProcessInfoByMemory} = require("../controllers/sendProcessInfo");
const { ShareScreen } = require("../controllers/sendScreen");
const cancelShutdown = require("../controllers/CancelShutdown");
const router = express.Router()

router.post('/shutdown', async (req, res) => {  
    try { 
        const response = Shutdown0(res)
        console.log(response)
        return response
    }catch{ 
        return res.status(500)
    }
});

router.post('/updateSchedule/:time', (req, res) => {
    const newTime = req.params.time;
    if (!/^\d{2}:\d{2}$/.test(newTime)) {
        logToFile.logToFile('Formato de horário inválido. Use HH:MM.');
        return res.status(400)
    }
    try { 
        const response = updateSchedule(newTime, res);
        return response
    }catch(err) { 
        return res.status(500)
    }
});

router.post("/cancel/shutdown/",  async (req, res)=>{
    const id = 1
    try { 
       const response = await cancelShutdown(id)
       console.log(response)
       if (response.ok == true) { 
            logToFile.logToFile(response.msg)
            return res.status(200).json({ok: "Agendamento deletado com sucesso!"})
       } else if (response.ok == false && response.msg !== 'Command failed: shutdown -a\n' + "N�o foi poss�vel anular o desligamento do sistema porque o sistema n�o estava sendo desligado.(1116)\n") { 
            logToFile.logToFile(response.msg)
            return res.status(500).json({error: "Erro ao deletar agendamento"})
       } else if (response.ok == false && response.msg ==  'Command failed: shutdown -a\n' + "N�o foi poss�vel anular o desligamento do sistema porque o sistema n�o estava sendo desligado.(1116)\n"){ 
            logToFile.logToFile(response.msg)
            return res.status(200).json({msg: "Nenhum agendamento programado"})
       }
     
    }catch (error){ 
        logToFile.logToFile("error " + error)
        return res.status(500).json({error: "Erro interno: " + error})
    }

})

router.get("/sendprocess", async (req, res)=> { 
    try { 
        const computerData = await sendProcessInfo()
        return res.status(200).json({data: computerData})
    }catch(error){ 
        return res.status(500).json({error: "Houve um erro " + error})
    }
})

router.get("/sendprocess/memory", async (req, res)=> { 
    try { 
        const computerData = await sendProcessInfoByMemory()
        return res.status(200).json({data: computerData})
    }catch(error){ 
        return res.status(500).json({error: "Houve um erro " + error})
    }
})

router.post("/share/screen/:ip", (req, res)=>{ 

    const ip = req.params.ip
    try { 
        ShareScreen(ip)
        return res.status(200)
    }catch(err){ 
        return res.status(500)
    }
   
})

module.exports = router