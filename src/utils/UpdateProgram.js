const fetch = require('node-fetch')
const { loadConfig } = require('../../loadConfig')
const { logToFile } = require('./logToFile')
const { findIpResponse } = require('./findServer')


const verifyUpdate = async () => {
    const { version, serverIP} = await loadConfig();
    const attemptFetch = async (resolve, reject) => {
        try {
            if (serverIP != "") {
                const url = `http://${serverIP}:5000/api/updates`;
                
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then(async (response) => {
                    const data = await response.json();
                    console.log(data);
                    resolve(data);
                })
                .catch((err) => {
                    logToFile(err);
                    console.error("Erro ao buscar atualizações:", err);

                    // Verifica se o erro é ECONNREFUSED ou outro relacionado à rede
                    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND" || err.name === "FetchError") {
                        console.log("Tentando novamente em 1 minuto...");
                        setTimeout(() => attemptFetch(resolve, reject), 60000);
                    } else {
                        reject(err);
                    }
                });
            } else {
                findIpResponse();
            }
        } catch (err) {
            console.error("Erro inesperado:", err);

            // Repete a tentativa para erros inesperados
            setTimeout(() => attemptFetch(resolve, reject), 60000);
        }
    };

    return new Promise((resolve, reject) => attemptFetch(resolve, reject));
};

const getActualVersion = () => {
    return new Promise(async (resolve, reject) => {
        const {version, serverIP} = await loadConfig()
        resolve(version)
    });
};


const ManagerUpdates = () => {
    return new Promise(async (resolve, reject) => {
        const {ok, version, filepath, instalationpath} = await verifyUpdate()
        const actualVersion = await getActualVersion()
        console.log('Versão atual: ' + actualVersion + ' Versão do Servidor: ' + version)
        if (actualVersion < version) {
            resolve(true)
        }
        resolve(false)
    })

}
module.exports = { ManagerUpdates }