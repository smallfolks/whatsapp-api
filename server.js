const express = require('express');
const morgan = require('morgan');
const { initClient } = require('./lib/whatsapp-client');

const app = express();
const port = process.env.PORT || 3000;

// HTTP logging
app.use(morgan('dev'));

// Initialize WhatsApp client
initClient();

// Routes
app.get('/status', require('./api/status'));
app.post('/send-message', express.json({ limit: '10mb' }), require('./api/send-message'));

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});