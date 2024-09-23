/*const { exec } = require('child_process');

//const ffmpegPath = 'C:/ffmpeg-2024-09-19-git-0d5b68c27c-full_build/bin/ffmpeg.exe'
const ffmpegPath = 'C:/ffmpeg-2024-09-19-git-0d5b68c27c-full_build/bin/ffmpeg.exe'
const ShareScreen = (ip) => { 
    //const command = `${ffmpegPath} -f gdigrab -framerate 30 -video_size 1280x720 -i desktop -vcodec libx264 -pix_fmt yuv420p -preset ultrafast -f mpegts udp://${ip}:1234`;

    const command = `${ffmpegPath} -f gdigrab -i desktop -f mpegts udp://127.0.0.1:1234`
exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Erro ao capturar tela: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
}

module.exports = {ShareScreen}*/

const ffmpeg = require('fluent-ffmpeg');

// IP e porta do servidor administrador
const SERVER_IP = '127.0.0.1';  // Ou o IP do servidor administrador
const SERVER_PORT = 1234;  // Porta que o administrador está usando para receber o stream

const pathToFfmpeg = 'C:/ffmpeg-2024-09-19-git-0d5b68c27c-full_build/bin/ffmpeg.exe'; // Caminho completo para o FFmpeg

// Definir o caminho para o executável do FFmpeg
ffmpeg.setFfmpegPath(pathToFfmpeg);
const ShareScreen = () => { 
    // Definir o comando FFmpeg para capturar a tela e enviar via UDP
const ffmpegCommand = new ffmpeg()
.input('desktop')  // Para capturar a tela (pode variar por sistema operacional)
.inputFormat('dshow')  // gdigrab para captura de tela no Windows, ou use outro método conforme o SO
.videoCodec('libx264')
.format('mpegts')
.output(`udp://${SERVER_IP}:${SERVER_PORT}`)
.on('start', () => {
    console.log(`Iniciando transmissão para udp://${SERVER_IP}:${SERVER_PORT}`);
})
.on('error', (err) => {
    console.error('Erro no FFmpeg:', err);
})
.on('end', () => {
    console.log('Transmissão finalizada');
});

// Iniciar o FFmpeg para enviar o stream via UDP
ffmpegCommand.run();
}

module.exports = {ShareScreen}