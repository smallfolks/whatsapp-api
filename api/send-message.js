const { getClient } = require('../lib/whatsapp-client');

module.exports = async (req, res) => {
  try {
    const client = getClient();

    if (!client.info || !client.info.wid) {
      return res.status(400).json({ success: false, error: 'Client not ready or not logged in' });
    }

    const { phone, message } = req.body;
    if (!phone || !message) {
      return res.status(400).json({ success: false, error: 'Missing phone or message' });
    }

    const chatId = phone.includes('@c.us') ? phone : phone + '@c.us';

    await client.sendMessage(chatId, message);

    res.json({ success: true, message: 'Message sent' });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
