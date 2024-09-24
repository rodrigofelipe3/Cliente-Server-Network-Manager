const express = require("express");
const Shutdown0 = require("../controllers/Shutdown");
const { updateSchedule, deleteFromSchedule } = require("../database/database");
const logToFile = require("../utils/logToFile");
const {sendProcessInfo, sendProcessInfoByMemory} = require("../controllers/sendProcessInfo");
const { ShareScreen } = require("../controllers/sendScreen");
const router = express.Router()

router.post('/shutdown', async (req, res) => {  
    try { 
        const response = await Shutdown0(res)
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

router.post("/cancel/shutdown",  (req, res)=>{
    try { 
       const response =  deleteFromSchedule(1, res)
       if (response.error) { 
        logToFile.logToFile(response.error)
       } else { 
        logToFile.logToFile(response.ok)
       }
    }catch (err){ 
        logToFile.logToFile("error " + err)
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