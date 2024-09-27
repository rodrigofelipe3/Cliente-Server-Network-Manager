const {exec} = require("child_process")
const { logToFile } = require("../utils/logToFile")

const TaskKill = (pid) => { 
    return new Promise ((resolve, reject)=> { 
        const comand = `taskkill /PID ${pid} /F`
        exec(comand, (error, stdout, stderr)=> { 
            if(error){ 
                logToFile("Houve um erro: " + error)
                resolve({ok: false, msg: error})
            }else if(stderr){ 
                logToFile("Houve um erro: " + error)
                resolve({ok: false, msg: stderr})
            }else { 
                logToFile(`Programa ${pid} finalizado!`)
                resolve({ok: true, msg: `Programa ${pid} finalizado!`})
            }
        })
    })
}

module.exports = { 
    TaskKill
}