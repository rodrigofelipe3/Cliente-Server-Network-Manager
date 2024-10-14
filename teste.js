function filtrarAdaptadores(adaptadores) {
  // Lista de adaptadores a serem removidos
  const adaptadoresRemover = ['Loopback Pseudo-Interface 1', 'Hyper-V Virtual Ethernet Adapter'];

  // Transforma a string de adaptadores em um array
  let adaptadoresArray = adaptadores.split(', ');

  // Filtra o array, removendo os adaptadores indesejados
  let adaptadoresFiltrados = adaptadoresArray.filter(adaptador => !adaptadoresRemover.includes(adaptador));

  // Junta o array filtrado de volta para uma string
  return adaptadoresFiltrados.join(', ');
}

// Exemplo de adaptadores recebidos
const todosAdaptadores = 'Realtek PCIe GbE Family Controller, Loopback Pseudo-Interface 1, Hyper-V Virtual Ethernet Adapter, Killer Wireless-n/a/ac 1535 Wireless Network Adapter';

// Chama a função para filtrar os adaptadores
const adaptadoresFiltrados = filtrarAdaptadores(todosAdaptadores);
console.log(adaptadoresFiltrados);