const express = require("express");
const Shutdown0 = require("../controllers/Shutdown");
const { updateSchedule, deleteFromSchedule } = require("../database/database");
const logToFile = require("../utils/logToFile");
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
        logToFile('Formato de horário inválido. Use HH:MM.');
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
            logToFile(response.error)
       } else { 
            logToFile(response.ok)
       }
    }catch (err){ 
        logToFile("error " + err)
    }

})

module.exports = router