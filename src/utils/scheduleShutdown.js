const { GetData } = require('../database/database');
const logToFile = require('./logToFile');

const checkShutdownTime = () => {
    GetData((err, row)=> { 
        if (row) {
            const currentTime = new Date();
            const currentHours = currentTime.getHours();
            const currentMinutes = currentTime.getMinutes();
            const [scheduledHours, scheduledMinutes] = row.time.split(':').map(Number);

            if (currentHours > scheduledHours || (currentHours === scheduledHours && currentMinutes >= scheduledMinutes)) {
                logToFile('Horário agendado alcançado, iniciando shutdown.');
                Shutdown0();
            } else {
                logToFile(`Horário atual (${currentHours}:${currentMinutes}) ainda não atingiu o agendado (${scheduledHours}:${scheduledMinutes}).`);
            }
        } else {
            logToFile('Nenhum horário encontrado na tabela.');
        }
    })

};


module.exports = checkShutdownTime