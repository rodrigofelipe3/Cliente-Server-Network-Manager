const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const { exec } = require('child_process');
const { loadConfig } = require('../loadConfig');
const { logToFile } = require('../src/utils/logToFile');
let caminhoAtualizacao = "";
//const caminhoInstalacao = "C:\\Program Files\\NetworkSuport";

let caminhoInstalacao = "";
const verifyUpdate = async () => {

    const { version, serverIp } = await loadConfig()
    return new Promise(async (resolve, reject) => {
        try {
            url = `http://${serverIp}:5000/api/updates`

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(async (response) => {
                    const data = await response.json()
                    resolve(data)
                })
            console.log(response)

        } catch (err) {
            reject(err)
        }
    })

}

const UpdateConfigJson = (version) => {
    console.log('Versão Update: ', version)
    try {
        fs.readFile('./config.json', 'utf-8', (err, data) => {
            if (err) {
                logToFile(err)
                return
            }
            console.log(data)
            let jsonData = JSON.parse(data)
            console.log('JSONPARSE: ' + jsonData)
            jsonData.version = version
            const options = { 
                version: version,
                serverIp: jsonData.serverIp
            }
            fs.writeFile('./config.json', JSON.stringify(options, null, 4), (err) => {
                if (err) {
                    logToFile(err)
                    return
                }

                console.log('Config.json atualizado com sucesso!!')
            })
        })
    } catch (err) {
        logToFile(err)
    }


}

const UpdateFiles = async () => {
    try {
        // Listar os arquivos na origem
        const {ok, version, filepath, instalationpath} = await verifyUpdate()
        console.log(ok, version, filepath, instalationpath)
        
        const arquivos = fs.readdirSync(filepath);
        if (version != undefined) {
            exec('taskkill /f /im NetworkPowerManager.exe')
            // Criar o diretório de destino, caso não exista
            if (!fs.existsSync(instalationpath)) {
                fs.mkdirSync(instalationpath, { recursive: true });
            }
            console.log('Procurando caminho')
            // Substituir arquivos
            arquivos.forEach((arquivo) => {
                console.log('Subistituindo arquivos')
                const origem = path.join(filepath, arquivo);
                const destino = path.join(instalationpath, arquivo);

                // Excluir arquivo anterior se já existir
                if (fs.existsSync(destino)) {
                    fs.unlinkSync(destino);
                }

                // Copiar novo arquivo
                fs.copyFileSync(origem, destino);
                console.log(`Arquivo atualizado: ${arquivo}`);
            });

            console.log("Atualização concluída!");
            UpdateConfigJson(version)
            exec('start "" """C:\\Program Files\\NetworkPower Manager\\NetworkPowerManager.exe"""')
        }

    } catch (error) {
        console.error("Erro ao atualizar arquivos:", error);
    }
}

UpdateFiles()
