const { exec } = require('child_process');

const getMonitorInfo = () => {
  return new Promise((resolve, reject) => {
    exec('powershell -Command "Get-CimInstance -ClassName Win32_DesktopMonitor | Select-Object Caption, PNPDeviceID, ScreenWidth, ScreenHeight"', (error, stdout, stderr) => {
      if (error) {
        reject(`Erro ao executar PowerShell: ${error.message}`);
        return;
      }

      if (stderr) {
        reject(`Erro no PowerShell: ${stderr}`);
        return;
      }

      // Processa a saída do PowerShell
      const lines = stdout.split('\n').filter(line => line.trim() !== ''); // Remove linhas vazias
      const monitors = [];

      // Ignora a primeira linha (cabeçalhos)
      lines.slice(1).forEach(line => {
        const [caption, pnpDeviceID, screenWidth, screenHeight] = line.trim().split(/\s{2,}/); // Divide por múltiplos espaços
        monitors.push({
          Nome: caption || "Desconhecido",
          ID: pnpDeviceID || "Desconhecido",
          Resolução: `${screenWidth || "Desconhecida"}x${screenHeight || "Desconhecida"}`
        });
      });

      resolve(monitors);
    });
  });
};

// Exemplo de uso
getMonitorInfo()
  .then(monitors => {
    console.log("Monitores Conectados:");
    monitors.forEach((monitor, index) => {
      console.log(`Monitor ${index + 1}:`);
      console.log(`  Nome: ${monitor.Nome}`);
      console.log(`  ID: ${monitor.ID}`);
      console.log(`  Resolução: ${monitor.Resolução}`);
      console.log('');
    });
  })
  .catch(error => {
    console.error("Erro:", error);
  });
