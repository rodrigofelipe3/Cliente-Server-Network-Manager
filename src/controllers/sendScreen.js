const { exec } = require('child_process');

const ffmpegPath = 'C:/ffmpeg-2024-09-19-git-0d5b68c27c-full_build/bin/ffmpeg.exe'

const ShareScreen = (ip) => { 
    const command = `${ffmpegPath} -f gdigrab -framerate 30 -video_size 1280x720 -i desktop -vcodec libx264 -pix_fmt yuv420p -preset ultrafast -f mpegts udp://${ip}:1234`;

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

module.exports = {ShareScreen}