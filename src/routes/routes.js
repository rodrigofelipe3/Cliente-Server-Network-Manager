const express = require("express");
const Shutdown0 = require("../controllers/Shutdown");
const router = express.Router()

router.post('/api/shutdown', async (req, res) => {  
    try { 
        const response = await Shutdown0(res)
        return response
    }catch{ 
        return res.status(500)
    }
});

module.exports = router