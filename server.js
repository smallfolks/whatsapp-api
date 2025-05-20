const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// HTTP logging
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get(['/status', '/whatsapp-api/status'], require('./api/status'));
app.post(['/send-message', '/whatsapp-api/send-message'], express.json({ limit: '10mb' }), require('./api/send-message'));
app.post(['/logout', '/whatsapp-api/logout'], require('./api/logout'));

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});