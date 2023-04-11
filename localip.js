const os = require('os');

const interfaces = os.networkInterfaces();

Object.keys(interfaces).forEach((ifaceName) => {
  const iface = interfaces[ifaceName];
  iface.forEach((addr) => {
    if (addr.family === 'IPv4' && !addr.internal) {
      console.log(`Local IPv4 address: ${addr.address}`);
    }
  });
});