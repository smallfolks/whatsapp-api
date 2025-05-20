const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Singleton client instance
let clientInstance = null;
let qrCodeData = null;
let isAuthenticated = false;

const initClient = () => {
    if (clientInstance) return clientInstance;

    clientInstance = new Client({
        authStrategy: new LocalAuth({ dataPath: '/tmp/.wwebjs_auth' }),
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
                '--disable-gpu'
            ]
        }
    });

    clientInstance.on('qr', qr => {
        qrCodeData = qr;
        qrcode.generate(qr, { small: true });
    });

    clientInstance.on('authenticated', () => {
        isAuthenticated = true;
        qrCodeData = null;
    });

    clientInstance.on('ready', () => {
        console.log('Client is ready!');
    });

    clientInstance.on('disconnected', () => {
        isAuthenticated = false;
    });

    clientInstance.initialize();

    return clientInstance;
};

const getClient = () => {
    if (!clientInstance) {
        throw new Error('Client not initialized');
    }
    return clientInstance;
};

const getQrCode = () => qrCodeData;
const isClientAuthenticated = () => isAuthenticated;

module.exports = {
    initClient,
    getClient,
    getQrCode,
    isClientAuthenticated,
    MessageMedia
};