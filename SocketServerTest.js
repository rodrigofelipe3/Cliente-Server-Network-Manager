const { spawn } = require('child_process');
const screenshot = require('screenshot-desktop');
const ffmpegPath = 'C:/ffmpeg-2024-09-19-git-0d5b68c27c-full_build/bin/ffmpeg.exe'
// Configurações de destino
const targetHost = '127.0.0.1';
const targetPort = 12345;  // Porta UDP no destinatário

// Configura o processo do FFmpeg para transmitir a captura de tela como vídeo via UDP
const ffmpeg = spawn(`${ffmpegPath}`, [
  '-f', 'image2pipe',      // Formato de entrada é um pipe de imagens
  '-r', '30',              // Taxa de quadros (10 frames por segundo)
  '-i', '-',               // Input vindo do stdin (pipe)
  '-c:v', 'libx264',       // Codec de vídeo H.264
  '-preset', 'ultrafast',  // Menor latência para codificação em tempo real
  '-f', 'mpegts',          // Formato de saída é MPEG-TS (streaming)
  `udp://${targetHost}:${targetPort}` // Saída via UDP para o endereço e porta especificados
]);

// Captura a tela e envia para o stdin do FFmpeg
setInterval(async () => {
  try {
    const img = await screenshot({ format: 'jpeg' }); // Captura a tela
    ffmpeg.stdin.write(img); // Envia a imagem capturada para o stdin do FFmpeg
  } catch (error) {
    console.error('Erro ao capturar tela:', error);
  }
}, 33);  // Captura a cada 100ms (~10 frames por segundo)

// Trata o fechamento do stdin
ffmpeg.stdin.on('error', (err) => {
  console.log('Erro no FFmpeg stdin:', err);
});
