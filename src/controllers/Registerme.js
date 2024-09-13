const process = require("child_process");
const os = require("os");
const axios = require("axios");
const Registerme = (req, res) => {
  
  try {
    const networkInterface = os.networkInterfaces();
    let ethernetDetails = [];

    for (let interfaceName in networkInterface) {
      if (interfaceName.toLowerCase().includes("ethernet")) {
        networkInterface[interfaceName].forEach((iface) => {
          if (iface.family === "IPv4" && !iface.internal) {
            ethernetDetails.push({
              hostname: os.hostname(),
              ip: iface.address,
              mac: iface.mac,
            });
          }
        });
      }
    }
    const response =  registerComputer(ethernetDetails.length > 0 ? ethernetDetails[0] : null);
    if(!response){ 
        console.log("Erro ao se conectar com o servidor principal sem dados")  
    }else if(response === true){ 
        console.log("Conectado com sucesso!")
    }
  } catch (error) {
    console.log(error)
  }
};

const registerComputer = async (ethernetDetails) => {
    console.log(ethernetDetails)
  if (!ethernetDetails) {
    return null;
  } else {
    const { hostname, ip, mac } = ethernetDetails;
    console.log(hostname, ip, mac)
    const url = `http://localhost:5000/api/registerComputer/${hostname}/${ip}/${mac}/conectado`;

    //const url = `http://10.10.1.45:5000/registerComputer/${hostname}/${ip}/${mac}`;

    try {
      await axios.post(url);
      return true;
    } catch (error) {
      console.error("Erro na requisição POST:", error.message);
    }
  }
};
module.exports = { Registerme };
