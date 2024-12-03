const fs = require('fs');
const path = require('path');
const { logToFile } = require('./logToFile');
const sudo = require('sudo-prompt')

const ChangeWallPaper = async () => {
    let wallpaperpath = []
    wallpaperpath = await ListItens('\\\\serv-dados\\UTILITARIOS\\WallPaper')
    if (wallpaperpath.length > 1) {
        console.log('executando primeiro comando')
        sudo.exec(`reg add "HKCU\\Control Panel\\Desktop" /v Wallpaper /t REG_SZ /d "${wallpaperpath[0]}" /f`, {name: 'changewallpaper'}, (err, stdout, stderr) => {
            if (err) {
                logToFile('Erro ao adicionar o caminho do Wallpaper: ', err)
            } else if (stdout) {
                console.log('executando segundo comando')
                sudo.exec(`RUNDLL32.EXE user32.dll,UpdatePerUserSystemParameters`, {name: 'rundll32.exe'}, (err, stdout, stderr) => {
                    if (err) {
                        logToFile('Erro ao forçar a atualização do Wallpaper: ', err)
                    } else if (stdout) {
                        console.log(stdout)
                    } else if (stderr) {
                        logToFile('Erro ao forçar a atualização do Wallpaper: ', stderr)
                    }
                })

            } else if (stderr) {
                logToFile('Erro ao adicionar o caminho do Wallpaper: ', stderr)
            }
        })
    }
}

async function ListItens(pathitem) {
    try {
        // Obtém a lista de itens no diretório
        const itens = fs.readdirSync(pathitem);
        console.log('Buscando na rede..;')
        // Mapeia cada item para seu caminho completo
        const CompletePath = itens.map((item) => path.join(pathitem, item));

        return CompletePath;
    } catch (erro) {
        console.error(`Erro ao acessar o diretório: ${erro.message}`);
        return [];
    }
}


module.exports = { ChangeWallPaper }