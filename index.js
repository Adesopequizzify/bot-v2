const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your bot token
const BOT_TOKEN = process.env.BOT_TOKEN;

app.use(bodyParser.json());

// Helper function to send messages
async function sendMessage(chatId, text, options = {}) {
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      ...options
    });
  } catch (error) {
    console.error('Error sending message:', error.message);
    throw error;
  }
}

// Webhook handler
app.post('/webhook', async (req, res) => {
  try {
    const { message } = req.body;

    if (message && message.text === '/start') {
      const chatId = message.chat.id;
      
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
      } catch (error) {
        console.error('Error sending photo:', error);
        await sendMessage(chatId, 'Error sending welcome message');
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error in webhook handler:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Basic error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
