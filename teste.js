const { spawn } = require('child_process');

function getCpuTemperature() {
  return new Promise((resolve, reject) => {
    // Comando PowerShell para obter a temperatura
    const command = `
      (Get-WmiObject MSAcpi_ThermalZoneTemperature -Namespace "root/wmi").CurrentTemperature / 10 - 273.15
    `;

    // Executa o PowerShell usando spawn
    const powershell = spawn('powershell.exe', ['-Command', command]);

    let stdout = '';
    let stderr = '';

    // Captura a saída padrão
    powershell.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    // Captura erros, se houver
    powershell.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    // Trata o fechamento do processo
    powershell.on('close', (code) => {
      if (code !== 0 || stderr) {
        return reject(`Erro ao executar o comando: ${stderr || 'Código de saída ' + code}`);
      }

      const temperature = parseFloat(stdout.trim());
      if (isNaN(temperature)) {
        return reject('Não foi possível converter a saída em um número.');
      }

      resolve(temperature);
    });

    // Trata erros do próprio processo spawn
    powershell.on('error', (error) => {
      reject(`Erro ao iniciar o processo: ${error.message}`);
    });
  });
}

// Uso da função
getCpuTemperature()
  .then((temperature) => {
    console.log(`Temperatura atual da CPU: ${temperature.toFixed(2)}°C`);
  })
  .catch((error) => {
    console.error(error);
  });
