const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const BOT_TOKEN = process.env.BOT_TOKEN;

// Use JSON parser for all routes
app.use(bodyParser.json());

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    console.log('Received webhook:', JSON.stringify(req.body));
    
    const { message } = req.body;

    if (message && message.text === '/start') {
      const chatId = message.chat.id;
      console.log('Processing /start command for chat:', chatId);
      
      const keyboard = {
        inline_keyboard: [
          [{ text: 'Start', url: 't.me/wheatsol_bot/app' }],
          [{ text: 'Join Community', url: 'https://t.me/swhit_tg' }]
        ]
      };

      try {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
          chat_id: chatId,
          photo: 'https://raw.githubusercontent.com/Adesopequizzify/earn/main/nh/public/wheatsol.jpg',
          caption: 'Your Time on Telegram is Valuable!\n\nEngage To Unlock Rewards, participate to unlock more $SWHIT 🌾',
          reply_markup: keyboard
        });
        console.log('Successfully sent photo message');
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

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('Bot is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

