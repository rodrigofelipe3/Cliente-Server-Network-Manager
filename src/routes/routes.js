const express = require("express");
const {Shutdown0, Restart} = require("../controllers/Shutdown");
const { updateSchedule, deleteFromSchedule } = require("../database/database");
const logToFile = require("../utils/logToFile");
const {sendProcessInfo, sendProcessInfoByMemory} = require("../controllers/sendProcessInfo");
const cancelShutdown = require("../controllers/CancelShutdown");
const { TaskKill } = require("../controllers/Taskkill");
const { SystemFileCheck, ChkDsk, checkHealth, ScanHealth, RestoreHealth } = require("../controllers/CMDCommand");
const router = express.Router()



router.post('/cmdcommand', (req, res)=>{ 
    const {type} = req.body
    try{
        if(type == "sfc"){ 
            SystemFileCheck()
        }if(type == 'chkdsk'){ 
            ChkDsk()
        }if(type == 'checkhealth'){ 
            checkHealth()
        }if(type == 'scanhealth'){ 
            ScanHealth()
        }if(type == 'restorehealth'){ 
            RestoreHealth()
        }
        return res.status(200).json({ok: true})
    }catch(err){ 
        return res.status(500).json({ok: false, error: err})
    }
       
})


router.post('/shutdown', async (req, res) => {  
    const seconds = 600
    try { 
        const response = await Shutdown0(seconds)
        if(response.ok == true) { 
            return res.status(200).json({ok: true, msg: response.msg})
        }else { 
            return res.status(200).json({ok: true, error: response.error})
        }
    }catch{ 
        return res.status(500)
    }
});

router.post('/shutdown/now', async (req, res) => {  
    const seconds = 10
    try { 
        const response = await Shutdown0( seconds)
        if(response.ok == true) { 
            return res.status(200).json({ok: true, msg: response.msg})
        }else { 
            return res.status(200).json({ok: true, error: response.error})
        }
    }catch(err){ 
        return res.status(500).json({ok: false, error: "Erro interno" + err})
    }
});

router.post('/restart/now', async (req, res) => {  
    try { 
        const response = await Restart()
        if(response.ok == true) { 
            return res.status(200).json({ok: true, msg: response.msg})
        }else { 
            return res.status(200).json({ok: true, error: response.error})
        }
    }catch(err){ 
        return res.status(500).json({ok: false, error: "Erro interno" + err})
    }
});

router.post('/createshutdown/:time', (req, res) => {
    const newTime = req.params.time;
    if (!/^\d{2}:\d{2}$/.test(newTime)) {
        logToFile.logToFile('Formato de horário inválido. Use HH:MM.');
        return res.status(400).json({ok: false, error: "Erro na sintaxe do horário"})
    }
    try { 
        const response = updateSchedule(newTime, res);
        return response
    }catch(err) { 
        return res.status(500).json({ok: false, error: "Erro interno no cliente, tente novamente."})
    }
});

router.post("/cancel/shutdown",  async (req, res)=>{
    const id = 1
    try { 
       const response = await cancelShutdown(id)
       console.log(response)
       if (response.ok == true) { 
            logToFile.logToFile(response.msg)
            return res.status(200).json({ok: true, msg: "Desligamento programado cancelado com sucesso!"})
       } else if (response.ok == false && response.msg !== 'Command failed: shutdown -a\n' + "N�o foi poss�vel anular o desligamento do sistema porque o sistema n�o estava sendo desligado.(1116)\n") { 
            logToFile.logToFile(response.msg)
            return res.status(500).json({ok: false, error: "Erro ao deletar agendamento"})
       } else if (response.ok == false && response.msg ==  'Command failed: shutdown -a\n' + "N�o foi poss�vel anular o desligamento do sistema porque o sistema n�o estava sendo desligado.(1116)\n"){ 
            logToFile.logToFile(response.msg)
            return res.status(200).json({ok: true, msg: "Desligamento programado cancelado com sucesso!"})
       }
     
    }catch (error){ 
        logToFile.logToFile("error " + error)
        return res.status(500).json({ok: false, error: "Erro interno: " + error})
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


router.post("/taskkill/:pid", async (req, res)=> { 
    const pid = req.params.pid
    try { 
        const response = await TaskKill(pid)
        if(response.ok == true) { 
            return res.status(200).json(response)
        } else { 
            return res.status(404).json(response)
        }
    }catch(error){ 
        return res.status(500).json({error: "Erro interto " + error})
    }
})

module.exports = router