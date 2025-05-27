const { Client, LocalAuth } = require('whatsapp-web.js');

let client;

function createClient() {
  client = new Client({
    authStrategy: new LocalAuth({
      dataPath: './.wwebjs_auth', // session disimpan di sini
    }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
      ],
    },
  });

  client.on('ready', () => {
    console.log('WhatsApp client ready!');
  });

  client.on('auth_failure', () => {
    console.error('Authentication failure, please re-scan QR code.');
  });

  client.on('disconnected', (reason) => {
    console.log('Client disconnected:', reason);
    // reconnect otomatis setelah delay 5 detik
    setTimeout(() => {
      console.log('Reinitializing WhatsApp client...');
      client.destroy();
      createClient();
      client.initialize();
    }, 5000);
  });

  client.initialize();
}

function getClient() {
  if (!client) {
    createClient();
  }
  return client;
}

async function logoutClient() {
  if (client) {
    try {
      await client.logout();
      client.destroy();
      client = null;
      console.log('Client logged out successfully.');
      return true;
    } catch (e) {
      console.error('Logout error:', e);
      throw e;
    }
  } else {
    throw new Error('Client not initialized.');
  }
}

module.exports = {
  getClient,
  logoutClient,
};
