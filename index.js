const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const BOT_TOKEN = process.env.BOT_TOKEN;

// Important: Add raw body parsing for Telegram webhooks
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Change: Move webhook logic to root path
app.post('/', async (req, res) => {
  try {
    console.log('Received webhook:', JSON.stringify(req.body)); // Add logging
    
    const { message } = req.body;

    if (message && message.text === '/start') {
      const chatId = message.chat.id;
      console.log('Processing /start command for chat:', chatId); // Add logging
      
      const keyboard = {
        inline_keyboard: [
          [{ text: 'Start', url: 't.me/wheatsol_bot/app' }],
          [{ text: 'Join Community', url: 'https://t.me/swhit_tg' }]
        ]
      };

      try {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
          chat_id: chatId,
          photo: 'https://raw.githubusercontent.com/Adesopequizzify/earn/refs/heads/main/nh/public/wheatsol.jpg',
          caption: 'Your Time on Telegram is Valuable!\n\nEngage To Unlock Rewards, participate to unlock more $SWHIT 🌾',
          reply_markup: keyboard
        });
        console.log('Successfully sent photo message'); // Add logging
      } catch (error) {
        console.error('Error sending photo:', error.response?.data || error.message);
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: 'Error sending welcome message'
        });
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add a health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('Bot is running');
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
