require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const admin = require('firebase-admin');

const app = express();
const BOT_TOKEN = process.env.BOT_TOKEN;

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: `https://${firebaseConfig.project_id}.firebaseio.com`
});

const db = admin.firestore();

// Use JSON parser for all routes
app.use(bodyParser.json());

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    console.log('Received webhook:', JSON.stringify(req.body));
    
    const { message } = req.body;

    if (message && message.text && message.text.startsWith('/start')) {
      const chatId = message.chat.id;
      console.log('Processing /start command for chat:', chatId);
      
      // Extract referral code if present
      const parts = message.text.split(' ');
      const referralCode = parts.length > 1 ? parts[1] : null;
      
      if (referralCode) {
        console.log('Referral code detected:', referralCode);
        // Store this referral attempt in Firestore
        await db.collection('pendingReferrals').add({
          referralCode,
          chatId,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
      }

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
